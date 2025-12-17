// wassim
const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer(); 


const {
  
  verify ,
  getAgencyVerifications ,
  getGuideVerifications ,
  getDashboardStats,
  approveVerification
} = require("../controllers/verificationController");

router.post("/verify",upload.single("file"), verify);
router.get("/getAgencyVerifications", getAgencyVerifications);
router.get("/getGuideVerifications", getGuideVerifications);
router.get("/getDashboardStats", getDashboardStats);
router.post("/approveVerification", approveVerification);





module.exports = router;
