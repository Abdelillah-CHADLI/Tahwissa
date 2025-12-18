// controllers/postController.js
import { supabase } from "../config/supabasedb.js";

export async function addPost(postData, images = []) {
  const {
    title,
    text,
    location = '',
    traveller_id,
    stars = 0
  } = postData;

  // Validate required fields
  if (!title || !text || !traveller_id) {
    throw new Error('Missing required fields: title, text, traveller_id');
  }

  // Insert the post record (image_url will be set if image provided)
  const { data: newPost, error: insertError } = await supabase
    .from('posts')
    .insert({
      title,
      text,
      location,
      traveller_id,
      stars
    })
    .select()
    .single();

  if (insertError) throw new Error(`Failed to add post: ${insertError.message}`);

  // Handle image upload if provided (assuming single image for simplicity; extend for multiple if needed)
  let imageUrl = null;
  if (images && images.length > 0) {
    const image = images[0]; // Take first image; adjust for multiple
    const bucket = 'post-images'; // Assume a bucket named 'post-images' exists in Supabase Storage
    const fileName = `${newPost.post_id}-${Date.now()}-${image.name}`;
    
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, image.content, {
        contentType: image.mimeType,
        upsert: true
      });

    if (uploadError) {
      console.error(`Failed to upload image ${fileName}: ${uploadError.message}`);
      // Optionally delete the post if image is required, or proceed without
    } else {
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);
      
      imageUrl = publicUrl;

      // Update the post with image_url
      const { error: updateError } = await supabase
        .from('posts')
        .update({ image_url: publicUrl })
        .eq('post_id', newPost.post_id);

      if (updateError) {
        console.error(`Failed to update post with image URL: ${updateError.message}`);
      }
    }
  }

  // Return the new post with image URL if available
  return {
    ...newPost,
    image_url: imageUrl || newPost.image_url
  };
}








export async function getPostById(postId) {
  // Validate postId
  if (!postId || isNaN(postId)) {
    throw new Error('Invalid post ID');
  }

  // First, fetch the post
  const { data: post, error: postError } = await supabase
    .from('posts')
    .select('*')
    .eq('post_id', postId)
    .single();

  if (postError) throw new Error(`Failed to fetch post: ${postError.message}`);

  if (!post) {
    throw new Error('Post not found');
  }

  // Then, fetch traveller first and last name
  const { data: traveller, error: travellerError } = await supabase
    .from('travellers')
    .select('traveller_fn, traveller_ls , profile_picture')
    .eq('traveller_id', post.traveller_id)
    .single();

  if (travellerError) throw new Error(`Failed to fetch traveller: ${travellerError.message}`);

  if (!traveller) {
    // If no traveller, set defaults
    post.traveller_full_name = 'Unknown Traveller';
  } else {
    post.traveller_full_name = `${traveller.traveller_fn} ${traveller.traveller_ls}`.trim();
    post.traveller_profile_image = traveller.profile_picture
  }

  return post;
}

export async function getCommentsByPostId(postId) {
  // Validate postId
  if (!postId || isNaN(postId)) {
    throw new Error('Invalid post ID');
  }

  // First, fetch all comments for the post
  const { data: comments, error: commentsError } = await supabase
    .from('comments')
    .select('*')
    .eq('postId', postId)
    .order('created_at', { ascending: true });

  if (commentsError) throw new Error(`Failed to fetch comments: ${commentsError.message}`);

  if (!comments || comments.length === 0) {
    return { comments: [] };
  }

  // Then, fetch traveller details for each comment
  const enhancedComments = await Promise.all(comments.map(async (comment) => {
    const { data: traveller, error: travellerError } = await supabase
      .from('travellers')
      .select('traveller_fn, traveller_ls ,profile_picture')
      .eq('traveller_id', comment.travellerId)
      .single();

    if (travellerError) {
      console.error(`Failed to fetch traveller for comment ${comment.commentId}: ${travellerError.message}`);
      comment.traveller_full_name = 'Unknown Traveller';
    } else if (traveller) {
      comment.traveller_full_name = `${traveller.traveller_fn} ${traveller.traveller_ls}`.trim();
      comment.profile_picture = traveller.profile_picture
    } else {
      comment.traveller_full_name = 'Unknown Traveller';
    }

    // Keep only needed fields: commentId, created_at, caption, traveller_full_name
    return {
      commentId: comment.commentId,
      created_at: comment.created_at,
      caption: comment.caption,
      traveller_full_name: comment.traveller_full_name,
      traveller_profile_picture: comment.profile_picture
    };
  }));

  return { comments: enhancedComments };
}










