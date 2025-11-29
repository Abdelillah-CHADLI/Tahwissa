//wassim
const express = require("express");
const router = express.Router();


const { addAgencyEmployee } = require("../controllers/managerController");

//route to add the agency employee
router.post('/employees', addAgencyEmployee);


module.exports = router;
