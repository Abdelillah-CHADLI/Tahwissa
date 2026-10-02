-- Apply this to an existing Tahwissa Supabase project. It preserves all rows.
-- The Express backend must use SUPABASE_SERVICE_ROLE_KEY; do not expose it to Vite.
BEGIN;

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agency_employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tour_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.postreports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accreports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agencyverification ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guideverification ENABLE ROW LEVEL SECURITY;

-- Existing permissive policies cannot grant access after these table grants
-- are removed. The service role used by Express keeps its own privileges.
REVOKE ALL ON TABLE public.users, public.travellers, public.agencies,
  public.guides, public.agency_employees, public.tours, public.tour_images,
  public.bookings, public.reviews, public.posts, public.comments, public.likes,
  public.postreports, public.accreports, public.agencyverification,
  public.guideverification FROM anon, authenticated;

-- Uploaded license and identity documents must not be publicly downloadable.
UPDATE storage.buckets SET public = false WHERE id = 'verification-docs';

UPDATE public.posts p SET likes = (
  SELECT count(*) FROM public.likes l WHERE l."postId" = p.post_id
);

COMMIT;
