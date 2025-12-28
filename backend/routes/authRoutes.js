//wassim
const { authMiddleware } = require("../middlewares/middleware");
const express = require("express");
const router = express.Router();

// Controllers
const {
  
  login,
  logout,
  signUp,
  googleAuth,
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
router.get("/google" , googleAuth);
router.post("/changePass" ,authMiddleware, changePassword);
router.post("/deleteAcc" , authMiddleware , deleteAccount);



module.exports = router;
