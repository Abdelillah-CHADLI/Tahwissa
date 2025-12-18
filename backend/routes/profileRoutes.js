//wassim
const express = require("express");
const router = express.Router();


const {
  getProfile ,
  editProfile ,
  getTravellerInfo,
  updateTravellerInfo
} = require("../controllers/profileController");

// Get profile data
router.get('/:id', getProfile);
router.get('/traveller/:id' , getTravellerInfo);
router.post('/traveller/:id' , updateTravellerInfo);

// Edit profile
router.put('/:id', editProfile);

module.exports = router;
