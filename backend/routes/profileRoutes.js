//wassim
const express = require("express");
const router = express.Router();


const {
  getProfile ,
  editProfile ,
  getTravellerInfo,
} = require("../controllers/profileController");

// Get profile data
router.get('/:id', getProfile);
router.get('/traveller/:id' , getTravellerInfo);

// Edit profile
router.put('/:id', editProfile);

module.exports = router;
