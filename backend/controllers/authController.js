require("dotenv").config();
const bcrypt = require("bcryptjs");
const User = require("../models/users");
const UserProfile = require("../models/UserProfile");
const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");
const serviceAccount = require("../config/firebaseServiceAcoount")
const mongoose = require("mongoose");

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

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

    const isProd = process.env.NODE_ENV === "production";
    const cookieOptions = {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "None" : "Lax",
      path: "/",
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
      domain: isProd ? process.env.COOKIE_DOMAIN : undefined
    };
    if (isProd) {
      console.log("🍪 [PROD] Setting cookie (manual login):", cookieOptions);
      console.log("🍪 [PROD] Token:", token);
      console.log("🍪 [PROD] COOKIE_DOMAIN:", process.env.COOKIE_DOMAIN);
    }
    res.cookie("auth", token, cookieOptions);
    if (isProd) {
      console.log("🍪 [PROD] res.cookie called for auth. Checking res.getHeaders()...");
      console.log("🍪 [PROD] Response headers after setting cookie:", res.getHeaders());
    }

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
    console.log("🔵 Starting Google Login process...");
    const { tokenId } = req.body;

    console.log("🔵 Token ID received:", tokenId ? "Present" : "Missing");

    const decodedToken = await admin.auth().verifyIdToken(tokenId);
    const { email, name, picture } = decodedToken;

    console.log("🔵 Google Token Decoded Successfully:");
    console.log("  - Email:", email);
    console.log("  - Name:", name);
    console.log("  - Picture URL:", picture);
    console.log("  - Picture URL Type:", typeof picture);
    console.log("  - Picture URL Length:", picture ? picture.length : 0);

    let user = await User.findOne({ email });
    console.log("🔵 User lookup result:", user ? "User found" : "No user found");

    if (user) {
      console.log("🔵 User details:");
      console.log("  - User ID:", user._id);
      console.log("  - Username:", user.username);
      console.log("  - Is Google User:", user.isGoogleUser);

      // If user exists and is a Google user, allow login
      if (!user.isGoogleUser) {
        console.log("❌ User exists but is not a Google user");
        return res.status(400).json({
          success: false,
          message:
            "This email was registered manually. Please login with email and password.",
        });
      }

      console.log("✅ User is a Google user, proceeding with login...");

      // Get user profile to check profile image
      const userProfile = await UserProfile.findOne({ userId: user._id });
      console.log("🔵 User profile lookup result:", userProfile ? "Profile found" : "No profile found");
      
      if (userProfile) {
        console.log("🔵 Current profile image in database:", userProfile.profileImage);
      }

      // Check if we should update the profile image with the latest Google picture
      if (picture && userProfile && userProfile.profileImage !== picture) {
        console.log("🔄 Updating profile image with latest Google picture...");
        console.log("  - Old image:", userProfile.profileImage);
        console.log("  - New image:", picture);
        
        userProfile.profileImage = picture;
        await userProfile.save();
        console.log("✅ Profile image updated successfully");
      } else if (picture && !userProfile.profileImage) {
        console.log("🔄 Setting profile image for the first time...");
        userProfile.profileImage = picture;
        await userProfile.save();
        console.log("✅ Profile image set for the first time");
      } else {
        console.log("ℹ️ No profile image update needed");
      }

      const token = jwt.sign(
        { _id: user._id, email: user.email },
        process.env.SECRET,
        { expiresIn: "15d" }
      );
      console.log("✅ JWT token generated");

      const isProd = process.env.NODE_ENV === "production";
      const cookieOptions = {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "None" : "Lax",
        path: "/",
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
        domain: isProd ? process.env.COOKIE_DOMAIN : undefined
      };
      if (isProd) {
        console.log("🍪 [PROD] Setting cookie (Google login):", cookieOptions);
        console.log("🍪 [PROD] Token:", token);
        console.log("🍪 [PROD] COOKIE_DOMAIN:", process.env.COOKIE_DOMAIN);
      }
      res.cookie("auth", token, cookieOptions);
      if (isProd) {
        console.log("🍪 [PROD] res.cookie called for auth. Checking res.getHeaders()...");
        console.log("🍪 [PROD] Response headers after setting cookie:", res.getHeaders());
      }
      console.log("✅ Auth cookie set");

      const finalProfileImage = userProfile?.profileImage || null;
      console.log("📤 Sending response with profile image:", finalProfileImage);

      return res.status(200).json({
        success: true,
        message: "Google login successful",
        user: { 
          username: user.username, 
          email: user.email,
          profileImage: finalProfileImage // Use profile image if exists, otherwise null
        },
      });
    }

    // No user exists → Reject login attempt
    console.log("❌ No user found with email:", email);
    return res.status(400).json({
      success: false,
      message: "No account found. Please sign up with Google first.",
    });
  } catch (error) {
    console.error("❌ Error during Google login:", error);
    console.error("❌ Error stack:", error.stack);
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
