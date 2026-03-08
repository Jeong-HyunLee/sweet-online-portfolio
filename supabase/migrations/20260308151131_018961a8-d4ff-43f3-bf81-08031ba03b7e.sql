-- Publications table
CREATE TABLE public.publications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  authors text NOT NULL,
  year text NOT NULL DEFAULT '',
  title text NOT NULL,
  journal text NOT NULL DEFAULT '',
  doi text NOT NULL DEFAULT '',
  type text NOT NULL DEFAULT 'journal',
  highlight text,
  pdf_url text,
  visibility text NOT NULL DEFAULT 'public',
  keywords text[] DEFAULT '{}',
  research_topics text[] DEFAULT '{}',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view public publications" ON public.publications
FOR SELECT USING (true);

CREATE POLICY "Admins can insert publications" ON public.publications
FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update publications" ON public.publications
FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete publications" ON public.publications
FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Members table
CREATE TABLE public.members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL DEFAULT '',
  topic text NOT NULL DEFAULT '',
  period text NOT NULL DEFAULT '',
  is_alumni boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view members" ON public.members
FOR SELECT USING (true);

CREATE POLICY "Admins can insert members" ON public.members
FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update members" ON public.members
FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete members" ON public.members
FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Gallery table
CREATE TABLE public.gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  alt text NOT NULL DEFAULT '',
  caption text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view gallery" ON public.gallery
FOR SELECT USING (true);

CREATE POLICY "Admins can insert gallery" ON public.gallery
FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update gallery" ON public.gallery
FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete gallery" ON public.gallery
FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Add updated_at trigger to publications
CREATE TRIGGER update_publications_updated_at
  BEFORE UPDATE ON public.publications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();