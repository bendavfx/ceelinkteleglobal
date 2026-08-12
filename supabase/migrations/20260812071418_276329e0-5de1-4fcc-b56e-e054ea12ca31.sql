CREATE TYPE public.app_role AS ENUM ('admin','customer');
CREATE TYPE public.availability_status AS ENUM ('available','sold_out','out_of_stock','preorder');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "admins read all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  image_url text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories public read" ON public.categories FOR SELECT USING (true);
CREATE POLICY "categories admin write" ON public.categories FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  brand text,
  short_description text,
  description text,
  specifications jsonb NOT NULL DEFAULT '[]'::jsonb,
  condition_note text,
  warranty text,
  price numeric(12,2) NOT NULL,
  previous_price numeric(12,2),
  stock integer NOT NULL DEFAULT 0,
  availability public.availability_status NOT NULL DEFAULT 'available',
  is_featured boolean NOT NULL DEFAULT false,
  image_url text,
  gallery jsonb NOT NULL DEFAULT '[]'::jsonb,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX products_category_idx ON public.products(category_id);
CREATE INDEX products_availability_idx ON public.products(availability);
GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products public read" ON public.products FOR SELECT USING (true);
CREATE POLICY "products admin write" ON public.products FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.categories (name, slug, description, sort_order) VALUES
 ('Laptops','laptops','Business and creator laptops, tested and ready to work.',1),
 ('Phones','phones','Brand new and clean pre-owned smartphones.',2),
 ('Smartwatches','smartwatches','Apple Watch and smart wearables.',3),
 ('Accessories','accessories','Chargers, cables and everyday gadget essentials.',4);

INSERT INTO public.products (name, slug, brand, short_description, description, specifications, condition_note, warranty, price, previous_price, stock, availability, is_featured, image_url, gallery, category_id) VALUES
('HP EliteBook Folio 9480m','hp-elitebook-folio-9480m','HP','Slim business ultrabook with backlit keyboard and charger included.','A dependable slim business laptop from HP''s EliteBook Folio line. Available in 4GB and 8GB RAM options, with a 500GB hard drive, backlit keyboard and charger included.','["Intel Core i5","4GB / 8GB RAM options","500GB HDD","Keyboard light","Includes charger"]'::jsonb,'Neat, tested and working. Price varies by RAM option: ₦130,000 (4GB) / ₦180,000 (8GB).',NULL,130000,180000,4,'available',true,'/__l5e/assets-v1/55c35a1e-1c07-4f0f-96bb-4f78dd93691c/product1.jpg','["/__l5e/assets-v1/55c35a1e-1c07-4f0f-96bb-4f78dd93691c/product1.jpg"]'::jsonb,(SELECT id FROM public.categories WHERE slug='laptops')),
('MacBook Pro 2021 16-inch','macbook-pro-2021-16-inch','Apple','M1 Max powerhouse with 64GB RAM and 1TB storage.','The 16-inch MacBook Pro 2021 with the M1 Max chip, 64GB of unified memory and 1TB of storage. Built for heavy creative and engineering workloads.','["Apple M1 Max","64GB RAM","1TB storage","16-inch Liquid Retina XDR"]'::jsonb,'MDM bypassed. US import.',NULL,1300000,NULL,1,'available',true,'/__l5e/assets-v1/05077d77-84ad-48b0-bc2f-70df4f06e989/product2.jpg','["/__l5e/assets-v1/05077d77-84ad-48b0-bc2f-70df4f06e989/product2.jpg"]'::jsonb,(SELECT id FROM public.categories WHERE slug='laptops')),
('iPhone 17 — 256GB','iphone-17-256gb','Apple','Brand new sealed iPhone 17 with 256GB storage.','Brand new iPhone 17 in 256GB. Sealed box, ready for pickup or nationwide delivery.','["Brand new","256GB storage","Sealed box"]'::jsonb,'Locked.',NULL,780000,NULL,2,'available',true,'/__l5e/assets-v1/8af59467-737d-40ad-945f-1f6619d83ff9/product3.jpg','["/__l5e/assets-v1/8af59467-737d-40ad-945f-1f6619d83ff9/product3.jpg"]'::jsonb,(SELECT id FROM public.categories WHERE slug='phones')),
('Apple Watch Series 6 44mm','apple-watch-series-6-44mm','Apple','Mint condition Apple Watch Series 6 with GPS + LTE.','Apple Watch Series 6, 44mm, in mint condition with GPS and LTE connectivity. Comes with a black sport band.','["44mm case","GPS + LTE","Mint condition","Black sport band"]'::jsonb,'Mint condition. US import.',NULL,180000,NULL,3,'available',true,'/__l5e/assets-v1/aab1b196-9701-4f9f-ae1a-7be44916d4af/product4.jpg','["/__l5e/assets-v1/aab1b196-9701-4f9f-ae1a-7be44916d4af/product4.jpg"]'::jsonb,(SELECT id FROM public.categories WHERE slug='smartwatches'));