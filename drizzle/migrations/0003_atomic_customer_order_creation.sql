CREATE OR REPLACE FUNCTION public.create_customer_order(
  p_idempotency_key uuid,
  p_customer_name text,
  p_customer_email text,
  p_customer_phone text,
  p_fulfillment text,
  p_state text DEFAULT NULL,
  p_city text DEFAULT NULL,
  p_address text DEFAULT NULL,
  p_landmark text DEFAULT NULL,
  p_delivery_instructions text DEFAULT NULL,
  p_pickup_notes text DEFAULT NULL,
  p_items jsonb DEFAULT '[]'::jsonb
) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp
AS $$
DECLARE
  v_existing public.orders%ROWTYPE;
  v_product public.products%ROWTYPE;
  v_item jsonb;
  v_items jsonb := '[]'::jsonb;
  v_id uuid;
  v_quantity integer;
  v_subtotal numeric(12,2) := 0;
  v_order public.orders%ROWTYPE;
  v_ref text;
BEGIN
  SELECT * INTO v_existing FROM public.orders WHERE idempotency_key = p_idempotency_key;
  IF FOUND THEN
    RETURN jsonb_build_object('order_id', v_existing.id, 'order_ref', v_existing.order_ref, 'subtotal', v_existing.subtotal, 'items', v_existing.items, 'duplicate', true);
  END IF;

  IF p_items IS NULL OR jsonb_typeof(p_items) <> 'array' OR jsonb_array_length(p_items) < 1 OR jsonb_array_length(p_items) > 25 THEN
    RAISE EXCEPTION 'Invalid order items';
  END IF;
  IF p_fulfillment NOT IN ('delivery','pickup') THEN RAISE EXCEPTION 'Invalid fulfilment method'; END IF;
  IF p_customer_name IS NULL OR btrim(p_customer_name) = '' OR p_customer_email IS NULL OR p_customer_phone IS NULL THEN
    RAISE EXCEPTION 'Customer details are incomplete';
  END IF;

  FOR v_item IN SELECT value FROM jsonb_array_elements(p_items) ORDER BY (value->>'product_id') LOOP
    v_id := (v_item->>'product_id')::uuid;
    v_quantity := (v_item->>'quantity')::integer;
    IF v_quantity < 1 OR v_quantity > 50 THEN RAISE EXCEPTION 'Invalid product quantity'; END IF;
    SELECT * INTO v_product FROM public.products WHERE id = v_id FOR UPDATE;
    IF NOT FOUND THEN RAISE EXCEPTION 'A product in this order is no longer available'; END IF;
    IF v_product.availability NOT IN ('available','preorder') THEN RAISE EXCEPTION 'A product in this order is no longer available'; END IF;
    IF v_product.availability = 'available' AND v_product.stock < v_quantity THEN RAISE EXCEPTION 'There is not enough stock for %', v_product.name; END IF;

    v_items := v_items || jsonb_build_array(jsonb_build_object(
      'product_id', v_product.id,
      'name', v_product.name,
      'brand', v_product.brand,
      'model', v_product.model,
      'variant', v_product.variant,
      'price', v_product.price,
      'quantity', v_quantity,
      'image_url', v_product.image_url,
      'availability', v_product.availability
    ));
    v_subtotal := v_subtotal + (v_product.price * v_quantity);

    IF v_product.availability = 'available' THEN
      UPDATE public.products
      SET stock = stock - v_quantity,
          availability = CASE WHEN stock - v_quantity = 0 THEN 'out_of_stock'::public.availability_status ELSE availability END
      WHERE id = v_product.id;
    END IF;
  END LOOP;

  v_ref := 'CTG-' || to_char(clock_timestamp(), 'YYMMDDHH24MISS') || '-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));
  INSERT INTO public.orders (
    order_ref, idempotency_key, customer_name, customer_email, customer_phone, fulfillment,
    state, city, address, landmark, delivery_instructions, pickup_notes, items, subtotal
  ) VALUES (
    v_ref, p_idempotency_key, btrim(p_customer_name), lower(btrim(p_customer_email)), btrim(p_customer_phone), p_fulfillment::public.order_fulfillment,
    nullif(btrim(p_state),''), nullif(btrim(p_city),''), nullif(btrim(p_address),''), nullif(btrim(p_landmark),''), nullif(btrim(p_delivery_instructions),''), nullif(btrim(p_pickup_notes),''), v_items, v_subtotal
  ) RETURNING * INTO v_order;
  RETURN jsonb_build_object('order_id', v_order.id, 'order_ref', v_order.order_ref, 'subtotal', v_order.subtotal, 'items', v_order.items, 'duplicate', false);
END;
$$;
REVOKE ALL ON FUNCTION public.create_customer_order(uuid,text,text,text,text,text,text,text,text,text,text,jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_customer_order(uuid,text,text,text,text,text,text,text,text,text,text,jsonb) TO service_role;
CREATE OR REPLACE FUNCTION public.restore_cancelled_order_stock() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
DECLARE v_item jsonb;
BEGIN
  IF NEW.status = 'cancelled' AND OLD.status IS DISTINCT FROM 'cancelled' THEN
    FOR v_item IN SELECT value FROM jsonb_array_elements(NEW.items) LOOP
      IF v_item->>'availability' = 'available' THEN
        UPDATE public.products SET stock = stock + (v_item->>'quantity')::integer,
          availability = CASE WHEN availability = 'out_of_stock' AND (v_item->>'quantity')::integer > 0 THEN 'available'::public.availability_status ELSE availability END
        WHERE id = (v_item->>'product_id')::uuid;
      END IF;
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER orders_cancelled_restore_stock AFTER UPDATE OF status ON public.orders FOR EACH ROW EXECUTE FUNCTION public.restore_cancelled_order_stock();