//wassim
const express = require("express");
const multer = require("multer");
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

const {
  getProfile ,
  editProfile ,
  getTravellerInfo,
  updateTravellerInfo,
  uploadAgencyLogo
} = require("../controllers/profileController");

// Get profile data
router.get('/:id', getProfile);
router.get('/traveller/:id' , getTravellerInfo);
router.post('/traveller/:id' , updateTravellerInfo);

// Edit profile
router.put('/:id', editProfile);

// Upload agency logo
router.post('/agency/:id/logo', upload.single('logo'), uploadAgencyLogo);

module.exports = router;
