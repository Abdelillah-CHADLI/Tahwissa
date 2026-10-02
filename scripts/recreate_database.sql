-- ==============================================================================
-- TAHWISSA TOURISM PLATFORM - FULL DATABASE RECREATION SCRIPT
-- ==============================================================================
-- DESTRUCTIVE: run only in a new, empty Supabase project.
-- Run this entire script in your new Supabase project's SQL Editor:
-- Supabase Dashboard -> SQL Editor -> New query -> Paste & Run.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. DROP TABLES IN REVERSE DEPENDENCY ORDER (DESTROYS EXISTING DATA)
DROP TABLE IF EXISTS "guideverification" CASCADE;
DROP TABLE IF EXISTS "agencyverification" CASCADE;
DROP TABLE IF EXISTS "accreports" CASCADE;
DROP TABLE IF EXISTS "postreports" CASCADE;
DROP TABLE IF EXISTS "likes" CASCADE;
DROP TABLE IF EXISTS "comments" CASCADE;
DROP TABLE IF EXISTS "posts" CASCADE;
DROP TABLE IF EXISTS "reviews" CASCADE;
DROP TABLE IF EXISTS "bookings" CASCADE;
DROP TABLE IF EXISTS "tour_images" CASCADE;
DROP TABLE IF EXISTS "tours" CASCADE;
DROP TABLE IF EXISTS "agency_employees" CASCADE;
DROP TABLE IF EXISTS "guides" CASCADE;
DROP TABLE IF EXISTS "agencies" CASCADE;
DROP TABLE IF EXISTS "travellers" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;

-- ==============================================================================
-- 3. TABLE DEFINITIONS
-- ==============================================================================

-- USERS TABLE
CREATE TABLE "users" (
  "user_id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" TEXT UNIQUE NOT NULL,
  "password" TEXT NOT NULL,
  "role" TEXT NOT NULL, -- 'admin', 'Traveller', 'Guide', 'AgencyEmployee'
  "password_changed_at" TIMESTAMPTZ,
  "created_at" TIMESTAMPTZ DEFAULT now()
);

-- TRAVELLERS TABLE
CREATE TABLE "travellers" (
  "traveller_id" UUID PRIMARY KEY,
  "traveller_fn" TEXT NOT NULL,
  "traveller_ls" TEXT NOT NULL,
  "bio" TEXT,
  "phone_number" TEXT,
  "location" TEXT,
  "profile_picture" TEXT,
  CONSTRAINT fk_traveller_user FOREIGN KEY ("traveller_id") REFERENCES "users"("user_id") ON DELETE CASCADE
);

-- AGENCIES TABLE
CREATE TABLE "agencies" (
  "agency_id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "agency_name" TEXT NOT NULL,
  "phone_number" TEXT,
  "main_office_location" TEXT,
  "manager_id" UUID REFERENCES "users"("user_id") ON DELETE SET NULL,
  "rating" NUMERIC DEFAULT 0,
  "num_raters" INT DEFAULT 0,
  "agency_logo" TEXT,
  "support_email" TEXT,
  "agency_description" TEXT,
  "verified" BOOLEAN DEFAULT false,
  "created_at" TIMESTAMPTZ DEFAULT now()
);

-- GUIDES TABLE (Notice 'ratings' plural, matching backend controllers)
CREATE TABLE "guides" (
  "guide_id" UUID PRIMARY KEY REFERENCES "users"("user_id") ON DELETE CASCADE,
  "guide_name" TEXT NOT NULL,
  "phone_number" TEXT,
  "main_location" TEXT,
  "ratings" NUMERIC DEFAULT 0,
  "num_raters" INT DEFAULT 0,
  "verified" BOOLEAN DEFAULT false,
  "support_email" TEXT,
  "guide_description" TEXT,
  "created_at" TIMESTAMPTZ DEFAULT now()
);

-- AGENCY EMPLOYEES TABLE
CREATE TABLE "agency_employees" (
  "employee_id" UUID PRIMARY KEY REFERENCES "users"("user_id") ON DELETE CASCADE,
  "agency_id" UUID REFERENCES "agencies"("agency_id") ON DELETE CASCADE,
  "full_name" TEXT,
  "phone" TEXT,
  "location" TEXT,
  "experience" TEXT,
  "languages" TEXT,
  "role" TEXT,
  "specialization" TEXT,
  "status" TEXT DEFAULT 'active',
  "created_at" TIMESTAMPTZ DEFAULT now()
);

