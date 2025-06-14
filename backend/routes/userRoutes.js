const express = require("express");
const router = express.Router();
const {
  createUser,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  getUserCalories,
  uploadProfileImage,
  deleteProfileImage,
  getUserCustomMeals,
  getPhysicalStats,
  getDietaryType,
  getMealType,
  updateDietaryType,
  googleSignup,
} = require("../controllers/userController");

const { authenticateUser } = require("../middleware/authMiddleware");

const multer = require("multer");

// Configure multer for file uploads
const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB file size limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only JPEG, PNG, and WEBP files are allowed"));
    }
    cb(null, true);
  },
});

// (C) Create user
router.post("/create-user", createUser);

// (R) Get user profile by username or email
router.get("/get-profile", authenticateUser, getUserProfile);

// (U) Update user profile by username and current password
router.put("/update-profile", authenticateUser, updateUserProfile);

// (D) Delete user profile by username and current password
router.delete("/delete-user", authenticateUser, deleteUser);

// (R) Getting calories
router.put("/calories", authenticateUser, getUserCalories);

// (U) Upload profile image
router.post(
  "/upload-profile-image",
  authenticateUser,
  upload.single("image"),
  (err, req, res, next) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  },
  uploadProfileImage
);

router.delete("/delete-profile-image", authenticateUser, deleteProfileImage);

// Route to fetch custom meals
router.get("/get-custom-meals", authenticateUser, getUserCustomMeals);

router.get("/physical-stats", authenticateUser, getPhysicalStats);

// Get dietary type
router.get("/dietary-type", authenticateUser, getDietaryType);

// Update dietary type
router.put("/update-dietary-type", authenticateUser, updateDietaryType);

// Get meal type
router.get("/meal-type", authenticateUser, getMealType);

router.post("/google-signup", googleSignup); // ✅ New correct route

module.exports = router;
