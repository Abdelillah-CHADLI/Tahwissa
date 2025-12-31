//wassim
import { supabase } from "../config/supabasedb.js";

const budgetRanges = {
  "<5000": [0, 4999],
  "5000-10000": [5000, 10000],
  "10000-20000": [10000, 20000],
  ">20000": [20001, Infinity],
};

export async function searchTours(req, res) {
  try {
    const {
      name,      
      region,    
      category,  
      budget,    
      provider   //"Guide or "Agency"
    } = req.body;

    let query = supabase.from('tours').select('*, tour_images(image_url)');

    // 1. Name search (partial match)
    if (name) {
      query = query.ilike('tour_title', `%${name}%`);
    }

    // 2. Region filter (location contains region string)
    if (region) {
      query = query.ilike('location', `%${region}%`);
    }

    // 3. Category filter (exact match)
    if (category) {
      query = query.eq('category', category);
    }

    // 4. Budget filter
    if (budget && budgetRanges[budget]) {
      const [minPrice, maxPrice] = budgetRanges[budget];
      query = query.gte('price', minPrice).lte('price', maxPrice);
    }

    // 5. Provider filter based on guide_id / agency_id
    if (provider) {
      if (provider === "Guide") {
        query = query.not('guide_id', 'is', null); // guide_id exists
      } else if (provider === "Agency") {
        query = query.not('agency_id', 'is', null); // agency_id exists
      }
    }

    // 6. Execute query
    const { data, error } = await query;
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