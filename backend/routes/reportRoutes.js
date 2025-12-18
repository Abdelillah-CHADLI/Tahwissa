// wassim
const express = require("express");
const router = express.Router();


const {
  
    reportAcc ,
    reportPost ,
    getPostReports ,
    getAccReports ,
    getPostReportDetails,
    getAccReportDetails , 
    deleteAcc , 
    deletePost
} = require("../controllers/reportController");


router.post("/reportAcc", reportAcc);
router.post("/reportPost", reportPost);
router.get("/getPostReports",getPostReports);
router.get("/getAccReports",getAccReports);
router.get("/getPostReportDetails/:report_id",getPostReportDetails);
router.get("/getAccReportDetails/:report_id",getAccReportDetails);
router.post("/deletePost",deletePost);





module.exports = router;
