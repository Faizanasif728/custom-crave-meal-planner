import React, { useState, useEffect, useRef } from "react";
import api from "../api";
import { marked } from "marked";
import { motion } from "framer-motion";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Menu, X, Pencil } from "lucide-react";
import useAuthStore from "../store/authStore";
import { FiLogOut } from "react-icons/fi";
import {
  FaUtensils,
  FaSave,
  FaAppleAlt,
  FaClock,
  FaChartBar,
  FaUserAlt,
  FaQuestionCircle,
  FaRobot,
  FaHistory,
  FaPlus,
} from "react-icons/fa";
import { toast } from "react-hot-toast";

const titleVariants = {
  hidden: { opacity: 0, y: -30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const TypingIndicator = () => (
  <div className="flex items-center gap-1 text-orange-500 text-sm font-medium pl-2">
    <span className="animate-bounce">●</span>
    <span className="animate-bounce delay-150">●</span>
    <span className="animate-bounce delay-300">●</span>
    <span className="ml-2">Cooking...</span>
  </div>
);

// TypingText animation component (copied from ChatbotHistoryPage)
const TypingText = ({ text }) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 30);
      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
    }
  }, [currentIndex, text]);

  return (
    <span>
      {displayText}
      {!isComplete && <span className="animate-blink">|</span>}
    </span>
  );
};

