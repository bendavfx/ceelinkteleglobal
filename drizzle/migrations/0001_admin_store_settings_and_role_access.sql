GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
CREATE TABLE public.store_settings (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  owner_email text,
  whatsapp_number text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.store_settings TO authenticated;
GRANT ALL ON public.store_settings TO service_role;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins manage store settings" ON public.store_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER store_settings_updated_at BEFORE UPDATE ON public.store_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;