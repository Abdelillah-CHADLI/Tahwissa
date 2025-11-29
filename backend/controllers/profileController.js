//wassim
import { supabase } from '../config/supabasedb.js';

// Get profile
export async function getProfile(req, res) {
  const { id } = req.params;
  const { TypeOfProfile } = req.query; 

  try {
    if (!TypeOfProfile || !['Agency', 'Guide'].includes(TypeOfProfile)) {
      return res.status(400).json({ error: "TypeOfProfile must be 'Agency' or 'Guide'" });
    }
    let tableName;
    let ida;
    if (TypeOfProfile === 'Agency') {
        tableName = 'agencies';
        ida = 'agency_id';

    } else {
        tableName = 'guides';
        ida = 'guide_id';
    }

    // Fetch profile from corresponding table
    const { data: profile, error } = await supabase
      .from(tableName)
      .select('*')
      .eq(ida, id)
      .single();

    if (error) throw error;
    if (!profile) return res.status(404).json({ error: 'Profile not found' });

    res.json({ userType: TypeOfProfile, profile });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Edit profile
export async function editProfile(req, res) {
  const { id } = req.params;
  const { TypeOfProfile, ...profileData } = req.body; 
  

  try {
    let tableName;
    let ida;

    if (TypeOfProfile === "Agency") {
      tableName = "agencies";
      ida = 'agency_id';
    } else if (TypeOfProfile === "Guide") {
      tableName = "guides";
      ida = 'guide_id';
    } else {
      return res.status(400).json({ error: "Invalid TypeOfProfile. Must be 'Agency' or 'Guide'." });
    }

    const { data, error } = await supabase
      .from(tableName)
      .update(profileData)
      .eq(ida, id)
      .select()
      .single();

    if (error) throw error;

    res.json({ message: `${TypeOfProfile} profile updated successfully`, profile: data });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
