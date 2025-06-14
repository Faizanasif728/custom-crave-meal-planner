const axios = require("axios");
const GroqHistory = require("../models/groqHistory");

// 🔒 Original trained system prompt
const systemPrompt = {
  role: "system",
  content: `You are an AI assistant specializing in Pakistani cuisine, meal planning, ingredient insights, and nutrition. 
You provide detailed and friendly guidance on healthy recipes, ingredient benefits, diet plans, and weight goals. 
You help users understand food in the context of their well-being. 
You do not answer questions unrelated to food, health, diet, or nutrition. Politely guide users back to food-related topics if they go off-topic. 
Avoid asking follow-up questions. Just respond clearly and wait for the next query.`,
};

// Ask Groq Bot (handles both new and ongoing conversations)
const askGroqBot = async (req, res) => {
  try {
    const { message, conversationId } = req.body;
    const userId = req.user._id;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Find the conversation
    let conversation = null;
    if (conversationId) {
      conversation = await GroqHistory.findOne({
        _id: conversationId,
        userId,
      });
    }

    // If no conversation, create a new one
    if (!conversation) {
      conversation = new GroqHistory({
        userId,
        title: message.substring(0, 50) + "...", // Use first 50 chars of first message as title
        messages: [],
      });
    }

    // Add user message
    conversation.messages.push({
      role: "user",
      content: message,
      timestamp: new Date(),
    });

    // Prepare messages for Groq API
    const messagesForGroq = [
      systemPrompt,
      ...conversation.messages.map((msg) => ({
        role: msg.role === "bot" ? "assistant" : msg.role,
        content: msg.content,
      })),
    ];

    // Get bot response from Groq
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: messagesForGroq,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const botResponse =
      response.data.choices[0]?.message?.content ||
      "❌ I couldn't respond right now.";

    // Add bot response
    conversation.messages.push({
      role: "bot",
      content: botResponse,
      timestamp: new Date(),
    });

    await conversation.save();

    res.status(200).json({
      success: true,
      reply: botResponse,
      conversationId: conversation._id,
    });
  } catch (error) {
    console.error("Error in askGroqBot:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get response from bot",
    });
  }
};

// Get chat history
const getChatHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const conversations = await GroqHistory.find({ userId })
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("title messages createdAt updatedAt");

    const total = await GroqHistory.countDocuments({ userId });

    res.status(200).json({
      success: true,
      conversations,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error in getChatHistory:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch chat history",
    });
  }
};

// Optionally, you can remove createNewChat if not needed anymore
const createNewChat = async (req, res) => {
  // No DB object is created here. Just respond OK.
  res.status(200).json({ success: true });
};

// Delete chat history
const deleteChatHistory = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;

    const conversation = await GroqHistory.findOneAndDelete({
      _id: conversationId,
      userId,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Conversation deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteChatHistory:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete conversation",
    });
  }
};

// Get specific conversation by ID
const getConversationById = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;

    const conversation = await GroqHistory.findOne({
      _id: conversationId,
      userId,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    res.status(200).json({
      success: true,
      conversation,
    });
  } catch (error) {
    console.error("Error in getConversationById:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch conversation",
    });
  }
};

module.exports = {
  askGroqBot,
  getChatHistory,
  createNewChat,
  deleteChatHistory,
  getConversationById,
};
