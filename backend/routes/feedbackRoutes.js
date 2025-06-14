const express = require("express");
const router = express.Router();
const {
  submitFeedback,
  getFeedbacks,
} = require("../controllers/feedbackController");
const { authenticateUser } = require("../middleware/authMiddleware");
// Submit feedback
router.post("/submit", authenticateUser, submitFeedback);

// Get all feedbacks (for admin)
router.get("/all", getFeedbacks);

module.exports = router;
