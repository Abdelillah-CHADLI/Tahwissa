//wassim
const express = require("express");
const router = express.Router();

// Controllers
const {
  
  login,
  logout,
  signUp,
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



module.exports = router;