-- TOURS TABLE
CREATE TABLE "tours" (
  "tour_id" BIGSERIAL PRIMARY KEY,
  "tour_title" TEXT NOT NULL,
  "location" TEXT NOT NULL,
  "price" NUMERIC NOT NULL,
  "group_size" TEXT,
  "duration" TEXT,
  "agency_id" UUID REFERENCES "agencies"("agency_id") ON DELETE CASCADE,
  "guide_id" UUID REFERENCES "guides"("guide_id") ON DELETE CASCADE,
  "category" TEXT,
  "start_date" DATE NOT NULL,
  "tour_details" TEXT,
  "tour_included" TEXT,
  "requirements" TEXT,
  "tour_not_included" TEXT,
  "created_at" TIMESTAMPTZ DEFAULT now()
);

-- TOUR IMAGES TABLE
CREATE TABLE "tour_images" (
  "image_id" BIGSERIAL PRIMARY KEY,
  "tour_id" BIGINT REFERENCES "tours"("tour_id") ON DELETE CASCADE,
  "image_url" TEXT NOT NULL,
  "created_at" TIMESTAMPTZ DEFAULT now()
);

-- BOOKINGS TABLE
CREATE TABLE "bookings" (
  "booking_id" BIGSERIAL PRIMARY KEY,
  "traveller_id" UUID REFERENCES "travellers"("traveller_id") ON DELETE CASCADE,
  "tour_id" BIGINT REFERENCES "tours"("tour_id") ON DELETE CASCADE,
  "booking_date" DATE DEFAULT CURRENT_DATE,
  "status" TEXT DEFAULT 'PENDING', -- 'PENDING', 'CONFIRMED', 'CANCELLED'
  "created_at" TIMESTAMPTZ DEFAULT now()
);

-- REVIEWS TABLE
CREATE TABLE "reviews" (
  "review_id" BIGSERIAL PRIMARY KEY,
  "tour_id" BIGINT REFERENCES "tours"("tour_id") ON DELETE CASCADE,
  "traveller_id" UUID REFERENCES "travellers"("traveller_id") ON DELETE CASCADE,
  "comment" TEXT,
  "review_score" NUMERIC NOT NULL,
  "created_at" TIMESTAMPTZ DEFAULT now()
);

-- COMMUNITY POSTS TABLE
CREATE TABLE "posts" (
  "post_id" BIGSERIAL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "text" TEXT NOT NULL,
  "location" TEXT,
  "traveller_id" UUID REFERENCES "travellers"("traveller_id") ON DELETE CASCADE,
  "stars" INT DEFAULT 0,
  "likes" INT DEFAULT 0,
  "image_url" TEXT,
  "created_at" TIMESTAMPTZ DEFAULT now()
);

-- POST COMMENTS TABLE (Note exact column casings expected by postController.js)
CREATE TABLE "comments" (
  "commentId" BIGSERIAL PRIMARY KEY,
  "postId" BIGINT REFERENCES "posts"("post_id") ON DELETE CASCADE,
  "travellerId" UUID REFERENCES "travellers"("traveller_id") ON DELETE CASCADE,
  "caption" TEXT NOT NULL,
  "created_at" TIMESTAMPTZ DEFAULT now()
);

-- POST LIKES TABLE (Note exact column casings expected by postController.js)
CREATE TABLE "likes" (
  "like_id" BIGSERIAL PRIMARY KEY,
  "postId" BIGINT REFERENCES "posts"("post_id") ON DELETE CASCADE,
  "travellerid" UUID REFERENCES "travellers"("traveller_id") ON DELETE CASCADE,
  "created_at" TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT unique_post_traveller_like UNIQUE ("postId", "travellerid")
);

-- POST REPORTS TABLE
CREATE TABLE "postreports" (
  "report_id" BIGSERIAL PRIMARY KEY,
  "reporter_id" UUID REFERENCES "travellers"("traveller_id") ON DELETE CASCADE,
  "post_id" BIGINT REFERENCES "posts"("post_id") ON DELETE CASCADE,
  "reason" TEXT NOT NULL,
  "report_message" TEXT,
  "date" TIMESTAMPTZ DEFAULT now(),
  "status" TEXT DEFAULT 'pending'
);

