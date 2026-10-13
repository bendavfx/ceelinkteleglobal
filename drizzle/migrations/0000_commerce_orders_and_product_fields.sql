ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sku text; ALTER TABLE public.products ADD COLUMN IF NOT EXISTS model text; ALTER TABLE public.products ADD COLUMN IF NOT EXISTS variant text; ALTER TABLE public.products ADD COLUMN IF NOT EXISTS video_urls jsonb NOT NULL DEFAULT '[]'::jsonb; ALTER TABLE public.products ADD COLUMN IF NOT EXISTS subcategory text;
CREATE TYPE public.order_status AS ENUM ('new_request','contacted','awaiting_payment','paid','processing','dispatched','completed','cancelled');
CREATE TYPE public.order_fulfillment AS ENUM ('delivery','pickup');
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_ref text NOT NULL UNIQUE,
  idempotency_key uuid NOT NULL UNIQUE,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  fulfillment public.order_fulfillment NOT NULL,
  state text,
  city text,
  address text,
  landmark text,
  delivery_instructions text,
  pickup_notes text,
  items jsonb NOT NULL,
  subtotal numeric(12,2) NOT NULL,
  status public.order_status NOT NULL DEFAULT 'new_request',
  email_notification_status text NOT NULL DEFAULT 'not_configured',
  email_notification_error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.orders TO service_role;
GRANT SELECT, UPDATE ON public.orders TO authenticated;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins read orders" ON public.orders FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins update orders" ON public.orders FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE INDEX orders_created_at_idx ON public.orders(created_at DESC);
CREATE INDEX orders_status_idx ON public.orders(status);
CREATE TABLE public.order_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL,
  status public.order_status NOT NULL,
  changed_by uuid,
  changed_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.order_status_history TO service_role;
GRANT SELECT ON public.order_status_history TO authenticated;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins read order status history" ON public.order_status_history FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE INDEX order_status_history_order_idx ON public.order_status_history(order_id, changed_at);
CREATE OR REPLACE FUNCTION public.record_order_status_history() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' OR NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO public.order_status_history(order_id, status, changed_by) VALUES (NEW.id, NEW.status, auth.uid());
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER orders_status_history AFTER INSERT OR UPDATE OF status ON public.orders FOR EACH ROW EXECUTE FUNCTION public.record_order_status_history();
CREATE TRIGGER orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();