//wassim
const { authMiddleware } = require("../middlewares/middleware");
const { requireAuth } = require('../middlewares/access.cjs');
const express = require("express");
const router = express.Router();

// Controllers
const {
  
  login,
  logout,
  signUp,
  changePassword,
  deleteAccount,
} = require("../controllers/authController");

// AUTH ROUTES
router.post("/login", login);                 // login
router.post("/signUp" , async ( req , res) => {
  try {
      await signUp(req,res);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}) 
router.post("/logout", logout);               // logout
router.get('/session', requireAuth, (req, res) => {
  res.json({ id: req.user.id, email: req.user.email, role: req.user.role });
});
router.post("/changePass" ,authMiddleware, changePassword);
router.post("/deleteAcc" , authMiddleware , deleteAccount);



module.exports = router;
