-- Storage bucket for publication PDFs
INSERT INTO storage.buckets (id, name, public)
VALUES ('publication-pdfs', 'publication-pdfs', true);

CREATE POLICY "Publication PDFs are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'publication-pdfs');

CREATE POLICY "Authenticated users can upload publication PDFs"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'publication-pdfs');

CREATE POLICY "Authenticated users can delete publication PDFs"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'publication-pdfs');