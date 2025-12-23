import { supabase } from '../config/supabasedb.js';



export async function reportAcc(req, res) {
  try {
    const {
      reporter_id,
      acc_type,               // "agency" or "guide" or "traveller"
      reported_id,
      reason,
      report_message
    } = req.body;

    if (!reporter_id || !acc_type || !reported_id || !reason) {
      return res.status(400).json({
        error: "reporter_id, acc_type, reported_id, and reason are required"
      });
    }

    if (!["agency", "guide", "traveller"].includes(acc_type.toLowerCase())) {
      return res.status(400).json({
        error: "acc_type must be either 'agency' or 'guide' or 'traveller"
      });
    }

    if (reporter_id === reported_id) {
      return res.status(400).json({
        error: "You cannot report your own account"
      });
    }

    const insertData = {
      reporter_id,
      reason,
      report_message
    };

    if (acc_type.toLowerCase() === "agency") {
      insertData.reported_agency = reported_id;
    } else {
      if (acc_type.toLowerCase() === "guide")
        insertData.reported_guide = reported_id;
      else {
        insertData.reported_traveller = reported_id;
      }
    }

    const { data, error } = await supabase
      .from("accreports")
      .insert([insertData])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({
        error: "Failed to create account report"
      });
    }

    return res.status(201).json({
      message: "Account reported successfully",
      report: data
    });

  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({
      error: "Internal server error"
    });
  }
}


