const jwt = require("jsonwebtoken");
const User = require("../models/users");

// Middleware to authenticate the user
const authenticateUser = async (req, res, next) => {
  try {
    const token = req.cookies.auth;
    if (!token) {
      return res.status(401).json({
        message: "NOT_AUTHENTICATED",
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET);
    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(401).json({
        message: "NOT_AUTHENTICATED",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err);
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
