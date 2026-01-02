// wassim
const express = require("express");
const router = express.Router();

const { 
  addAgencyEmployee, 
  getAgencyEmployees , 
  removeAgencyEmployee, 
  editAgencyEmployee
} = require("../controllers/managerController");

router.post('/employees', addAgencyEmployee);
router.put('/editEmployee/:employee_id', editAgencyEmployee);


router.get('/employeesOp/:agency_id', getAgencyEmployees);

router.delete('/employeesOp/:employee_id', removeAgencyEmployee);

module.exports = router;