export async function updateTravellerProfile(travellerId, updateData) {
  // Validate required
  if (!travellerId) {
    throw new Error('Missing required: travellerId');
  }

  // Build update object from provided non-empty fields
  const updateFields = {};
  const { traveller_fn, traveller_ls, bio, phone_number, location } = updateData;

  if (traveller_fn !== undefined && traveller_fn.trim() !== '') {
    updateFields.traveller_fn = traveller_fn.trim();
  }
  if (traveller_ls !== undefined && traveller_ls.trim() !== '') {
    updateFields.traveller_ls = traveller_ls.trim();
  }
  if (bio !== undefined && bio.trim() !== '') {
    updateFields.bio = bio.trim();
  }
  if (phone_number !== undefined && phone_number.trim() !== '') {
    updateFields.phone_number = phone_number.trim();
  }
  if (location !== undefined && location.trim() !== '') {
    updateFields.location = location.trim();
  }

  // Handle profile picture update if image provided in JSON (e.g., { base64: string, mimeType: string })
  let newProfilePictureUrl = null;
  const imageData = updateData.profile_picture; // Expect { base64: '...', mimeType: 'image/jpeg' }
  if (imageData && imageData.base64 && imageData.mimeType) {
    const bucket = 'traveller-profiles'; // Assume bucket exists
    const fileName = `${travellerId}-${Date.now()}.jpg`; // Assume jpg; adjust based on mime

    // First, fetch old profile_picture to delete if exists
    const { data: currentProfile, error: fetchError } = await supabase
      .from('travellers')
      .select('profile_picture')
      .eq('traveller_id', travellerId)
      .single();

    if (fetchError) {
      throw new Error(`Failed to fetch current profile: ${fetchError.message}`);
    }

    // Delete old image if exists
    if (currentProfile && currentProfile.profile_picture) {
      try {
        // Extract filename from URL (assuming structure: .../public/bucket/filename.ext)
        const urlParts = currentProfile.profile_picture.split('/');
        const oldFileName = urlParts[urlParts.length - 1];
        const { error: deleteError } = await supabase.storage
          .from(bucket)
          .remove([oldFileName]);

        if (deleteError && deleteError.message !== 'No files found') {
          console.error(`Failed to delete old image: ${deleteError.message}`);
          // Proceed anyway
        }
      } catch (deleteErr) {
        console.error(`Error deleting old image: ${deleteErr.message}`);
      }
    }

    // Convert base64 to buffer
    const buffer = Buffer.from(imageData.base64, 'base64');

    // Upload new image
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, buffer, {
        contentType: imageData.mimeType,
        upsert: true
      });

    if (uploadError) {
      throw new Error(`Failed to upload profile picture: ${uploadError.message}`);
    }

    // Get new public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    newProfilePictureUrl = publicUrl;
    updateFields.profile_picture = publicUrl;
  }

  // If no fields to update, return early
  if (Object.keys(updateFields).length === 0) {
    return { success: true, message: 'No changes made' };
  }

  // Update the profile
  const { data: updatedProfile, error: updateError } = await supabase
    .from('travellers')
    .update(updateFields)
    .eq('traveller_id', travellerId)
    .select()
    .single();

  if (updateError) {
    throw new Error(`Failed to update profile: ${updateError.message}`);
  }

  return { success: true, data: updatedProfile };
}


