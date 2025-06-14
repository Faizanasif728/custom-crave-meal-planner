import React, { useState, useEffect } from "react";
import axios from "../api";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { marked } from "marked";
import { toast } from "react-toastify";
import { FaArrowLeft, FaRobot, FaUser, FaChevronDown, FaChevronUp, FaTrash, FaComment, FaArrowRight } from "react-icons/fa";
import Modal from "../components/Modal";

const TypingText = ({ text }) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 100);

      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
    }
  }, [currentIndex, text]);

  return (
    <span className="inline-block font-playfair text-orange-500">
      {displayText}
      {!isComplete && <span className="animate-blink">|</span>}
    </span>
  );
};

const styles = `
  @keyframes slideRight {
    0% {
      transform: translateX(0);
      opacity: 1;
    }
    100% {
      transform: translateX(20px);
      opacity: 0;
    }
  }

  .animate-slide-right {
    animation: slideRight 0.5s ease-out forwards;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

const ChatbotHistoryPage = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedConversation, setExpandedConversation] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const navigate = useNavigate();

  const fetchHistory = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(`/groq/history?page=${page}`);
      if (response.data.success) {
        setConversations(response.data.conversations || []);
        setCurrentPage(response.data.currentPage);
        setTotalPages(response.data.totalPages);
      } else {
        toast.error("Failed to load chat history");
      }
    } catch (error) {
      toast.error("Failed to load chat history");
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(currentPage);
  }, [currentPage]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getConversationTitle = (conversation) => {
    const firstUserMessage = conversation.messages.find(msg => msg.role === "user");
    if (!firstUserMessage) return "New Conversation";

    const content = firstUserMessage.content.toLowerCase();
    
    // Extract key words and generate a meaningful title
    const words = content.split(/\s+/);
    
    // Remove common words and punctuation
    const commonWords = ['what', 'how', 'can', 'you', 'help', 'me', 'with', 'the', 'this', 'that', 'these', 'those', 'please', 'tell', 'about', 'give', 'some', 'any', 'need', 'want', 'looking', 'for', 'find', 'get', 'have', 'has', 'had', 'is', 'are', 'was', 'were', 'will', 'would', 'could', 'should', 'might', 'may', 'must', 'shall'];
    
    // Create meaningful phrases based on common patterns
    if (content.includes("recipe")) {
      const recipeType = words.find(word => 
        !commonWords.includes(word) && 
        word.length > 3 && 
        !word.includes("recipe")
      );
      if (recipeType) {
        return `${recipeType.charAt(0).toUpperCase() + recipeType.slice(1)} Recipe`;
      }
    }
    
    if (content.includes("how to cook") || content.includes("how to make")) {
      const dishName = words.slice(words.indexOf("cook") + 1 || words.indexOf("make") + 1)
        .filter(word => !commonWords.includes(word))
        .slice(0, 3)
        .join(" ");
      if (dishName) {
        return `How to Make ${dishName.charAt(0).toUpperCase() + dishName.slice(1)}`;
      }
    }
    
    if (content.includes("healthy") || content.includes("diet")) {
      const mealType = words.find(word => 
        ["breakfast", "lunch", "dinner", "snack", "meal"].includes(word)
      );
      if (mealType) {
        return `Healthy ${mealType.charAt(0).toUpperCase() + mealType.slice(1)} Ideas`;
      }
      return "Healthy Eating Tips";
    }
    
    if (content.includes("restaurant") || content.includes("dining")) {
      const cuisine = words.find(word => 
        ["italian", "chinese", "indian", "mexican", "japanese", "thai", "american"].includes(word)
      );
      if (cuisine) {
        return `${cuisine.charAt(0).toUpperCase() + cuisine.slice(1)} Restaurant Guide`;
      }
      return "Restaurant Recommendations";
    }
    
    // For other cases, create a more natural title
    const meaningfulWords = words
      .filter(word => !commonWords.includes(word) && word.length > 3)
      .slice(0, 4);
      
    if (meaningfulWords.length === 0) return "New Conversation";
    
    // Capitalize first letter of each word and join
    const title = meaningfulWords
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
      
    return title;
  };

  const handleDelete = async (conversationId, e) => {
    e.stopPropagation(); // Prevent expanding/collapsing when clicking delete
    setSelectedConversationId(conversationId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      setDeletingId(selectedConversationId);
      const response = await axios.delete(`/groq/history/${selectedConversationId}`);
      if (response.data.success) {
        toast.success(response.data.message || "Conversation deleted successfully");
        // Remove the deleted conversation from the state
        setConversations(prev => prev.filter(conv => conv._id !== selectedConversationId));
        // If we deleted the expanded conversation, collapse it
        if (expandedConversation === selectedConversationId) {
          setExpandedConversation(null);
        }
      } else {
        toast.error(response.data.message || "Failed to delete conversation");
      }
    } catch (error) {
      console.error("Error deleting conversation:", error);
      toast.error(error.response?.data?.message || "Failed to delete conversation");
    } finally {
      setDeletingId(null);
      setShowDeleteModal(false);
    }
  };

  const handleContinueChat = (conversationId) => {
    // Add animation class to the text
    const continueText = document.getElementById(`continue-${conversationId}`);
    if (continueText) {
      continueText.classList.add('animate-slide-right');
      // Navigate after a short delay to show the animation
      setTimeout(() => {
        navigate(`/chatbot?conversationId=${conversationId}`);
      }, 500);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-crave-background p-4 md:p-8"
    >
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-orange-500 hover:text-orange-600 mb-4 transition-colors duration-200"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>
        <h1 className="text-4xl font-bold mb-3">
          <TypingText text="Chat History" />
        </h1>
        <p className="text-gray-600 text-lg">
          Your conversations with CraveBot
        </p>
      </div>

      {/* Conversations List */}
      <div className="max-w-4xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-600 text-lg">No chat history found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {conversations.map((conversation) => (
              <div key={conversation._id} className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg">
                <button
                  onClick={() => setExpandedConversation(
                    expandedConversation === conversation._id ? null : conversation._id
                  )}
                  className="w-full p-5 flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center">
                    <FaRobot className="text-orange-500 mr-4 text-xl" />
                    <div>
                      <p className="font-semibold text-gray-800 text-lg">
                        {getConversationTitle(conversation)}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDate(conversation.createdAt)} • {conversation.messages.length} messages
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={(e) => handleDelete(conversation._id, e)}
                      className={`p-2 rounded-full hover:bg-red-50 transition-colors duration-200 ${
                        deletingId === conversation._id ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      disabled={deletingId === conversation._id}
                    >
                      <FaTrash className="text-red-500" />
                    </button>
                    <span className="text-gray-400 transition-transform duration-200">
                      {expandedConversation === conversation._id ? <FaChevronUp /> : <FaChevronDown />}
                    </span>
                  </div>
                </button>

                {expandedConversation === conversation._id && (
                  <div className="p-5 bg-gray-50 space-y-4 border-t border-gray-100 relative">
                    {conversation.messages.map((message, index) => (
                      <div
                        key={message._id || index}
                        className={`flex ${
                          message.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[85%] px-5 py-4 rounded-2xl text-sm whitespace-pre-wrap shadow-sm ${
                            message.role === "user"
                              ? "bg-orange-500 text-white rounded-br-none"
                              : "bg-white text-[#333] border border-orange-100 rounded-bl-none"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-1">
                              {message.role === "user" ? (
                                <FaUser className="text-white" />
                              ) : (
                                <FaRobot className="text-orange-500" />
                              )}
                            </div>
                            <div
                              className="prose prose-sm max-w-none"
                              dangerouslySetInnerHTML={{
                                __html: marked(message.content),
                              }}
                            />
                          </div>
                          <div className="text-xs mt-3 opacity-75">
                            {formatDate(message.timestamp)}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Replace button with text link */}
                    <div className="flex justify-end mt-4">
                      <button
                        onClick={() => handleContinueChat(conversation._id)}
                        id={`continue-${conversation._id}`}
                        className="text-orange-500 hover:text-orange-600 font-medium flex items-center gap-2 transition-all duration-300"
                      >
                        Continue Chat
                        <FaArrowRight className="text-sm" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 space-x-3">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-5 py-2.5 rounded-lg bg-orange-500 text-white disabled:opacity-50 hover:bg-orange-600 transition-colors duration-200 font-medium"
            >
              Previous
            </button>
            <span className="px-5 py-2.5 text-gray-700 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-5 py-2.5 rounded-lg bg-orange-500 text-white disabled:opacity-50 hover:bg-orange-600 transition-colors duration-200 font-medium"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <Modal
          title="Delete Conversation"
          message="Are you sure you want to delete this conversation? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteModal(false)}
          confirmText="Delete"
          cancelText="Cancel"
        />
      )}
    </motion.div>
  );
};

export default ChatbotHistoryPage; 