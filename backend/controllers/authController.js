require("dotenv").config();
const bcrypt = require("bcryptjs");
const User = require("../models/users");
const UserProfile = require("../models/UserProfile");
const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");
const serviceAccount = require("../config/firebaseServiceAcoount")

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 🔹 Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Check if user signed up with Google
    if (user.isGoogleUser) {
      return res.status(400).json({
        success: false,
        message: "Please use Google Sign-In to login.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.SECRET,
      { expiresIn: "15d" }
    );

    res.cookie("auth", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
      domain: process.env.NODE_ENV === "production" ? process.env.COOKIE_DOMAIN : undefined
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: { username: user.username, email: user.email },
    });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ success: false, message: "Login failed" });
  }
};

// 🔹 Logout User
exports.logout = (req, res) => {
  res.clearCookie("auth");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

// ✅ Google Login Controller
exports.googleLogin = async (req, res) => {
  try {
    const { tokenId } = req.body;

    const decodedToken = await admin.auth().verifyIdToken(tokenId);
    const { email, name, picture } = decodedToken;

    let user = await User.findOne({ email });

    if (user) {
      // If user exists and is a Google user, allow login
      if (!user.isGoogleUser) {
        return res.status(400).json({
          success: false,
          message:
            "This email was registered manually. Please login with email and password.",
        });
      }

      // Get user profile to check profile image
      const userProfile = await UserProfile.findOne({ userId: user._id });

      const token = jwt.sign(
        { _id: user._id, email: user.email },
        process.env.SECRET,
        { expiresIn: "15d" }
      );

      res.cookie("auth", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
        domain: process.env.NODE_ENV === "production" ? process.env.COOKIE_DOMAIN : undefined
      });

      return res.status(200).json({
        success: true,
        message: "Google login successful",
        user: { 
          username: user.username, 
          email: user.email,
          profileImage: userProfile?.profileImage || null // Use profile image if exists, otherwise null
        },
      });
    }

    // No user exists → Reject login attempt
    return res.status(400).json({
      success: false,
      message: "No account found. Please sign up with Google first.",
    });
  } catch (error) {
    console.error("Error during Google login:", error);
    res.status(500).json({ success: false, message: "Google login failed" });
  }
};

// 🔹 Verify Session
exports.verifySession = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error in verifySession:", error);
    res.status(500).json({ success: false, message: "Session verification failed" });
  }
};