export async function reportPost(req, res) {
  try {
    const {
      reporter_id,
      post_id,
      reason,
      report_message
    } = req.body;

    // Validation
    if (!reporter_id || !post_id || !reason) {
      return res.status(400).json({
        error: "reporter_id, post_id, and reason are required"
      });
    }

    // Fetch the post's owner
    const { data: post, error: postError } = await supabase
      .from("posts")
      .select("traveller_id")
      .eq("post_id", post_id)
      .single();

    if (postError) {
      console.error("Supabase error fetching post:", postError);
      return res.status(404).json({
        error: "Post not found"
      });
    }

    // Prevent self-reporting
    if (post.traveller_id === reporter_id) {
      return res.status(400).json({
        error: "You cannot report your own post"
      });
    }

    // Insert the report
    const { data, error } = await supabase
      .from("postreports")
      .insert([
        {
          reporter_id,
          post_id,
          reason,
          report_message
        }
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase error inserting report:", error);
      return res.status(500).json({
        error: "Failed to create post report"
      });
    }

    return res.status(201).json({
      message: "Post reported successfully",
      report: data
    });

  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({
      error: "Internal server error"
    });
  }
}


export async function getAccReports(req, res) {
  try {
    const { data, error } = await supabase
      .from("accreports")
      .select(`
        report_id,
        reporter_id,
        reported_guide,
        reported_traveller,
        reported_agency,
        reason,
        report_message,
        date,
        status
      `)
      .order("date", { ascending: false });

    if (error) {
      console.error("Supabase error fetching acc reports:", error);
      return res.status(500).json({
        error: "Failed to fetch account reports"
      });
    }

    return res.status(200).json({ reports: data });

  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}


export async function getPostReports(req, res) {
  try {
    const { data, error } = await supabase
      .from("postreports")
      .select(`
        report_id,
        reporter_id,
        post_id,
        reason,
        report_message,
        date,
        status
      `)
      .order("date", { ascending: false });

    if (error) {
      console.error("Supabase error fetching post reports:", error);
      return res.status(500).json({
        error: "Failed to fetch post reports"
      });
    }

    return res.status(200).json({ reports: data });

  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}


export async function getPostReportDetails(req, res) {
  try {
    const { report_id } = req.params;

    if (!report_id) {
      return res.status(400).json({ error: "report_id is required" });
    }

    // Fetch report with reporter and post owner details
    const { data, error } = await supabase
      .from("postreports")
      .select(`
        report_id,
        reporter:reporter_id (
          traveller_fn,
          traveller_ls,
          users!fk_traveller_user (
            email
          )
        ),
        post:post_id (
          post_id,
          title,
          text,
          location,
          owner:traveller_id (
            traveller_fn,
            traveller_ls
          )
        ),
        reason,
        report_message,
        date,
        status
      `)
      .eq("report_id", report_id)
      .single();

    if (error) {
      console.error("Supabase error fetching report details:", error);
      return res.status(404).json({ error: "Report not found" });
    }


    const reportDetails = {
      report_id: data.report_id,
      reporter_name: `${data.reporter.traveller_fn} ${data.reporter.traveller_ls}`,
      reporter_email: `${data.reporter.users.email}`,
      post_id: data.post.post_id,
      post_title: data.post.title,
      post_text: data.post.text,
      location: data.post.location,
      post_owner_name: `${data.post.owner.traveller_fn} ${data.post.owner.traveller_ls}`,
      reason: data.reason,
      report_message: data.report_message,
      date: data.date,
      status: data.status
    };

    return res.status(200).json({ report: reportDetails });

  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function getAccReportDetails(req, res) {
  try {
    const { report_id } = req.params;

    if (!report_id) {
      return res.status(400).json({ error: "report_id is required" });
    }


    const { data, error } = await supabase
      .from("accreports")
      .select(`
        report_id,
        reporter:reporter_id (
          email,
          travellers!fk_traveller_user (
            traveller_fn,
            traveller_ls
          )
        ),
        reported_traveller,
        reported_guide,
        reported_agency,
        reason,
        report_message,
        date,
        status
      `)
      .eq("report_id", report_id)
      .single();

    if (error) {
      console.error("Supabase error fetching acc report:", error);
      return res.status(404).json({ error: "Report not found" });
    }

    let reported_name = null;


    if (data.reported_traveller) {
      const { data: travellerData, error: tError } = await supabase
        .from("travellers")
        .select("traveller_fn, traveller_ls")
        .eq("traveller_id", data.reported_traveller)
        .single();

      if (!tError && travellerData) {
        reported_name = `${travellerData.traveller_fn} ${travellerData.traveller_ls}`;
      }
    } else if (data.reported_guide) {
      const { data: guideData, error: gError } = await supabase
        .from("guides")
        .select("guide_name")
        .eq("guide_id", data.reported_guide)
        .single();

      if (!gError && guideData) {
        reported_name = guideData.guide_name;
      }
    } else if (data.reported_agency) {
      const { data: agencyData, error: aError } = await supabase
        .from("agencies")
        .select("agency_name")
        .eq("agency_id", data.reported_agency)
        .single();

      if (!aError && agencyData) {
        reported_name = agencyData.agency_name;
      }
    }

    const reportDetails = {
      report_id: data.report_id,
      reporter_email: `${data.reporter.email} `,
      reporter_name: data.reporter?.travellers ? `${data.reporter.travellers.traveller_fn} ${data.reporter.travellers.traveller_ls}` : 'Unknown',
      reported_name,
      reason: data.reason,
      report_message: data.report_message,
      date: data.date,
      status: data.status
    };

    return res.status(200).json({ report: reportDetails });

  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function deletePost(req, res) {
  try {
    const { report_id } = req.body;

    if (!report_id) {
      return res.status(400).json({ error: "report_id is required" });
    }

    const { data: report, error: reportError } = await supabase
      .from("postreports")
      .select("post_id")
      .eq("report_id", report_id)
      .single();

    if (reportError || !report) {
      console.error("Error fetching report:", reportError);
      return res.status(404).json({ error: "Report not found" });
    }

    const post_id = report.post_id;

    const { error: deleteError } = await supabase
      .from("posts")
      .delete()
      .eq("post_id", post_id);

    if (deleteError) {
      console.error("Error deleting post:", deleteError);
      return res.status(500).json({ error: "Failed to delete post" });
    }

    const { error: updateError } = await supabase
      .from("postreports")
      .update({ status: "Resolved" })
      .eq("report_id", report_id);

    if (updateError) {
      console.error("Error updating report status:", updateError);
      return res.status(500).json({ error: "Failed to update report status" });
    }

    return res.status(200).json({
      message: "Post deleted and report marked as resolved",
      post_id,
      report_id
    });

  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}


