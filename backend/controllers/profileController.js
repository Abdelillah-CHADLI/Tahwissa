//wassim
import { supabase } from '../config/supabasedb.js';

// Get profile
export async function getProfile(req, res) {
  const { id } = req.params;
  const readTypeOfProfile = () => {
    const fromQuery = (req.query && (req.query.TypeOfProfile || req.query.typeOfProfile || req.query.type || req.query.profileType)) ?? null;
    if (typeof fromQuery === 'string' && fromQuery.trim()) return fromQuery.trim();
    if (Array.isArray(fromQuery) && typeof fromQuery[0] === 'string' && fromQuery[0].trim()) return fromQuery[0].trim();

    try {
      const base = `${req.protocol || 'http'}://${req.get('host') || 'localhost'}`;
      const url = new URL(req.originalUrl || '', base);
      return (
        url.searchParams.get('TypeOfProfile') ||
        url.searchParams.get('typeOfProfile') ||
        url.searchParams.get('type') ||
        url.searchParams.get('profileType') ||
        ''
      ).trim();
    } catch {
      return '';
    }
  };

  const TypeOfProfile = readTypeOfProfile();

  try {
    if (!TypeOfProfile || !['Agency', 'Guide'].includes(TypeOfProfile)) {
      return res.status(400).json({ success: false, error: "TypeOfProfile must be 'Agency' or 'Guide'" });
    }
    let query;
    if (TypeOfProfile === 'Agency') {
      query = supabase
        .from('agencies')
        .select(`
          *,
          manager:users!manager_id(email, role)
        `)
        .eq('agency_id', id)
        .single();
    } else {
      query = supabase
        .from('guides')
        .select(`
          *,
          user:users!guide_id(email, role)
        `)
        .eq('guide_id', id)
        .single();
    }

    const { data: profile, error } = await query;

    if (error) throw error;
    if (!profile) return res.status(404).json({ success: false, error: 'Profile not found' });

    res.json({
      success: true,
      userType: TypeOfProfile,
      data: profile,
      profile,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
}

// Edit profile
export async function editProfile(req, res) {
  const { id } = req.params;
  const { TypeOfProfile } = req.body;
  

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

    const allowedFields = TypeOfProfile === 'Agency'
      ? ['agency_name', 'phone_number', 'main_office_location', 'support_email', 'agency_description']
      : ['guide_name', 'phone_number', 'main_location', 'support_email', 'guide_description'];
    const profileData = Object.fromEntries(
      allowedFields.filter(field => Object.prototype.hasOwnProperty.call(req.body, field))
        .map(field => [field, req.body[field]])
    );
    if (Object.keys(profileData).length === 0) {
      return res.status(400).json({ error: 'No supported profile fields were provided.' });
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

// Upload agency logo
export async function uploadAgencyLogo(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Agency ID is required" });
  }

  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    const extensions = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
    if (!extensions[file.mimetype]) {
      return res.status(400).json({ error: 'Upload a JPG, PNG, or WebP image.' });
    }

    const bucket = 'agency-images';
    const fileName = `${id}-logo-${Date.now()}.${extensions[file.mimetype]}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true
      });

    if (uploadError) {
      throw new Error(`Failed to upload image: ${uploadError.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    // Update the agency record with the logo URL
    const { data, error: updateError } = await supabase
      .from('agencies')
      .update({ agency_logo: publicUrl })
      .eq('agency_id', id)
      .select()
      .single();

    if (updateError) {
      throw new Error(`Failed to update agency: ${updateError.message}`);
    }

    res.status(200).json({
      success: true,
      message: "Agency logo uploaded successfully",
      data: { agency_logo: publicUrl }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
