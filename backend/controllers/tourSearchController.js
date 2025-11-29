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

    let query = supabase.from('tours').select('*');

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

    return res.json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}