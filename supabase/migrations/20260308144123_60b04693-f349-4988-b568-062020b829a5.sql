-- Fix lab_news RLS: keep public read, restrict write to admins
DROP POLICY IF EXISTS "Authenticated users can delete news" ON public.lab_news;
DROP POLICY IF EXISTS "Authenticated users can insert news" ON public.lab_news;
DROP POLICY IF EXISTS "Authenticated users can update news" ON public.lab_news;

CREATE POLICY "Admins can insert news"
ON public.lab_news FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update news"
ON public.lab_news FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete news"
ON public.lab_news FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));