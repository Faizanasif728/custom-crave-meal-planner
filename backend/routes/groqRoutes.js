const express = require("express");
const router = express.Router();
const {
  askGroqBot,
  getChatHistory,
  createNewChat,
  deleteChatHistory,
  getConversationById,
} = require("../controllers/groqController");
const { authenticateUser } = require("../middleware/authMiddleware");

// Create new chat
router.post("/new-chat", authenticateUser, createNewChat);

// Chat with Groq
router.post("/chat", authenticateUser, askGroqBot);

// Get chat history
router.get("/history", authenticateUser, getChatHistory);

// Get specific conversation
router.get("/conversation/:conversationId", authenticateUser, getConversationById);

// Delete chat history
router.delete("/history/:conversationId", authenticateUser, deleteChatHistory);

module.exports = router;
