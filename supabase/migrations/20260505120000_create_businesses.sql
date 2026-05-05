-- Businesses directory table (matches src/types Business)

CREATE TABLE public.businesses (
  id text PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL,
  description text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  website text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT '',
  status text NOT NULL CHECK (status IN ('approved', 'pending')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX businesses_category_idx ON public.businesses (category);
CREATE INDEX businesses_city_idx ON public.businesses (city);
CREATE INDEX businesses_status_idx ON public.businesses (status);

ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

-- Demo-friendly policies (same as localStorage: anyone can read/write). Tighten before production.
CREATE POLICY "businesses_select_anon" ON public.businesses FOR SELECT USING (true);
CREATE POLICY "businesses_insert_anon" ON public.businesses FOR INSERT WITH CHECK (true);
CREATE POLICY "businesses_update_anon" ON public.businesses FOR UPDATE USING (true);
CREATE POLICY "businesses_delete_anon" ON public.businesses FOR DELETE USING (true);
