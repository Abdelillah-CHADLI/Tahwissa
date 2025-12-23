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


export async function getTravellerInfo(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "id is required" });
  }

  try {
    const { data: travellerData, error: travellerError } = await supabase
      .from('travellers')
      .select('traveller_fn, traveller_ls, bio, phone_number, location')
      .eq('traveller_id', id)
      .maybeSingle();

    if (travellerError) throw travellerError;

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('email')
      .eq('user_id', id)
      .single();

    if (userError) throw userError;
    res.status(200).json({
        ...travellerData,
        email: userData.email
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
export async function updateTravellerInfo(req, res) {
  const { id } = req.params;
  const {
    traveller_fn,
    traveller_ls,
    bio,
    phone_number,
    location,
    email
  } = req.body;

  if (!id) {
    return res.status(400).json({ error: "id is required" });
  }

  try {
    const travellerUpdate = {};

    if (traveller_fn !== undefined) travellerUpdate.traveller_fn = traveller_fn;
    if (traveller_ls !== undefined) travellerUpdate.traveller_ls = traveller_ls;
    if (bio !== undefined) travellerUpdate.bio = bio;
    if (phone_number !== undefined) travellerUpdate.phone_number = phone_number;
    if (location !== undefined) travellerUpdate.location = location;

    if (Object.keys(travellerUpdate).length > 0) {
      const { error: travellerError } = await supabase
        .from('travellers')
        .update(travellerUpdate)
        .eq('traveller_id', id);

      if (travellerError) throw travellerError;
    }

    if (email !== undefined) {
      const { error: userError } = await supabase
        .from('users')
        .update({ email })
        .eq('user_id', id);

      if (userError) throw userError;
    }

    res.status(200).json({
      message: "Traveller information updated successfully"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
