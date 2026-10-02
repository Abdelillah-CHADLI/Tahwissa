//wassim
const express = require("express");
const multer = require("multer");
const router = express.Router();
const { requireAuth, requireRole, requireSelf, requireProfileOwner } = require('../middlewares/access.cjs');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

const {
  getProfile ,
  editProfile ,
  getTravellerInfo,
  updateTravellerInfo,
  uploadAgencyLogo
} = require("../controllers/profileController");

// Get profile data
router.get('/traveller/:id', requireAuth, requireRole('Traveller'), requireSelf('id', 'params'), getTravellerInfo);
router.post('/traveller/:id', requireAuth, requireRole('Traveller'), requireSelf('id', 'params'), updateTravellerInfo);

router.get('/:id', getProfile);

// Edit profile
router.put('/:id', requireAuth, requireRole('Guide', 'AgencyEmployee'), requireProfileOwner, editProfile);

// Upload agency logo
router.post('/agency/:id/logo', requireAuth, requireRole('AgencyEmployee'), requireProfileOwner, upload.single('logo'), uploadAgencyLogo);

module.exports = router;
