//wassim
import { supabase } from "../config/supabasedb.js";


export async function verify(req, res) {
  try {
    const { acc_type, id } = req.body;
    const file = req.file; // multer should handle this

    if (!acc_type || !file) {
      return res.status(400).json({
        error: "acc_type and file are required"
      });
    }

    if (!id) {
      return res.status(400).json({ error: "Account ID is required" });
    }

    // Generate a unique filename for storage
    const timestamp = Date.now();
    const filename = `${acc_type.toLowerCase()}/${id}/${timestamp}-${file.originalname}`;

    // Upload the file to Supabase Storage with proper content type
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("verification-docs")
      .upload(filename, file.buffer, { contentType: file.mimetype });

    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      return res.status(500).json({ error: "Failed to upload verification document" });
    }

    // Construct the public URL manually (guaranteed to work if bucket is public)
    const publicUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/verification-docs/${uploadData.path}`;

    // Prepare insert data
    let insertData = {
      verification_document: publicUrl,
      status: "Pending"
    };

    let tableName = "";

    if (acc_type.toLowerCase() === "agency") {
      insertData.agency_id = id;
      tableName = "agencyverification";
    } else if (acc_type.toLowerCase() === "guide") {
      insertData.guide_id = id;
      tableName = "guideverification";
    } else {
      return res.status(400).json({ error: "acc_type must be either 'Agency' or 'Guide'" });
    }

    // Insert verification request
    const { data, error } = await supabase
      .from(tableName)
      .insert([insertData])
      .select()
      .single();

    if (error) {
      console.error("Supabase error inserting verification request:", error);
      return res.status(500).json({ error: "Failed to create verification request" });
    }

    return res.status(201).json({
      message: `${acc_type} verification request created successfully`,
      request: data
    });

  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}


export async function getAgencyVerifications(req, res) {
  try {
    // Get all verification requests and join with agencies table
    const { data, error } = await supabase
      .from("agencyverification")
      .select(`
        verification_id,
        verification_document,
        status,
        created_at,
        agency:agency_id (
          agency_name,
          support_email ,
          phone_number ,
          agency_description
        )
      `);

    if (error) {
      console.error("Error fetching agency verifications:", error);
      return res.status(500).json({ error: "Failed to fetch agency verification requests" });
    }

    return res.status(200).json({ requests: data });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}


export async function getGuideVerifications(req, res) {
  try {
    // Get all verification requests and join with guides table
    const { data, error } = await supabase
  .from("guideverification")
  .select(`
    verification_id,
    verification_document,
    status,
    created_at,
    guide:guide_id (
      guide_name,
      support_email,
      phone_number,
      guide_description,
      registration_date:users (
        created_at
      )
    )
  `);

    if (error) {
      console.error("Error fetching guide verifications:", error);
      return res.status(500).json({ error: "Failed to fetch guide verification requests" });
    }

    return res.status(200).json({ requests: data });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}


export async function getDashboardStats(req, res) {
  try {
    //total users
    const { count: totalUsers, error: usersError } = await supabase
      .from("users")
      .select("user_id", { count: "exact", head: true });

    if (usersError) {
      console.error("Error counting users:", usersError);
      return res.status(500).json({ error: "Failed to count users" });
    }

    //agencies
    const { count: approvedAgencies, error: approvedAgenciesError } = await supabase
      .from("agencies")
      .select("agency_id", { count: "exact", head: true })
      .eq("verified", true);

    const { count: pendingAgencies, error: pendingAgenciesError } = await supabase
      .from("agencies")
      .select("agency_id", { count: "exact", head: true })
      .eq("verified", false);

    if (approvedAgenciesError || pendingAgenciesError) {
      console.error("Error counting agencies:", approvedAgenciesError || pendingAgenciesError);
      return res.status(500).json({ error: "Failed to count agencies" });
    }

    // guides
    const { count: approvedGuides, error: approvedGuidesError } = await supabase
      .from("guides")
      .select("guide_id", { count: "exact", head: true })
      .eq("verified", true);

    const { count: pendingGuides, error: pendingGuidesError } = await supabase
      .from("guides")
      .select("guide_id", { count: "exact", head: true })
      .eq("verified", false);

    if (approvedGuidesError || pendingGuidesError) {
      console.error("Error counting guides:", approvedGuidesError || pendingGuidesError);
      return res.status(500).json({ error: "Failed to count guides" });
    }

    // open reports
    const { count: openAccReports, error: openAccReportsError } = await supabase
      .from("accreports")
      .select("report_id", { count: "exact", head: true })
      .eq("status", "pending");

    const { count: openPostReports, error: openPostReportsError } = await supabase
      .from("postreports")
      .select("report_id", { count: "exact", head: true })
      .eq("status", "pending");

    if (openAccReportsError || openPostReportsError) {
      console.error("Error counting open reports:", openAccReportsError || openPostReportsError);
      return res.status(500).json({ error: "Failed to count open reports" });
    }

    const openReports = (openAccReports || 0) + (openPostReports || 0);

    // resolved reports
    const { count: resolvedAccReports, error: resolvedAccReportsError } = await supabase
      .from("accreports")
      .select("report_id", { count: "exact", head: true })
      .eq("status", "resolved");

    const { count: resolvedPostReports, error: resolvedPostReportsError } = await supabase
      .from("postreports")
      .select("report_id", { count: "exact", head: true })
      .eq("status", "resolved");

    if (resolvedAccReportsError || resolvedPostReportsError) {
      console.error("Error counting resolved reports:", resolvedAccReportsError || resolvedPostReportsError);
      return res.status(500).json({ error: "Failed to count resolved reports" });
    }

    const resolvedReports = (resolvedAccReports || 0) + (resolvedPostReports || 0);

    // returning everything 
    return res.status(200).json({
      totalUsers,
      approvedAgencies,
      pendingAgencies,
      approvedGuides,
      pendingGuides,
      openReports,
      resolvedReports
    });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}



export async function approveVerification(req, res) {
  try {
    const { acc_type, id } = req.body;

    if (!acc_type || !id) {
      return res.status(400).json({ error: "acc_type and id are required" });
    }

    let tableName = "";
    let ida = "" 

    if (acc_type.toLowerCase() === "agency") {
      tableName = "agencies";
      ida = "agency_id";
    } else if (acc_type.toLowerCase() === "guide") {
      tableName = "guides";
      ida = "guide_id";
    } else {
      return res.status(400).json({ error: "acc_type must be either 'agency' or 'guide'" });
    }

    
    const { data, error } = await supabase
      .from(tableName)
      .update({ verified: true })
      .eq(ida, id)
      .select()
      .single();

    if (error) {
      console.error("Supabase error approving verification:", error);
      return res.status(500).json({ error: "Failed to approve verification" });
    }

    return res.status(200).json({
      message: `${acc_type} verification approved successfully`,
      updatedAccount: data
    });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