-- ACCOUNT REPORTS TABLE
CREATE TABLE "accreports" (
  "report_id" BIGSERIAL PRIMARY KEY,
  "reporter_id" UUID REFERENCES "users"("user_id") ON DELETE CASCADE,
  "reported_traveller" UUID REFERENCES "travellers"("traveller_id") ON DELETE CASCADE,
  "reported_guide" UUID REFERENCES "guides"("guide_id") ON DELETE CASCADE,
  "reported_agency" UUID REFERENCES "agencies"("agency_id") ON DELETE CASCADE,
  "reason" TEXT NOT NULL,
  "report_message" TEXT,
  "date" TIMESTAMPTZ DEFAULT now(),
  "status" TEXT DEFAULT 'pending'
);

-- AGENCY VERIFICATION TABLE
CREATE TABLE "agencyverification" (
  "verification_id" BIGSERIAL PRIMARY KEY,
  "agency_id" UUID REFERENCES "agencies"("agency_id") ON DELETE CASCADE,
  "verification_document" TEXT NOT NULL,
  "status" TEXT DEFAULT 'Pending', -- 'Pending', 'Approved', 'Rejected'
  "created_at" TIMESTAMPTZ DEFAULT now()
);

-- GUIDE VERIFICATION TABLE
CREATE TABLE "guideverification" (
  "verification_id" BIGSERIAL PRIMARY KEY,
  "guide_id" UUID REFERENCES "guides"("guide_id") ON DELETE CASCADE,
  "verification_document" TEXT NOT NULL,
  "status" TEXT DEFAULT 'Pending', -- 'Pending', 'Approved', 'Rejected'
  "created_at" TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- 4. BLOCK DIRECT CLIENT ACCESS
-- The Express backend uses a service role key, which bypasses RLS. There are
-- deliberately no anon/authenticated policies on these application tables.
-- ==============================================================================
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "travellers" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "agencies" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "guides" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "agency_employees" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "tours" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "tour_images" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "bookings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "reviews" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "posts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "comments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "likes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "postreports" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "accreports" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "agencyverification" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "guideverification" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE "users", "travellers", "agencies", "guides",
  "agency_employees", "tours", "tour_images", "bookings", "reviews",
  "posts", "comments", "likes", "postreports", "accreports",
  "agencyverification", "guideverification" FROM anon, authenticated;

-- ==============================================================================
-- 5. PORTFOLIO DEMO SEED DATA
-- Default password for all seed accounts is: password123
-- ==============================================================================

-- SEED USERS
INSERT INTO "users" ("user_id", "email", "password", "role") VALUES
  ('a0000000-0000-0000-0000-000000000001', 'admin@tahwissa.com', crypt('password123', gen_salt('bf', 10)), 'admin'),
  ('b0000000-0000-0000-0000-000000000001', 'agency@tahwissa.com', crypt('password123', gen_salt('bf', 10)), 'AgencyEmployee'),
  ('b0000000-0000-0000-0000-000000000002', 'employee@tahwissa.com', crypt('password123', gen_salt('bf', 10)), 'AgencyEmployee'),
  ('c0000000-0000-0000-0000-000000000001', 'guide@tahwissa.com', crypt('password123', gen_salt('bf', 10)), 'Guide'),
  ('d0000000-0000-0000-0000-000000000001', 'traveler@tahwissa.com', crypt('password123', gen_salt('bf', 10)), 'Traveller'),
  ('d0000000-0000-0000-0000-000000000002', 'sarah@tahwissa.com', crypt('password123', gen_salt('bf', 10)), 'Traveller');

-- SEED TRAVELLERS
INSERT INTO "travellers" ("traveller_id", "traveller_fn", "traveller_ls", "bio", "phone_number", "location", "profile_picture") VALUES
  ('d0000000-0000-0000-0000-000000000001', 'Amine', 'Benali', 'Passionate hiker and desert explorer across Algeria.', '+213555123456', 'Algiers', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'),
  ('d0000000-0000-0000-0000-000000000002', 'Sarah', 'Mansouri', 'Architecture buff & documentary photographer.', '+213555987654', 'Oran', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80');

-- SEED AGENCIES
INSERT INTO "agencies" ("agency_id", "agency_name", "phone_number", "main_office_location", "manager_id", "rating", "num_raters", "agency_logo", "support_email", "agency_description", "verified") VALUES
  ('e0000000-0000-0000-0000-000000000001', 'Atlas Sahara Expeditions', '+21321456789', 'Algiers', 'b0000000-0000-0000-0000-000000000001', 24, 5, 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=400&q=80', 'contact@atlassahara.dz', 'Premier travel agency crafting unforgettable journeys across the Algerian Sahara and historic cities.', true),
  ('e0000000-0000-0000-0000-000000000002', 'Numidia Tours', '+21331654321', 'Constantine', NULL, 18, 4, 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80', 'info@numidiatours.dz', 'Specialists in Eastern Algeria heritage, Constantine bridges, and Roman historical sites.', false);

-- SEED AGENCY EMPLOYEES
INSERT INTO "agency_employees" ("employee_id", "agency_id", "full_name", "phone", "location", "experience", "languages", "role", "specialization", "status") VALUES
  ('b0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'Yacine Manager', '+213550112233', 'Algiers', '10 years', '["Arabic", "French", "English"]', 'manager', '["Expedition Planning", "Logistics"]', 'active'),
  ('b0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000001', 'Sofiane Guide', '+213550445566', 'Tamanrasset', '6 years', '["Arabic", "French", "Tamasheq"]', 'guide', '["Desert Navigation", "Camp Craft"]', 'active');

-- SEED GUIDES
INSERT INTO "guides" ("guide_id", "guide_name", "phone_number", "main_location", "ratings", "num_raters", "verified", "support_email", "guide_description") VALUES
  ('c0000000-0000-0000-0000-000000000001', 'Karim Sahara Guide', '+213661223344', 'Djanet', 19, 4, true, 'karim.desert@tahwissa.com', 'Certified local guide born and raised in Djanet. Expert in prehistoric rock art and Tassili canyons.');

-- SEED TOURS
INSERT INTO "tours" ("tour_id", "tour_title", "location", "price", "group_size", "duration", "agency_id", "guide_id", "category", "start_date", "tour_details", "tour_included", "requirements", "tour_not_included") VALUES
  (1, 'Tassili n''Ajjer Plateau Trek & Rock Art', 'Djanet', 45000, '4-10', '5 days', NULL, 'c0000000-0000-0000-0000-000000000001', 'Adventure', CURRENT_DATE + INTERVAL '20 days',
   '[{"day":1,"title":"Arrival in Djanet & Canyon Transfer","description":"Meet at Djanet airport, 4x4 transfer to plateau base camp."},{"day":2,"title":"Ascent to Tamrit Plateau","description":"Hiking through towering rock formations and viewing ancient cypress trees."},{"day":3,"title":"Prehistoric Paintings of Sefar","description":"Discovering the largest open-air museum of Neolithic rock art."}]',
   '["4x4 Transport", "Traditional Saharan Meals", "Camping Gear", "Certified Local Guide"]',
   '["Trekking Boots", "Sleeping Bag", "Passport/ID"]',
   '["Domestic Flights to Djanet", "Personal Souvenirs"]'),

  (2, 'Casbah of Algiers & Ottoman Palaces Walk', 'Algiers', 4500, '2-15', '1 day', 'e0000000-0000-0000-0000-000000000001', NULL, 'Cultural', CURRENT_DATE + INTERVAL '10 days',
   '[{"day":1,"title":"UNESCO Casbah Discovery","description":"Guided walking tour visiting Dar Mustapha Pacha, traditional craftsmen workshops, and Ketchaoua Mosque with rooftop panoramic tea."}]',
   '["Licensed Historian Guide", "Traditional Mint Tea & Pastries", "Museum Entry Fees"]',
   '["Comfortable Walking Shoes"]',
   '["Hotel Pick-up", "Lunch"]'),

  (3, 'Ghardaïa & M''Zab Valley Architectural Heritage', 'Ghardaia', 32000, '6-12', '3 days', 'e0000000-0000-0000-0000-000000000001', NULL, 'Heritage', CURRENT_DATE + INTERVAL '15 days',
   '[{"day":1,"title":"Beni Isguen & The Silent Market","description":"Explore the fortified ksar and centuries-old sunset auction market."},{"day":2,"title":"Ghardaia Oasis & Ancient Irrigation","description":"Study the ingenious underground water sharing systems."}]',
   '["Traditional Guest House Accommodation", "All Meals", "Local Certified Mozabite Guide"]',
   '["Modest Dress Code", "Respect for Photography Guidelines"]',
   '["Flight/Bus to Ghardaia"]'),

  (4, 'Roman Wonders of Djémila & Timgad', 'Setif', 12000, '4-12', '2 days', NULL, 'c0000000-0000-0000-0000-000000000001', 'Historical', CURRENT_DATE + INTERVAL '25 days',
   '[{"day":1,"title":"Cuicul - Djémila Ruins & Museum","description":"Full day walking through exceptionally preserved Roman temples, basilicas, and museum mosaics."},{"day":2,"title":"Timgad Grid City","description":"Exploring Trajan''s military colony and the triumphal arch."}]',
   '["Minibus Transport", "Museum Admissions", "Hotel Night in Setif"]',
   '["Sun Hat & Sunscreen", "ID Card"]',
   '["Dinners"]');

-- SEED TOUR IMAGES
INSERT INTO "tour_images" ("tour_id", "image_url") VALUES
  (1, 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80'),
  (1, 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80'),
  (2, 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80'),
  (3, 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80'),
  (4, 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80');

-- SEED BOOKINGS
INSERT INTO "bookings" ("traveller_id", "tour_id", "booking_date", "status") VALUES
  ('d0000000-0000-0000-0000-000000000001', 1, CURRENT_DATE - INTERVAL '2 days', 'CONFIRMED'),
  ('d0000000-0000-0000-0000-000000000001', 2, CURRENT_DATE - INTERVAL '1 days', 'PENDING'),
  ('d0000000-0000-0000-0000-000000000002', 3, CURRENT_DATE - INTERVAL '5 days', 'CONFIRMED');

-- SEED REVIEWS
INSERT INTO "reviews" ("tour_id", "traveller_id", "comment", "review_score") VALUES
  (1, 'd0000000-0000-0000-0000-000000000001', 'An absolute bucket-list experience! Karim is extraordinarily knowledgeable and the desert nights were magical.', 5),
  (2, 'd0000000-0000-0000-0000-000000000002', 'Great historical walkthrough of the Casbah, learned so much about the architecture and local crafts.', 5);

-- SEED COMMUNITY POSTS
INSERT INTO "posts" ("post_id", "title", "text", "location", "traveller_id", "stars", "likes", "image_url") VALUES
  (1, 'Sunset over the Red Dunes of Timimoun', 'Spent 3 days in the Gourara region. The contrast between green palm groves and crimson red sand is breathtaking!', 'Timimoun', 'd0000000-0000-0000-0000-000000000001', 5, 1, 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80'),
  (2, 'Hidden gems of the Algiers Casbah', 'Make sure to stop by the artisan brass workshops down Sidi Ramdane stairs. The craftsmen are welcoming and keep centuries-old traditions alive.', 'Algiers', 'd0000000-0000-0000-0000-000000000002', 4, 1, 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80');

-- SEED COMMENTS
INSERT INTO "comments" ("postId", "travellerId", "caption") VALUES
  (1, 'd0000000-0000-0000-0000-000000000002', 'Incredible picture! What season is best to visit Timimoun?'),
  (1, 'd0000000-0000-0000-0000-000000000001', 'October through March has ideal sunny weather and cool evenings!');

-- SEED LIKES
INSERT INTO "likes" ("postId", "travellerid") VALUES
  (1, 'd0000000-0000-0000-0000-000000000002'),
  (2, 'd0000000-0000-0000-0000-000000000001');

-- SEED VERIFICATION REQUEST (For Admin Demo)
INSERT INTO "agencyverification" ("agency_id", "verification_document", "status") VALUES
  ('e0000000-0000-0000-0000-000000000002', 'https://example.com/docs/numidia_license.pdf', 'Pending');

-- SEED ACCOUNT REPORT (For Admin Demo)
INSERT INTO "accreports" ("reporter_id", "reported_agency", "reason", "report_message", "status") VALUES
  ('d0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000002', 'Inaccurate tour information', 'The tour schedule listed on external socials differed from the booking date.', 'pending');

-- RESTART SEQUENCES TO PREVENT ID COLLISION ON FUTURE INSERTS
SELECT setval(pg_get_serial_sequence('tours', 'tour_id'), coalesce(max(tour_id), 1)) FROM "tours";
SELECT setval(pg_get_serial_sequence('tour_images', 'image_id'), coalesce(max(image_id), 1)) FROM "tour_images";
SELECT setval(pg_get_serial_sequence('bookings', 'booking_id'), coalesce(max(booking_id), 1)) FROM "bookings";
SELECT setval(pg_get_serial_sequence('reviews', 'review_id'), coalesce(max(review_id), 1)) FROM "reviews";
SELECT setval(pg_get_serial_sequence('posts', 'post_id'), coalesce(max(post_id), 1)) FROM "posts";
SELECT setval(pg_get_serial_sequence('comments', 'commentId'), coalesce(max("commentId"), 1)) FROM "comments";
SELECT setval(pg_get_serial_sequence('likes', 'like_id'), coalesce(max(like_id), 1)) FROM "likes";
