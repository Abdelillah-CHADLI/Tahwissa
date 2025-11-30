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
      const { data, error } = await supabase.from('tours').select('*');
      if (error) throw new Error(error.message);
      return res.json(data);
    }

    // calculating random start point
    const maxStart = count - limit;
    const start = Math.floor(Math.random() * (maxStart + 1));
    const end = start + limit - 1;

    const { data, error } = await supabase
      .from('tours')
      .select('*')
      .range(start, end); 

    if (error) throw new Error(error.message);

    return res.json(data); 
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}

