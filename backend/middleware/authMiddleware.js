const jwt = require("jsonwebtoken");
const User = require("../models/users");

// Middleware to authenticate the user
const authenticateUser = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === "production") {
      console.log("🔍 [PROD] Incoming headers.cookie:", req.headers.cookie);
      console.log("🔍 [PROD] req.cookies:", req.cookies);
    }
    console.log("🔵 AuthMiddleware: Starting authentication...");
    const token = req.cookies.auth;
    if (!token) {
      console.log("❌ AuthMiddleware: No auth token found");
      return res.status(401).json({
        message: "NOT_AUTHENTICATED",
      });
    }

    console.log("🔵 AuthMiddleware: Token found, verifying...");
    const decoded = jwt.verify(token, process.env.SECRET);
    if (process.env.NODE_ENV === "production") {
      console.log("🔍 [PROD] Decoded token:", decoded);
    }
    console.log("🔵 AuthMiddleware: Token decoded, user ID:", decoded._id);
    
    const user = await User.findById(decoded._id);
    console.log("🔵 AuthMiddleware: User lookup result:", user ? "User found" : "User not found");

    if (!user) {
      console.log("❌ AuthMiddleware: User not found in database");
      return res.status(401).json({
        message: "NOT_AUTHENTICATED",
      });
    }

    console.log("✅ AuthMiddleware: User authenticated successfully");
    req.user = user;
    next();
  } catch (err) {
    console.error("❌ AuthMiddleware Error:", err);
    res.status(401).json({
      message: "NOT_AUTHENTICATED",
    });
  }
};

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "superadmin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

module.exports = {
  authenticateUser,
  isAdmin,
};