const ChatbotPage = () => {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      content:
        "Welcome! Ask me anything about Pakistani meals, diets, or nutrition.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const bottomRef = useRef(null);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  const { user, profileImage, uploadProfileImage, logout, setUser } =
    useAuthStore();
  const location = useLocation();

  // Load existing conversation if conversationId is in URL
  useEffect(() => {
    const loadExistingConversation = async () => {
      const params = new URLSearchParams(location.search);
      const conversationId = params.get('conversationId');
      
      if (conversationId) {
        try {
          setLoading(true);
          const response = await api.get(`/groq/conversation/${conversationId}`);
          if (response.data.success) {
            const conversation = response.data.conversation;
            setMessages(conversation.messages);
            setConversationId(conversation._id);
          }
        } catch (error) {
          console.error("Error loading conversation:", error);
          toast.error("Failed to load conversation");
        } finally {
          setLoading(false);
        }
      }
    };

    loadExistingConversation();
  }, [location.search]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        isSidebarOpen
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  const sidebarLinks = [
    { to: "/custom-recipes", label: "Custom Recipes", icon: <FaUtensils /> },
    { to: "/my-meal-plans", label: "Saved Plans", icon: <FaSave /> },
    { to: "/diet-nutrition", label: "Dietary Type", icon: <FaAppleAlt /> },
    { to: "/meals-schedule", label: "Meal Type", icon: <FaClock /> },
    { to: "/physical-stats", label: "Physical Stats", icon: <FaChartBar /> },
    { to: "/update-profile", label: "Account", icon: <FaUserAlt /> },
    { to: "/chatbot/history", label: "Chat History", icon: <FaHistory /> },
    { to: "/help", label: "Help", icon: <FaQuestionCircle /> },
  ];

  // "New Chat" button logic: just clear state
  const startNewChat = () => {
    setConversationId(null);
    setMessages([
      {
        role: "bot",
        content:
          "Welcome! Ask me anything about Pakistani meals, diets, or nutrition.",
      },
    ]);
    setInput("");
    // Remove conversationId from URL
    navigate('/chatbot', { replace: true });
  };

  // Send message logic: only create conversation when user sends a message
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post("/groq/chat", {
        message: input,
        conversationId, // can be null for new conversation
      });
      const botReply = res.data.reply || "❌ I couldn't respond right now.";
      setMessages((prev) => [...prev, { role: "bot", content: botReply }]);
      setConversationId(res.data.conversationId); // set new conversationId if it was null
    } catch (err) {
      console.error("Error sending message:", err);
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "⚠️ Error talking to the bot." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (
      !file ||
      !file.type.startsWith("image/") ||
      file.size > 5 * 1024 * 1024
    ) {
      toast.error(
        "Please upload a valid image file (JPEG/PNG/WEBP) under 5MB."
      );
      return;
    }

    setIsUploading(true);
    try {
      await uploadProfileImage(file);
      toast.success("Profile picture updated successfully!");
    } catch (error) {
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      toast.success("Logged out successfully! See you soon!");
      navigate("/login");
    } catch (error) {
      toast.error("Failed to log out. Please try again.");
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col h-screen bg-[#FFF3E6] text-[#333]"
    >
      {/* Animated Header */}
      <motion.div
        variants={titleVariants}
        initial="hidden"
        animate="visible"
        className="bg-gray-800 h-16 md:h-20 flex items-center shadow-md relative px-6"
      >
        {/* Back Arrow */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center text-orange-500 hover:bg-orange-100 rounded-full p-2 transition cursor-pointer z-10 group"
          aria-label="Go back"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 transform group-hover:scale-110 transition-transform duration-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Hamburger Menu */}
        {user && (
          <button
            type="button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center text-orange-500 hover:bg-orange-100 rounded-full p-2 transition cursor-pointer z-10"
            aria-label="Open menu"
          >
            <Menu className="h-8 w-8" />
          </button>
        )}
        {/* Logo and Title */}
        <div className="flex items-center justify-center gap-3 w-full">
          <img
            src="/assets/logo.png"
            alt="CraveBot Logo"
            className="h-12 w-12 object-contain rounded-full shadow"
          />
          <motion.h1
            className="text-2xl md:text-3xl font-extrabold text-orange-500 text-center drop-shadow-sm"
            style={{
              fontFamily: `'Dancing Script', 'Pacifico', 'Great Vibes', cursive, 'Playfair Display', serif`,
              letterSpacing: "1px",
            }}
          >
            CraveBot
          </motion.h1>
        </div>
      </motion.div>
      {/* Sidebar */}
      {user && (
        <div
          ref={sidebarRef}
          className={`fixed top-0 right-0 h-full w-[320px] bg-gray-100 text-white z-[60] shadow-lg transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col justify-between h-full p-6">
            {/* Close */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-black transition-colors duration-200"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Profile */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <label
                  htmlFor="profileImageUpload"
                  className="cursor-pointer group"
                >
                  <div className="relative">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Profile"
                        className={`w-14 h-14 rounded-full object-cover border-2 border-white shadow-md transition-all duration-300 ${
                          isUploading
                            ? "opacity-50 grayscale"
                            : "group-hover:opacity-80"
                        }`}
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-orange-500 flex items-center justify-center border-2 border-white shadow-md">
                        <span className="text-2xl font-bold text-white">
                          {user?.username?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    {isUploading && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    id="profileImageUpload"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    accept="image/jpeg,image/png,image/webp"
                  />
                </label>
                <div>
                  <p className="text-lg font-bold text-black">
                    {user?.username}
                  </p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>

              <hr className="border-gray-300 my-4" />

              {/* Sidebar Links */}
              <ul className="space-y-4">
                {sidebarLinks.map(({ to, label, icon }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className="flex items-center space-x-3 text-black hover:text-orange-500 transition-colors duration-200"
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <span className="text-lg">{icon}</span>
                      <span>{label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <hr className="border-gray-300 my-4" />

            {/* Logout */}
            <button
              onClick={() => {
                handleLogout();
                setIsSidebarOpen(false);
              }}
              className="flex items-center space-x-2 text-red-600 font-semibold hover:text-red-700 transition-colors duration-200"
            >
              <FiLogOut className="text-lg" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 pb-36 md:pb-40">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] px-4 py-3 rounded-xl text-sm whitespace-pre-wrap shadow-md ${
                msg.role === "user"
                  ? "bg-orange-500 text-white rounded-br-none"
                  : "bg-white text-[#333] border border-orange-200 rounded-bl-none"
              }`}
            >
              {i === 0 && msg.role === "bot" ? (
                <TypingText text={msg.content} />
              ) : (
                <span
                  dangerouslySetInnerHTML={{
                    __html:
                      msg.role === "bot" && typeof msg.content === "string"
                        ? marked.parse(msg.content)
                        : msg.content,
                  }}
                />
              )}
            </div>
          </div>
        ))}
        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Input Bar (Full Width + Refresh Animation) */}
      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-50">
        <div className="w-full flex items-center gap-2 px-4 py-3 md:py-4">
          <input
            type="text"
            className="flex-1 bg-[#FFF3E6] text-[#333] border border-gray-300 rounded-lg outline-none px-4 py-2 text-sm md:text-base focus:border-gray-800"
            placeholder="Ask about meal plans, diets, ingredients..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold text-sm md:text-base transition duration-200 flex-shrink-0 hover:bg-orange-600"
          >
            Send
          </button>

          {/* Animated Refresh New Chat */}
          <button
            onClick={() => {
              startNewChat();
              const icon = document.getElementById("refreshIcon");
              icon.classList.add("animate-spin");
              setTimeout(() => {
                icon.classList.remove("animate-spin");
              }, 1000);
            }}
            className="border-2 border-gray-800 text-gray-800 p-2 rounded-lg font-medium transition duration-200 flex items-center justify-center group relative w-10 h-10 flex-shrink-0 hover:bg-orange-50"
            aria-label="Start new chat"
          >
            <Pencil id="refreshIcon" className="w-5 h-5" />
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              New Chat
            </span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatbotPage;
