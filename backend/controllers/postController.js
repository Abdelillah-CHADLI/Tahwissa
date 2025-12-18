//yacine

import { supabase } from "../config/supabasedb.js";
export async function addPost(postData, images = []) {
  const {
    title,
    text,
    location = '',
    traveller_id,
    stars = 0
  } = postData;
  if (!title || !text || !traveller_id) {
    throw new Error('Missing required fields: title, text, traveller_id');
  }
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
  let imageUrl = null;
  if (images && images.length > 0) {
    const image = images[0];
    const bucket = 'post-images';
    const fileName = `${newPost.post_id}-${Date.now()}-${image.name}`;
   
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, image.content, {
        contentType: image.mimeType,
        upsert: true
      });
    if (uploadError) {
      console.error(`Failed to upload image ${fileName}: ${uploadError.message}`);
    } else {
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);
      
      imageUrl = publicUrl;
      const { error: updateError } = await supabase
        .from('posts')
        .update({ image_url: publicUrl })
        .eq('post_id', newPost.post_id);
      if (updateError) {
        console.error(`Failed to update post with image URL: ${updateError.message}`);
      }
    }
  }
  return {
    ...newPost,
    image_url: imageUrl || newPost.image_url
  };
}
export async function getPostById(postId) {
  if (!postId || isNaN(postId)) {
    throw new Error('Invalid post ID');
  }
  const { data: post, error: postError } = await supabase
    .from('posts')
    .select('*')
    .eq('post_id', postId)
    .single();
  if (postError) throw new Error(`Failed to fetch post: ${postError.message}`);
  if (!post) {
    throw new Error('Post not found');
  }
  const { data: traveller, error: travellerError } = await supabase
    .from('travellers')
    .select('traveller_fn, traveller_ls , profile_picture')
    .eq('traveller_id', post.traveller_id)
    .single();
  if (travellerError) throw new Error(`Failed to fetch traveller: ${travellerError.message}`);
  if (!traveller) {
    post.traveller_full_name = 'Unknown Traveller';
  } else {
    post.traveller_full_name = `${traveller.traveller_fn} ${traveller.traveller_ls}`.trim();
    post.traveller_profile_image = traveller.profile_picture
  }
  return post;
}
export async function getCommentsByPostId(postId) {
  if (!postId || isNaN(postId)) {
    throw new Error('Invalid post ID');
  }
  const { data: comments, error: commentsError } = await supabase
    .from('comments')
    .select('*')
    .eq('postId', postId)
    .order('created_at', { ascending: true });
  if (commentsError) throw new Error(`Failed to fetch comments: ${commentsError.message}`);
  if (!comments || comments.length === 0) {
    return { comments: [] };
  }
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
  if (!travellerId) {
    throw new Error('Missing required: travellerId');
  }
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
  let newProfilePictureUrl = null;
  const imageData = updateData.profile_picture;
  if (imageData && imageData.base64 && imageData.mimeType) {
    const bucket = 'traveller-profiles';
    const fileName = `${travellerId}-${Date.now()}.jpg`;
    const { data: currentProfile, error: fetchError } = await supabase
      .from('travellers')
      .select('profile_picture')
      .eq('traveller_id', travellerId)
      .single();
    if (fetchError) {
      throw new Error(`Failed to fetch current profile: ${fetchError.message}`);
    }
    if (currentProfile && currentProfile.profile_picture) {
      try {
        const urlParts = currentProfile.profile_picture.split('/');
        const oldFileName = urlParts[urlParts.length - 1];
        const { error: deleteError } = await supabase.storage
          .from(bucket)
          .remove([oldFileName]);
        if (deleteError && deleteError.message !== 'No files found') {
          console.error(`Failed to delete old image: ${deleteError.message}`);
        }
      } catch (deleteErr) {
        console.error(`Error deleting old image: ${deleteErr.message}`);
      }
    }
    const buffer = Buffer.from(imageData.base64, 'base64');
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, buffer, {
        contentType: imageData.mimeType,
        upsert: true
      });
    if (uploadError) {
      throw new Error(`Failed to upload profile picture: ${uploadError.message}`);
    }
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);
    newProfilePictureUrl = publicUrl;
    updateFields.profile_picture = publicUrl;
  }
  if (Object.keys(updateFields).length === 0) {
    return { success: true, message: 'No changes made' };
  }
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
  if (!post_id || isNaN(post_id)) {
    throw new Error('Missing or invalid required field: post_id');
  }
  if (!reason || typeof reason !== 'string' || reason.trim() === '') {
    throw new Error('Missing or invalid required field: reason');
  }
  if (!reporter_id) {
    throw new Error('Missing required field: reporter_id');
  }
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
  const { data: posts, error: postsError } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + pageSize - 1);
  if (postsError) throw new Error(`Failed to browse posts: ${postsError.message}`);
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
  const { data: existingLike, error: checkError } = await supabase
    .from('likes')
    .select('travellerid')
    .eq('travellerid', travellerId)
    .eq('postId', postId)
    .single();
  if (checkError && checkError.code !== 'PGRST116') {
    throw new Error(`Failed to check like: ${checkError.message}`);
  }
  if (existingLike) {
    throw new Error('Post already liked by this traveller');
  }
  const { error: insertError } = await supabase
    .from('likes')
    .insert({
      travellerid: travellerId,
      postId
    });
  if (insertError) throw new Error(`Failed to like post: ${insertError.message}`);
  const { data: currentPost, error: fetchError } = await supabase
    .from('posts')
    .select('likes')
    .eq('post_id', postId)
    .single();
  if (fetchError) {
    await supabase.from('likes').delete().eq('travellerid', travellerId).eq('postId', postId);
    throw new Error(`Failed to fetch current likes: ${fetchError.message}`);
  }
  if (!currentPost) {
    await supabase.from('likes').delete().eq('travellerid', travellerId).eq('postId', postId);
    throw new Error('Post not found');
  }
  const newLikes = (parseInt(currentPost.likes) || 0) + 1;
  const { error: updateError } = await supabase
    .from('posts')
    .update({ likes: newLikes })
    .eq('post_id', postId);
  if (updateError) {
    await supabase.from('likes').delete().eq('travellerid', travellerId).eq('postId', postId);
    throw new Error(`Failed to update likes: ${updateError.message}`);
  }
  return { success: true, message: 'Post liked successfully' };
}
export async function unlikePost(travellerId, postId) {
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
  const { error: deleteError } = await supabase
    .from('likes')
    .delete()
    .eq('travellerid', travellerId)
    .eq('postId', postId);
  if (deleteError) throw new Error(`Failed to unlike post: ${deleteError.message}`);
  const { data: currentPost, error: fetchError } = await supabase
    .from('posts')
    .select('likes')
    .eq('post_id', postId)
    .single();
  if (fetchError) {
    console.error(`Failed to fetch current likes: ${fetchError.message}`);
    return { success: true, message: 'Like removed, but likes count not updated' };
  }
  if (!currentPost) {
    console.error('Post not found for unlike');
    return { success: true, message: 'Like removed' };
  }
  const newLikes = Math.max(0, (parseInt(currentPost.likes) || 0) - 1);
  const { error: updateError } = await supabase
    .from('posts')
    .update({ likes: newLikes })
    .eq('post_id', postId);
  if (updateError) {
    console.error(`Failed to update likes: ${updateError.message}`);
  }
  return { success: true, message: 'Post unliked successfully' };
}