export async function reportPost(reportData) {
  const {
    post_id,
    reason,
    reporter_id,
    report_message = ''
  } = reportData;

  // Validate required fields
  if (!post_id || isNaN(post_id)) {
    throw new Error('Missing or invalid required field: post_id');
  }
  if (!reason || typeof reason !== 'string' || reason.trim() === '') {
    throw new Error('Missing or invalid required field: reason');
  }
  if (!reporter_id) {
    throw new Error('Missing required field: reporter_id');
  }

  // Insert the report
  const { data: newReport, error } = await supabase
    .from('postreports')
    .insert({
      reporter_id,
      post_id,
      reason: reason.trim(),
      report_message: report_message.trim()
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to report post: ${error.message}`);

  return { success: true, data: newReport };
}




export async function browsePosts(pageSize = 10, pageNum = 1) {
  const offset = (pageNum - 1) * pageSize;

  // First, fetch posts
  const { data: posts, error: postsError } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (postsError) throw new Error(`Failed to browse posts: ${postsError.message}`);

  // Then, fetch traveller details for each post
  const enhancedPosts = await Promise.all(posts.map(async (post) => {
    const { data: traveller, error: travellerError } = await supabase
      .from('travellers')
      .select('traveller_fn, traveller_ls, profile_picture')
      .eq('traveller_id', post.traveller_id)
      .single();

    if (travellerError) {
      console.error(`Failed to fetch traveller for post ${post.post_id}: ${travellerError.message}`);
      post.traveller_full_name = 'Unknown Traveller';
      post.profile_picture = null;
    } else if (traveller) {
      post.traveller_full_name = `${traveller.traveller_fn} ${traveller.traveller_ls}`.trim();
      post.profile_picture = traveller.profile_picture || null;
    } else {
      post.traveller_full_name = 'Unknown Traveller';
      post.profile_picture = null;
    }

    return post;
  }));

  // Optionally fetch total count for pagination metadata
  const { count, error: countError } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true });

  if (countError) throw new Error(`Failed to count posts: ${countError.message}`);

  return {
    posts: enhancedPosts,
    pagination: {
      pageSize,
      pageNum,
      total: count,
      totalPages: Math.ceil(count / pageSize)
    }
  };
}

export async function addComment(commentData) {
  const {
    postId,
    caption,
    travellerId
  } = commentData;

  // Validate required fields
  if (!postId || !caption || !travellerId) {
    throw new Error('Missing required fields: postId, caption, travellerId');
  }

  const { data: newComment, error } = await supabase
    .from('comments')
    .insert({
      postId,
      caption,
      travellerId
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to add comment: ${error.message}`);

  return newComment;
}

export async function likePost(travellerId, postId) {
  // Check if already liked
  const { data: existingLike, error: checkError } = await supabase
    .from('likes')
    .select('travellerid')
    .eq('travellerid', travellerId)
    .eq('postId', postId)
    .single();

  if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is no rows found
    throw new Error(`Failed to check like: ${checkError.message}`);
  }

  if (existingLike) {
    throw new Error('Post already liked by this traveller');
  }

  // Insert like
  const { error: insertError } = await supabase
    .from('likes')
    .insert({
      travellerid: travellerId,
      postId
    });

  if (insertError) throw new Error(`Failed to like post: ${insertError.message}`);

  // Fetch current likes
  const { data: currentPost, error: fetchError } = await supabase
    .from('posts')
    .select('likes')
    .eq('post_id', postId)
    .single();

  if (fetchError) {
    // Optionally rollback like insert
    await supabase.from('likes').delete().eq('travellerid', travellerId).eq('postId', postId);
    throw new Error(`Failed to fetch current likes: ${fetchError.message}`);
  }

  if (!currentPost) {
    // Optionally rollback
    await supabase.from('likes').delete().eq('travellerid', travellerId).eq('postId', postId);
    throw new Error('Post not found');
  }

  const newLikes = (parseInt(currentPost.likes) || 0) + 1;

  // Update likes count
  const { error: updateError } = await supabase
    .from('posts')
    .update({ likes: newLikes })
    .eq('post_id', postId);

  if (updateError) {
    // Rollback like insert
    await supabase.from('likes').delete().eq('travellerid', travellerId).eq('postId', postId);
    throw new Error(`Failed to update likes: ${updateError.message}`);
  }

  return { success: true, message: 'Post liked successfully' };
}

export async function unlikePost(travellerId, postId) {
  // Check if liked
  const { data: existingLike, error: checkError } = await supabase
    .from('likes')
    .select('travellerid')
    .eq('travellerid', travellerId)
    .eq('postId', postId)
    .single();

  if (checkError && checkError.code !== 'PGRST116') {
    throw new Error(`Failed to check like: ${checkError.message}`);
  }

  if (!existingLike) {
    throw new Error('Post not liked by this traveller');
  }

  // Delete like
  const { error: deleteError } = await supabase
    .from('likes')
    .delete()
    .eq('travellerid', travellerId)
    .eq('postId', postId);

  if (deleteError) throw new Error(`Failed to unlike post: ${deleteError.message}`);

  // Fetch current likes
  const { data: currentPost, error: fetchError } = await supabase
    .from('posts')
    .select('likes')
    .eq('post_id', postId)
    .single();

  if (fetchError) {
    console.error(`Failed to fetch current likes: ${fetchError.message}`);
    // No rollback needed since delete happened
    return { success: true, message: 'Like removed, but likes count not updated' };
  }

  if (!currentPost) {
    console.error('Post not found for unlike');
    return { success: true, message: 'Like removed' };
  }

  const newLikes = Math.max(0, (parseInt(currentPost.likes) || 0) - 1);

  // Update likes count
  const { error: updateError } = await supabase
    .from('posts')
    .update({ likes: newLikes })
    .eq('post_id', postId);

  if (updateError) {
    console.error(`Failed to update likes: ${updateError.message}`);
  }

  return { success: true, message: 'Post unliked successfully' };
}