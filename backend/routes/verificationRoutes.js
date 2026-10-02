// wassim
const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } });
const { requireAuth, requireRole, requireVerificationOwner } = require('../middlewares/access.cjs');


const {

  verify,
  getAgencyVerifications,
  getGuideVerifications,
  getDashboardStats,
  approveVerification,
  rejectVerification
} = require("../controllers/verificationController");

router.post("/verify", requireAuth, requireRole('Guide', 'AgencyEmployee'), upload.single("file"), requireVerificationOwner, verify);
router.use(requireAuth, requireRole('admin'));
router.get("/getAgencyVerifications", getAgencyVerifications);
router.get("/getGuideVerifications", getGuideVerifications);
router.get("/getDashboardStats", getDashboardStats);
router.post("/approveVerification", approveVerification);
router.post("/rejectVerification", rejectVerification);





module.exports = router;
