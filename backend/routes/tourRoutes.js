// wassim
const express = require("express");
const router = express.Router();


const {
  
  getTours
} = require("../controllers/toursController");
const {
  
  searchTours
} = require("../controllers/tourSearchController");


router.get("/gettours", getTours);
router.post("/searchTours", searchTours);


module.exports = router;
