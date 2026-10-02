// wassim
const express = require("express");
const router = express.Router();
const { requireAuth, requireRole, requireSelf } = require('../middlewares/access.cjs');


const {

    reportAcc,
    reportPost,
    getPostReports,
    getAccReports,
    getPostReportDetails,
    getAccReportDetails,
    deleteAccount,
    deletePost,
    dismissReport
} = require("../controllers/reportController");


router.post("/reportAcc", requireAuth, requireSelf('reporter_id'), reportAcc);
router.post("/reportPost", requireAuth, requireSelf('reporter_id'), reportPost);
router.use(requireAuth, requireRole('admin'));
router.get("/getPostReports", getPostReports);
router.get("/getAccReports", getAccReports);
router.get("/getPostReportDetails/:report_id", getPostReportDetails);
router.get("/getAccReportDetails/:report_id", getAccReportDetails);
router.post("/deletePost", deletePost);
router.post("/deleteAccount", deleteAccount);
router.post("/dismissReport", dismissReport);





module.exports = router;
