//wassim
const express = require("express");
const router = express.Router();


const {
  getProfile ,
  editProfile
} = require("../controllers/profileController");

// Get profile data
router.get('/:id', getProfile);

// Edit profile
router.put('/:id', editProfile);

module.exports = router;
