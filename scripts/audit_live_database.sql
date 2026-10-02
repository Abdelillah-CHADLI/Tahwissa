-- Read-only audit for the deployed Supabase project. Returns one result grid.
WITH expected_tables(name) AS (
  VALUES ('users'), ('travellers'), ('agencies'), ('guides'), ('agency_employees'),
         ('tours'), ('tour_images'), ('bookings'), ('reviews'), ('posts'),
         ('comments'), ('likes'), ('postreports'), ('accreports'),
         ('agencyverification'), ('guideverification')
),
table_checks AS (
  SELECT 'table'::text AS area, e.name::text AS item,
         CASE WHEN c.oid IS NOT NULL AND c.relrowsecurity
           AND NOT COALESCE(has_table_privilege('anon', c.oid, 'SELECT,INSERT,UPDATE,DELETE'), false)
           AND NOT COALESCE(has_table_privilege('authenticated', c.oid, 'SELECT,INSERT,UPDATE,DELETE'), false)
           THEN 'PASS' ELSE 'FAIL' END AS result,
         concat('exists=', c.oid IS NOT NULL, ', rls=', COALESCE(c.relrowsecurity, false),
                ', anon_grants=', COALESCE(has_table_privilege('anon', c.oid, 'SELECT,INSERT,UPDATE,DELETE'), false),
                ', authenticated_grants=', COALESCE(has_table_privilege('authenticated', c.oid, 'SELECT,INSERT,UPDATE,DELETE'), false)) AS details
  FROM expected_tables e
  LEFT JOIN pg_class c ON c.relname = e.name AND c.relnamespace = 'public'::regnamespace
),
expected_buckets(name, should_be_public) AS (
  VALUES ('tour-images', true), ('post-images', true), ('traveller-profiles', true),
         ('agency-images', true), ('verification-docs', false)
),
bucket_checks AS (
  SELECT 'bucket'::text AS area, e.name::text AS item,
         CASE WHEN b.id IS NOT NULL AND b.public = e.should_be_public THEN 'PASS' ELSE 'FAIL' END AS result,
         concat('exists=', b.id IS NOT NULL, ', public=', COALESCE(b.public::text, 'missing')) AS details
  FROM expected_buckets e LEFT JOIN storage.buckets b ON b.id = e.name
),
expected_columns(table_name, column_name) AS (
  VALUES ('agencies', 'rating'), ('guides', 'ratings'),
         ('comments', 'commentId'), ('comments', 'postId'), ('comments', 'travellerId'),
         ('likes', 'postId'), ('likes', 'travellerid')
),
column_checks AS (
  SELECT 'column'::text AS area, e.table_name || '.' || e.column_name AS item,
         CASE WHEN c.column_name IS NOT NULL THEN 'PASS' ELSE 'FAIL' END AS result,
         ''::text AS details
  FROM expected_columns e LEFT JOIN information_schema.columns c
    ON c.table_schema = 'public' AND c.table_name = e.table_name
   AND c.column_name = e.column_name
),
foreign_key_check AS (
  SELECT 'constraint'::text AS area, 'fk_traveller_user'::text AS item,
         CASE WHEN EXISTS (
           SELECT 1 FROM pg_constraint
           WHERE conname = 'fk_traveller_user'
             AND conrelid = 'public.travellers'::regclass
             AND confrelid = 'public.users'::regclass
         ) THEN 'PASS' ELSE 'FAIL' END AS result,
         'travellers → users'::text AS details
)
SELECT * FROM table_checks
UNION ALL SELECT * FROM bucket_checks
UNION ALL SELECT * FROM column_checks
UNION ALL SELECT * FROM foreign_key_check
ORDER BY area, item;
