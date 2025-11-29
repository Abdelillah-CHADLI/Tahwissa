//yacine
const express = require('express');
const {
  getBookingsByFilter,
  getProfile,
  addReview,
  getReviewsByTour,
  searchAgenciesByName,
  searchGuidesByName,
  browseAgencies,
  browseTours,
  addBooking,
  getUserBookings
} = require('../controllers/bookingController');

const router = express.Router();

router.use(express.json());

router.get('/bookings', async (req, res) => {
  try {
    const { agencyId, guideId, travellerName, status } = req.query;
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

router.post('/bookings', async (req, res) => {
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

router.get('/bookings/explore', async (req, res) => {
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

router.post('/reviews', async (req, res) => {
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
    const { search, limit = 10 } = req.query;
    if (!search) {
      return res.status(400).json({ success: false, error: 'Search term required' });
    }
    const guides = await searchGuidesByName(search, parseInt(limit));
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

module.exports = router;