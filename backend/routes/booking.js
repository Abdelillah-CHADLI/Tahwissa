//yacine
const express = require('express');
const multer = require('multer');
const { requireAuth, requireRole, requireSelf, requireTourOwner, requireNewTourOwner, agencyForUser, ownsTour, db } = require('../middlewares/access.cjs');
const {
  getBookingsByFilter,
  getProfile,
  addReview,
  getReviewsByTour,
  searchAgenciesByName,
  searchGuidesByName,
  browseAgencies,
  browseTours,
  getTourById,
  addBooking,
  getUserBookings,
  addTour,
  
  cancelBooking,
  confirmBooking,
  editTour,
  deleteTour
} = require('../controllers/bookingController');


console.log(cancelBooking)


const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024, files: 10 } });
router.use(express.json());
// Add this route
router.post('/tours', requireAuth, requireRole('Guide', 'AgencyEmployee'), upload.array('images', 10), requireNewTourOwner, async (req, res) => {
  try {
    const tourData = req.body;
    const images = req.files ? req.files.map(file => ({
      name: file.originalname,
      content: file.buffer,
      mimeType: file.mimetype
    })) : []; // Placeholder; adjust based on your upload setup
    const newTour = await addTour(tourData, images);
    res.status(201).json({ success: true, data: newTour });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
router.get('/bookings', requireAuth, requireRole('Guide', 'AgencyEmployee'), async (req, res) => {
  try {
    const { agencyId, guideId, travellerName, status } = req.query;
    if (req.user.role === 'Guide' && (String(guideId) !== String(req.user.id) || agencyId)) {
      return res.status(403).json({ message: 'Access denied.' });
    }
    if (req.user.role === 'AgencyEmployee' && (String(agencyId) !== String(await agencyForUser(req.user.id)) || guideId)) {
      return res.status(403).json({ message: 'Access denied.' });
    }
    const filter = { agencyId, guideId, travellerName, status };
    const bookings = await getBookingsByFilter(filter);
    res.json({ success: true, data: bookings });
  } catch (error) {
    if (error.message.includes('required')) {
      return res.status(400).json({ success: false, error: error.message });
    }
    res.status(500).json({ success: false, error: error.message });
  }
});
router.post('/bookings', requireAuth, requireRole('Traveller'), requireSelf('traveller_id'), async (req, res) => {
  try {
    const bookingData = req.body;
    if (!bookingData.traveller_id || !bookingData.tour_id) {
      return res.status(400).json({ success: false, error: 'Missing required fields: traveller_id, tour_id' });
    }
    const newBooking = await addBooking(bookingData);
    res.status(201).json({ success: true, data: newBooking });
  } catch (error) {
    if (error.message.includes('rejected')) {
      return res.status(400).json({ success: false, error: error.message });
    }
    res.status(500).json({ success: false, error: error.message });
  }
});
router.get('/bookings/explore', requireAuth, requireRole('Traveller'), requireSelf('userId', 'query'), async (req, res) => {
  try {
    const { userId } = req.query;
    const bookings = await getUserBookings(userId);
    res.json({ success: true, data: bookings });
  } catch (error) {
    if (error.message.includes('required')) {
      return res.status(400).json({ success: false, error: error.message });
    }
    res.status(500).json({ success: false, error: error.message });
  }
});
router.get('/profile/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.query;
    if (!type || (type !== 'agency' && type !== 'guide')) {
      return res.status(400).json({ success: false, error: 'Type must be "agency" or "guide"' });
    }
    const profile = await getProfile(id, type);
    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
router.post('/reviews', requireAuth, requireRole('Traveller'), requireSelf('traveller_id'), async (req, res) => {
  try {
    const reviewData = req.body;
    if (!reviewData.tour_id || !reviewData.traveller_id || !reviewData.review_score) {
      return res.status(400).json({ success: false, error: 'Missing required fields: tour_id, traveller_id, review_score' });
    }
    const newReview = await addReview(reviewData);
    res.status(201).json({ success: true, data: newReview });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
router.get('/reviews/:tourId', async (req, res) => {
  try {
    const { tourId } = req.params;
    const reviews = await getReviewsByTour(tourId);
    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
router.get('/agencies', async (req, res) => {
  try {
    const { search, limit = 10 } = req.query;
    if (!search) {
      return res.status(400).json({ success: false, error: 'Search term required' });
    }
    const agencies = await searchAgenciesByName(search, parseInt(limit));
    res.json({ success: true, data: agencies });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
router.get('/guides', async (req, res) => {
  try {
    let { search , page = 1, limit = 10 } = req.query;
    // if (!search) {
    //   return res.status(400).json({ success: false, error: 'Search term required' });
    // }
    //
        if (!search) {
     search = null
    }
    const guides = await searchGuidesByName(search , parseInt(page), parseInt(limit));
    res.json({ success: true, data: guides });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
router.get('/agencies/browse', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;
    if (page < 1 || size < 1 || size > 100) {
      return res.status(400).json({ success: false, error: 'Page >=1, size 1-100' });
    }
    const result = await browseAgencies(page, size);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
router.get('/tours/browse', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;
    if (page < 1 || size < 1 || size > 100) {
      return res.status(400).json({ success: false, error: 'Page >=1, size 1-100' });
    }
    // Parse optional filters
    let cat = null;
    if (req.query.cat) {
      cat = Array.isArray(req.query.cat) ? req.query.cat : req.query.cat.split(',').map(c => c.trim()).filter(Boolean);
      if (cat.length === 0) cat = null;
    }
    let regions = null;
    if (req.query.regions) {
      regions = Array.isArray(req.query.regions) ? req.query.regions : req.query.regions.split(',').map(r => r.trim()).filter(Boolean);
      if (regions.length === 0) regions = null;
    }
    const priceMin = req.query.priceMin ? parseFloat(req.query.priceMin) : null;
    if (priceMin !== null && (isNaN(priceMin) || priceMin < 0)) {
      return res.status(400).json({ success: false, error: 'priceMin must be a non-negative number' });
    }
    const priceMax = req.query.priceMax ? parseFloat(req.query.priceMax) : null;
    if (priceMax !== null && (isNaN(priceMax) || priceMax < 0)) {
      return res.status(400).json({ success: false, error: 'priceMax must be a non-negative number' });
    }
    if (priceMin !== null && priceMax !== null && priceMin > priceMax) {
      return res.status(400).json({ success: false, error: 'priceMin must be less than or equal to priceMax' });
    }
    const provider = req.query.provider ? req.query.provider.trim().toLowerCase() : null;
    if (provider && !['agency', 'guide'].includes(provider)) {
      return res.status(400).json({ success: false, error: 'provider must be "agency" or "guide"' });
    }
    const result = await browseTours(page, size, cat, regions, priceMin, priceMax, provider);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/tours/:tourId', async (req, res) => {
  try {
    const tour = await getTourById(req.params.tourId);
    if (!tour) return res.status(404).json({ success: false, error: 'Tour not found' });
    res.json({ success: true, data: tour });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// New routes for booking cancellation and confirmation
router.patch('/bookings/:bookingId/cancel', requireAuth, async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const supabase = await db();
    const { data: booking } = await supabase.from('bookings').select('traveller_id, tour_id').eq('booking_id', bookingId).maybeSingle();
    const allowed = booking && (String(booking.traveller_id) === String(req.user.id) || await ownsTour(req.user, booking.tour_id));
    if (!allowed) return res.status(403).json({ message: 'Access denied.' });
    if (!bookingId) {
      return res.status(400).json({ success: false, error: 'Missing required field: bookingId' });
    }
    const updatedBooking = await cancelBooking(bookingId);
    res.json({ success: true, data: updatedBooking });
  } catch (error) {
    if (error.message.includes('not found') || error.message.includes('cannot cancel')) {
      return res.status(400).json({ success: false, error: error.message });
    }
    next(error);
  }
});

router.patch('/bookings/:bookingId/confirm', requireAuth, requireRole('Guide', 'AgencyEmployee'), async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const supabase = await db();
    const { data: booking } = await supabase.from('bookings').select('tour_id').eq('booking_id', bookingId).maybeSingle();
    if (!booking || !await ownsTour(req.user, booking.tour_id)) return res.status(403).json({ message: 'Access denied.' });
    if (!bookingId) {
      return res.status(400).json({ success: false, error: 'Missing required field: bookingId' });
    }
    const updatedBooking = await confirmBooking(bookingId);
    res.json({ success: true, data: updatedBooking });
  } catch (error) {
    if (error.message.includes('not found') || error.message.includes('cannot confirm')) {
      return res.status(400).json({ success: false, error: error.message });
    }
    next(error);
  }
});

// New routes for editing and deleting tours
router.put('/tours/:tourId', requireAuth, requireRole('Guide', 'AgencyEmployee'), requireTourOwner, upload.array('images', 10), async (req, res) => {
  try {
    const { tourId } = req.params;
    const allowed = ['tour_title', 'location', 'price', 'start_date', 'category', 'duration', 'group_size', 'tour_details', 'tour_included', 'requirements', 'tour_not_included'];
    const tourData = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
    const images = req.files ? req.files.map(file => ({
      name: file.originalname,
      content: file.buffer,
      mimeType: file.mimetype
    })) : []; // Optional new images for update
    if (!tourId || Object.keys(tourData).length === 0) {
      return res.status(400).json({ success: false, error: 'Missing required fields: tourId and update data' });
    }
    const updatedTour = await editTour(tourId, tourData, images);
    res.json({ success: true, data: updatedTour });
  } catch (error) {
    if (error.message.includes('not found') || error.message.includes('cannot update')) {
      return res.status(400).json({ success: false, error: error.message });
    }
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/tours/:tourId', requireAuth, requireRole('Guide', 'AgencyEmployee'), requireTourOwner, async (req, res) => {
  try {
    const { tourId } = req.params;
    if (!tourId) {
      return res.status(400).json({ success: false, error: 'Missing required field: tourId' });
    }
    await deleteTour(tourId);
    res.json({ success: true, message: 'Tour deleted successfully' });
  } catch (error) {
    if (error.message.includes('not found') || error.message.includes('cannot delete')) {
      return res.status(400).json({ success: false, error: error.message });
    }
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
