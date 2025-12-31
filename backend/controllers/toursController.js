//wassim
import { supabase } from "../config/supabasedb.js";

//this function is generating tours randomly
export async function getTours(req, res) {
  try {
    //limit by default is 15 else we read the limit from frontEnd
    const limit = Number(req.query.limit) || 15;

    // calculating total number of tours in the database.
    const { count, error: countError } = await supabase
      .from('tours')
      .select('tour_id', { count: 'exact', head: true });

    if (countError) throw new Error(countError.message);

    if (!count || count === 0) {
      return res.json([]); // no available tours.
    }

    if (count <= limit) {
      const { data, error } = await supabase
        .from('tours')
        .select('*, tour_images(image_url)');
      if (error) throw new Error(error.message);

  
      if (Array.isArray(data) && data.length > 0) {
        const tourIds = data.map(t => t?.tour_id).filter(Boolean);
        const { data: imageRows, error: imageError } = await supabase
          .from('tour_images')
          .select('tour_id, image_url')
          .in('tour_id', tourIds);

        if (!imageError && Array.isArray(imageRows)) {
          const byTourId = new Map();
          for (const row of imageRows) {
            if (!row?.tour_id || !row?.image_url) continue;
            const existing = byTourId.get(row.tour_id) ?? [];
            existing.push(row.image_url);
            byTourId.set(row.tour_id, existing);
          }

          for (const tour of data) {
            const urls = byTourId.get(tour.tour_id) ?? [];
            if (!Array.isArray(tour.tour_images) || tour.tour_images.length === 0) {
              tour.tour_images = urls.map(image_url => ({ image_url }));
            }
            const embeddedUrls = Array.isArray(tour.tour_images)
              ? tour.tour_images.map(x => x?.image_url).filter(Boolean)
              : [];
            tour.images = embeddedUrls.length > 0 ? embeddedUrls : urls;
          }
        }
      }

      return res.json(data);
    }

    // calculating random start point
    const maxStart = count - limit;
    const start = Math.floor(Math.random() * (maxStart + 1));
    const end = start + limit - 1;

    const { data, error } = await supabase
      .from('tours')
      .select('*, tour_images(image_url)')
      .range(start, end); 

    if (error) throw new Error(error.message);

    if (Array.isArray(data) && data.length > 0) {
      const tourIds = data.map(t => t?.tour_id).filter(Boolean);
      const { data: imageRows, error: imageError } = await supabase
        .from('tour_images')
        .select('tour_id, image_url')
        .in('tour_id', tourIds);

      if (!imageError && Array.isArray(imageRows)) {
        const byTourId = new Map();
        for (const row of imageRows) {
          if (!row?.tour_id || !row?.image_url) continue;
          const existing = byTourId.get(row.tour_id) ?? [];
          existing.push(row.image_url);
          byTourId.set(row.tour_id, existing);
        }

        for (const tour of data) {
          const urls = byTourId.get(tour.tour_id) ?? [];
          if (!Array.isArray(tour.tour_images) || tour.tour_images.length === 0) {
            tour.tour_images = urls.map(image_url => ({ image_url }));
          }
          const embeddedUrls = Array.isArray(tour.tour_images)
            ? tour.tour_images.map(x => x?.image_url).filter(Boolean)
            : [];
          tour.images = embeddedUrls.length > 0 ? embeddedUrls : urls;
        }
      }
    }

    return res.json(data); 
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}

