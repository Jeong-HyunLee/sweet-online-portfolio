-- Swap image URLs to correct equipment
-- Vacuum Oven gets accutom.jpg (which is actually vacuum oven photo)
UPDATE lab_equipment SET image_url = 'https://kcyyabttswfojppiwngt.supabase.co/storage/v1/object/public/lab-equipment-images/accutom.jpg' WHERE id = '10687686-dfb9-4aab-bbc3-b24cb96e95ed';

-- Accutom-100 gets secotom.jpg (which is actually accutom photo)
UPDATE lab_equipment SET image_url = 'https://kcyyabttswfojppiwngt.supabase.co/storage/v1/object/public/lab-equipment-images/secotom.jpg' WHERE id = 'dbcf94c6-d032-4e89-95c4-cb8bfa7ea07e';

-- Secotom-50 gets hotplate.jpg (which is actually secotom photo)
UPDATE lab_equipment SET image_url = 'https://kcyyabttswfojppiwngt.supabase.co/storage/v1/object/public/lab-equipment-images/hotplate.jpg' WHERE id = '71dd9f72-24c7-4685-b984-e92ef3a38cb8';

-- Digital Hot Plates has no correct image now, set to null
UPDATE lab_equipment SET image_url = NULL WHERE id = 'ec01ab1e-7fca-42db-a976-bb737927c4c5';
