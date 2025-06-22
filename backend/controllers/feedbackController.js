const Feedback = require("../models/feedback");
const UserProfile = require("../models/UserProfile");
const User = require("../models/users"); // Ensure this is the correct path to your User model
// Submit feedback

exports.submitFeedback = async (req, res) => {
  try {
    const { username, email, message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Feedback message is required" });
    }

    // Get user profile to include profile image
    const user = await User.findById(req.user._id);
    const userProfile = await UserProfile.findOne({ userId: req.user._id });

    if (!user || !userProfile) {
      return res.status(404).json({ message: "User or profile not found" });
    }

    const feedback = new Feedback({
      username: user.username,
      email: user.email,
      message,
      profileImage: userProfile.profileImage,
    });

    await feedback.save();
    res.status(201).json({ message: "Feedback submitted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error submitting feedback" });
  }
};

// Get all feedbacks with username, email, message, and profile image
exports.getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 }); // latest first
    res.status(200).json({
      success: true,
      count: feedbacks.length,
      feedbacks: feedbacks.map((fb) => ({
        username: fb.username,
        email: fb.email,
        message: fb.message,
        profileImage: fb.profileImage,
        submittedAt: fb.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching feedbacks" });
  }
};
