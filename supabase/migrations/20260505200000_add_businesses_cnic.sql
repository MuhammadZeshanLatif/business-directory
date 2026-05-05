-- CNIC (national ID) for listings — required in app for new submissions

ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS cnic text NOT NULL DEFAULT '';

COMMENT ON COLUMN public.businesses.cnic IS 'Pakistan CNIC (13 digits); stored formatted as #####-#######-# where possible.';
