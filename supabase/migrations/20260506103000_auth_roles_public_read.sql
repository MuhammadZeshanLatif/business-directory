-- Auth, roles, and public listing visibility.
-- Run this after existing businesses migrations.

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  email text,
  full_name text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  approved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  );
$$;

ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS owner_id uuid REFERENCES auth.users (id) ON DELETE SET NULL;

DROP POLICY IF EXISTS "businesses_select_anon" ON public.businesses;
DROP POLICY IF EXISTS "businesses_insert_anon" ON public.businesses;
DROP POLICY IF EXISTS "businesses_update_anon" ON public.businesses;
DROP POLICY IF EXISTS "businesses_delete_anon" ON public.businesses;
DROP POLICY IF EXISTS "businesses_select_scope" ON public.businesses;
DROP POLICY IF EXISTS "businesses_insert_scope" ON public.businesses;
DROP POLICY IF EXISTS "businesses_update_scope" ON public.businesses;
DROP POLICY IF EXISTS "businesses_delete_scope" ON public.businesses;

-- Anyone can read approved listings.
CREATE POLICY "businesses_select_public"
  ON public.businesses FOR SELECT
  USING (
    status = 'approved'
    OR owner_id = auth.uid()
    OR public.is_admin()
  );

-- Only logged-in user can add listing for themselves.
CREATE POLICY "businesses_insert_owner"
  ON public.businesses FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

-- Owner or admin can update/delete.
CREATE POLICY "businesses_update_owner_or_admin"
  ON public.businesses FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid() OR public.is_admin())
  WITH CHECK (owner_id = auth.uid() OR public.is_admin());

CREATE POLICY "businesses_delete_owner_or_admin"
  ON public.businesses FOR DELETE
  TO authenticated
  USING (owner_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "profiles_select_scope" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_admin" ON public.profiles;

CREATE POLICY "profiles_select_self_or_admin"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid() OR public.is_admin());

CREATE POLICY "profiles_update_admin"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- After running this migration, promote first admin manually:
-- UPDATE public.profiles SET role = 'admin', approved = true WHERE email = 'you@example.com';
