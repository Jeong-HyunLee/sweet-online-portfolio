-- Add doi column to lab_news for publication links
ALTER TABLE public.lab_news ADD COLUMN IF NOT EXISTS doi text;