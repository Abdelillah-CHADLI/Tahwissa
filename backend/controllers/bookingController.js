//yacine
import { json } from "node:stream/consumers";
import {supabase} from "../config/supabasedb.js";





export async function addTour(tourData, images = []) {
  const {
    tour_title,
    location,
    price,
    group_size,
    duration,
    agency_id,
    guide_id,
    tour_details,
    tour_included,
    start_date,
    category ,
      requirements,
      tour_not_included
  } = tourData;

  let on = {
    'xhzt':'uhfu'
  }
 let dbr =  JSON.stringify(on)

  JSON.parse()



  // Validate required fields
  if (!tour_title || !location || !price || !start_date) {
    throw new Error('Missing required fields: tour_title, location, price, start_date');
  }

  // Validate exclusive agency or guide (exactly one)
  const hasAgency = !!agency_id;
  const hasGuide = !!guide_id;
  if (hasAgency && hasGuide) {
    throw new Error('Tour cannot be associated with both an agency and a guide');
  }
  if (!hasAgency && !hasGuide) {
    throw new Error('Tour must be associated with either an agency or a guide');
  }

  // Insert the tour record
  const { data: newTour, error: insertError } = await supabase
    .from('tours')
    .insert({
      tour_title,
      location,
      price,
      group_size,
      duration,
      agency_id: hasAgency ? agency_id : null,
      guide_id: hasGuide ? guide_id : null,
      tour_details,
      tour_included,
      start_date,
      category ,
      requirements,
      tour_not_included
    })
    .select()
    .single();

  if (insertError) throw new Error(`Failed to add tour: ${insertError.message}`);

  // Handle image uploads if provided (assuming images is an array of { name: string, content: Buffer, mimeType: string })
  const imageUrls = [];
  if (images && images.length > 0) {
    const bucket = 'tour-images'; // Assume a bucket named 'tour-images' exists in Supabase Storage
    for (const image of images) {
      const fileName = `${newTour.tour_id}-${image.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, image.content, {
          contentType: image.mimeType,
          upsert: true
        });

      if (uploadError) {
        // Optionally, continue or throw; here we log but proceed
        console.error(`Failed to upload image ${fileName}: ${uploadError.message}`);
        continue;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      // Insert into tour_images
      const { error: imageInsertError } = await supabase
        .from('tour_images')
        .insert({
          tour_id: newTour.tour_id,
          image_url: publicUrl
        });

      if (imageInsertError) {
        console.error(`Failed to insert image URL for ${fileName}: ${imageInsertError.message}`);
        continue;
      }

      imageUrls.push(publicUrl);
    }
  }

  // Return the new tour with image URLs
  return {
    ...newTour,
    images: imageUrls
  };
}

export async function getBookingsByFilter(filter = {}) {
  const { agencyId, guideId, travellerName, status } = filter;
  if (!agencyId && !guideId) {
    throw new Error('Either agencyId or guideId is required');
  }
  let query = supabase
    .from('bookings')
    .select(`
      *,
      travellers!inner(traveller_fn, traveller_ls),
      tours!inner (
        tour_id,
        tour_title,
        location,
        price,
        agency_id,
        guide_id,
        start_date
      )
    `);
  if (agencyId) {
    query = query.eq('tours.agency_id', agencyId);
  }
  if (guideId) {
    query = query.eq('tours.guide_id', guideId);
  }
  if (travellerName) {
    query = query.ilike('travellers.traveller_fn', `%${travellerName}%`);
  }
  if (status) {
    query = query.eq('status', status);
  }
  const { data, error } = await query.order('booking_date', { ascending: false });
  if (error) throw new Error(`Failed to fetch bookings: ${error.message}`);
  return data;
}

export async function getProfile(id, type) {
  let query;
  if (type === 'agency') {
    query = supabase
      .from('agencies')
      .select(`
        *,
        manager:users!manager_id(email, role)
      `)
      .eq('agency_id', id)
      .single();
  } else if (type === 'guide') {
    query = supabase
      .from('guides')
      .select(`
        *,
        user:users!guide_id(email, role)
      `)
      .eq('guide_id', id)
      .single();
  } else {
    throw new Error('Invalid type: must be "agency" or "guide"');
  }
  const { data, error } = await query;
  if (error) throw new Error(`Failed to fetch ${type} profile: ${error.message}`);
  return data;
}

export async function addReview(reviewData) {
  const { tour_id, traveller_id, comment, review_score } = reviewData;
  const { data: newReview, error: insertError } = await supabase
    .from('reviews')
    .insert({ tour_id, traveller_id, comment, review_score })
    .select()
    .single();
  if (insertError) throw new Error(`Failed to add review: ${insertError.message}`);
  const { data: tour, error: tourError } = await supabase
    .from('tours')
    .select('agency_id, guide_id')
    .eq('tour_id', tour_id)
    .single();
  if (tourError) throw new Error(`Failed to fetch tour for update: ${tourError.message}`);
  let updateQuery;
  if (tour.agency_id) {
    const { data: agency, error: agencyFetchError } = await supabase
      .from('agencies')
      .select('num_raters, rating')
      .eq('agency_id', tour.agency_id)
      .single();
    if (agencyFetchError) throw new Error(`Failed to fetch agency: ${agencyFetchError.message}`);
    updateQuery = supabase
      .from('agencies')
      .update({
        num_raters: agency.num_raters + 1,
        rating: agency.rating + review_score
      })
      .eq('agency_id', tour.agency_id);
  } else if (tour.guide_id) {
    const { data: guide, error: guideFetchError } = await supabase
      .from('guides')
      .select('num_raters, ratings')
      .eq('guide_id', tour.guide_id)
      .single();
    if (guideFetchError) throw new Error(`Failed to fetch guide: ${guideFetchError.message}`);
    updateQuery = supabase
      .from('guides')
      .update({
        num_raters: guide.num_raters + 1,
        ratings: guide.ratings + review_score
      })
      .eq('guide_id', tour.guide_id);
  } else {
    throw new Error('Tour has no agency or guide to update ratings');
  }
  const { error: updateError } = await updateQuery;
  if (updateError) throw new Error(`Failed to update ratings: ${updateError.message}`);
  return newReview;
}

export async function getReviewsByTour(tour_id) {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      travellers!inner(traveller_fn, traveller_ls)
    `)
    .eq('tour_id', tour_id)
    .order('created_at', { ascending: false });
  if (error) throw new Error(`Failed to fetch reviews: ${error.message}`);
  return data;
}

export async function searchAgenciesByName(name, limit = 10) {
  const { data, error } = await supabase
    .from('agencies')
    .select('*')
    .ilike('agency_name', `%${name}%`)
    .limit(limit);
  if (error) throw new Error(`Failed to search agencies: ${error.message}`);
  return data;
}

export async function searchGuidesByName(name , page = 1, limit = 10) {
  const start = (page - 1) * limit;
  const end = start + limit - 1;
  if(name == null){
      const { data, error } = await supabase
    .from('guides')
    .select('*')
      .range(start, end)
      if (error) throw new Error(`Failed to search guides: ${error.message}`);
  return data;
  }else{
      const { data, error } = await supabase
    .from('guides')
    .select('*')
    .ilike('guide_name', `%${name}%`)
    .range(start, end)
      if (error) throw new Error(`Failed to search guides: ${error.message}`);
  return data;
  }

  if (error) throw new Error(`Failed to search guides: ${error.message}`);
  return data;
}

export async function browseAgencies(page = 1, size = 10) {
  const start = (page - 1) * size;
  const end = start + size - 1;
  const { data: agencies, error: agencyError } = await supabase
    .from('agencies')
    .select(`
      *,
      tours (
        tour_id,
        tour_title,
        location,
        price,
        start_date,
        guide_id
      )
    `)
    .range(start, end)
    .order('agency_name', { ascending: true });
  if (agencyError) throw new Error(`Failed to fetch agencies: ${agencyError.message}`);
  const { count, error: countError } = await supabase
    .from('agencies')
    .select('*', { count: 'exact', head: true });
  if (countError) throw new Error(`Failed to count agencies: ${countError.message}`);
  return {
    agencies,
    pagination: {
      page,
      size,
      total: count,
      totalPages: Math.ceil(count / size),
      hasNext: page < Math.ceil(count / size),
      hasPrev: page > 1
    }
  };
}

export async function browseTours(
  page = 1, 
  size = 10, 
  cat = null, 
  regions = null, 
  priceMin = null, 
  priceMax = null, 
  provider = null
) {
  const start = (page - 1) * size;
  const end = start + size - 1;
  
  const params = { cat, regions, priceMin, priceMax, provider };
  
  const selectStr = `
    *,
    agencies!agency_id (
      agency_id,
      agency_name,
      rating,
      num_raters
    ),
    guides!guide_id (
      guide_id,
      guide_name,
      ratings,
      num_raters
    )
  `;
  
  function applyFilters(query) {
    if (params.cat && params.cat.length > 0) {
      query = query.in('category', params.cat);
    }
    if (params.regions && params.regions.length > 0) {
      query = query.in('location', params.regions);
    }
    if (params.priceMin !== null) {
      query = query.gte('price', params.priceMin);
    }
    if (params.priceMax !== null) {
      query = query.lte('price', params.priceMax);
    }
    if (params.provider === 'agency') {
      query = query.is('guide_id', null);
    } else if (params.provider === 'guide') {
      query = query.is('agency_id', null);
    }
    return query;
  }
  
  // Count query
  let countQuery = supabase
    .from('tours')
    .select('*', { count: 'exact', head: true });
  countQuery = applyFilters(countQuery);
  const { count, error: countError } = await countQuery;
  if (countError) throw new Error(`Failed to count tours: ${countError.message}`);
  
  // Data query
  let dataQuery = supabase
    .from('tours')
    .select(selectStr);
  dataQuery = applyFilters(dataQuery);
  dataQuery = dataQuery
    .range(start, end)
    .order('created_at', { ascending: false });
  const { data: tours, error: tourError } = await dataQuery;
  if (tourError) throw new Error(`Failed to fetch tours: ${tourError.message}`);
  
  return {
    tours,
    pagination: {
      page,
      size,
      total: count,
      totalPages: Math.ceil(count / size),
      hasNext: page < Math.ceil(count / size),
      hasPrev: page > 1
    }
  };
}

export async function addBooking(bookingData) {
  const { traveller_id, tour_id } = bookingData;
  const today = new Date().toISOString().split('T')[0];
  const status = 'PENDING';
  const { data: tour, error: tourError } = await supabase
    .from('tours')
    .select('start_date')
    .eq('tour_id', tour_id)
    .single();
  if (tourError) throw new Error(`Failed to fetch tour: ${tourError.message}`);
  if (!tour || new Date(today) > new Date(tour.start_date)) {
    throw new Error('Booking rejected: Tour start date is in the past');
  }
  const { data: newBooking, error: insertError } = await supabase
    .from('bookings')
    .insert({ traveller_id, tour_id, booking_date: today, status })
    .select()
    .single();
  if (insertError) throw new Error(`Failed to add booking: ${insertError.message}`);
  return newBooking;
}

export async function getUserBookings(userId) {
  if (!userId) throw new Error('userId is required');
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      tours!inner (
        tour_id,
        tour_title,
        location,
        price,
        agency_id,
        guide_id,
        start_date
      )
    `)
    .eq('traveller_id', userId)
    .order('booking_date', { ascending: false });
  if (error) throw new Error(`Failed to fetch user bookings: ${error.message}`);
  return data;
}