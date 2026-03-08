
-- Create lab_equipment table
CREATE TABLE public.lab_equipment (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  image_url text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.lab_equipment ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view lab_equipment" ON public.lab_equipment FOR SELECT USING (true);
CREATE POLICY "Admins can insert lab_equipment" ON public.lab_equipment FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update lab_equipment" ON public.lab_equipment FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete lab_equipment" ON public.lab_equipment FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Create storage bucket for lab equipment images
INSERT INTO storage.buckets (id, name, public) VALUES ('lab-equipment-images', 'lab-equipment-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Anyone can view lab equipment images" ON storage.objects FOR SELECT USING (bucket_id = 'lab-equipment-images');
CREATE POLICY "Admins can upload lab equipment images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'lab-equipment-images' AND has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update lab equipment images" ON storage.objects FOR UPDATE USING (bucket_id = 'lab-equipment-images' AND has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete lab equipment images" ON storage.objects FOR DELETE USING (bucket_id = 'lab-equipment-images' AND has_role(auth.uid(), 'admin'::app_role));
