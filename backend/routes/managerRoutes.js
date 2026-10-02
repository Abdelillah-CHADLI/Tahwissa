// wassim
const express = require("express");
const { requireAuth, requireRole, requireManager, requireManagedAgency } = require('../middlewares/access.cjs');
const router = express.Router();
router.use(requireAuth, requireRole('AgencyEmployee'), requireManager, requireManagedAgency);

const {
  addAgencyEmployee,
  getAgencyEmployees,
  removeAgencyEmployee,
  editAgencyEmployee,
  toggleEmployeeStatus
} = require("../controllers/managerController");

router.post('/employees', addAgencyEmployee);
router.put('/editEmployee/:employee_id', editAgencyEmployee);
router.get('/employeesOp/:agency_id', getAgencyEmployees);
router.delete('/employeesOp/:employee_id', removeAgencyEmployee);
router.patch('/employeesOp/:employee_id/status', toggleEmployeeStatus);

module.exports = router;
