const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "bot"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const conversationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    default: "New Conversation",
  },
  messages: [messageSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
conversationSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Create a compound index for efficient querying
conversationSchema.index({ userId: 1, createdAt: -1 });

const GroqHistory = mongoose.model("GroqHistory", conversationSchema);

module.exports = GroqHistory; 