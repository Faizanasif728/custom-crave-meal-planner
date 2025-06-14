const express = require("express");
const router = express.Router();
const {
  login,
  logout,
  verifySession,
  googleLogin
} = require("../controllers/authController");
const { authenticateUser } = require("../middleware/authMiddleware");
const { getUserProfile } = require("../controllers/userController");

// User login
router.post("/login", login);

// Google login
router.post("/google-login", googleLogin);

// User logout
router.post("/logout", logout);

// Verify session
router.get("/verify-session", authenticateUser, verifySession);

// Get user profile
router.get("/get-profile", authenticateUser, getUserProfile);

module.exports = router;
