-- Optional maintenance for the four sample tours in a portfolio database.
-- Only expired rows with the original seed titles are changed.
UPDATE public.tours
SET start_date = CURRENT_DATE + CASE tour_id
  WHEN 1 THEN 20
  WHEN 2 THEN 10
  WHEN 3 THEN 15
  WHEN 4 THEN 25
END
WHERE start_date < CURRENT_DATE
  AND (tour_id, tour_title) IN (
    (1, 'Tassili n''Ajjer Plateau Trek & Rock Art'),
    (2, 'Casbah of Algiers & Ottoman Palaces Walk'),
    (3, 'Ghardaïa & M''Zab Valley Architectural Heritage'),
    (4, 'Roman Wonders of Djémila & Timgad')
  );
