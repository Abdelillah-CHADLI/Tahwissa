// wassim
const express = require("express");
const router = express.Router();

const { 
  addAgencyEmployee, 
  removeAgencyEmployee, 
  getAgencyEmployees 
} = require("../controllers/managerController");

router.post('/employees', addAgencyEmployee);

router.get('/employeesOp/:agency_id', getAgencyEmployees);

router.delete('/employeesOp/:employee_id', removeAgencyEmployee);

module.exports = router;
