import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaCheck, FaArrowRight } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const restrictionOptions = [
  "Gluten-Free",
  "Nut-Free",
  "Egg-Free",
  "Lactose-Free",
  "Low-Sodium",
  "Low-Carb",
  "Low-Sugar",
  "Low-Cholesterol",
  "Dairy-Free",
  "Low-Fat",
];

const IngredientRestrictionPage = () => {
  const [ingredient, setIngredient] = useState("");
  const [selectedRestrictions, setSelectedRestrictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const navigate = useNavigate();

  const toggleRestriction = (value) => {
    setSelectedRestrictions((prev) =>
      prev.includes(value) ? prev.filter((r) => r !== value) : [...prev, value]
    );
  };

  const handleSubmit = async () => {
    if (!ingredient.trim()) {
      toast.error("Please enter an ingredient");
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.post("/custom/ingredient-restriction", {
        ingredient,
        restrictions: selectedRestrictions,
        save: true,
      });
      navigate("/custom-category/ingredient-restriction-result", {
        state: { 
          customMeal: data,
          ingredient: ingredient,
          selectedRestrictions: selectedRestrictions
        },
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while generating the custom meal. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.8,
        duration: 0.6
      }
    },
    hover: {
      scale: 1.05,
      boxShadow: "0px 0px 20px rgba(249,115,22,0.4)",
      transition: {
        duration: 0.3
      }
    },
    tap: {
      scale: 0.95
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 text-[#333] bg-gradient-to-b from-gray-50 to-white">
      <ToastContainer />
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-2xl"
      >
        <motion.h1
          variants={itemVariants}
          className="text-4xl font-extrabold text-orange-500 text-center mb-6"
          style={{
            fontFamily: "'Dancing Script', cursive",
            letterSpacing: "0.05em",
            lineHeight: "1.2",
            textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          Custom Meal by Ingredient
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-lg text-gray-700 text-center mb-10"
        >
          Enter your main ingredient and select any dietary restrictions to generate a personalized meal.
        </motion.p>

        {/* Info Section */}
        <motion.div
          variants={itemVariants}
          className="w-full mb-8"
        >
          <motion.button
            onClick={() => setShowInfo(!showInfo)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-white p-4 rounded-xl flex items-center justify-between border-2 border-orange-200"
          >
            <div className="flex items-center gap-3">
              <FaSearch className="text-xl text-orange-500" />
              <span className="font-medium text-gray-800">How It Works</span>
            </div>
            <motion.span
              animate={{ rotate: showInfo ? 90 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <FaArrowRight />
            </motion.span>
          </motion.button>

          <AnimatePresence>
            {showInfo && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="bg-white p-6 rounded-xl mt-2 border-2 border-orange-200">
                  <p className="text-gray-600 text-sm">
                    Enter your main ingredient (like chicken, tofu, or spinach) and select any dietary restrictions that apply. 
                    We'll generate a delicious meal that matches your preferences and dietary needs.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="space-y-8">
          <motion.div variants={itemVariants}>
            <label className="block mb-2 text-lg font-semibold text-orange-400">
              Enter Ingredient
            </label>
            <div className="relative">
              <input
                type="text"
                value={ingredient}
                onChange={(e) => setIngredient(e.target.value)}
                placeholder="e.g. chicken, tofu, spinach"
                className="w-full p-4 rounded-xl border-2 border-orange-200 bg-white text-[#333] focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-500 transition-all duration-300"
              />
              <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-400" />
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block mb-4 text-lg font-semibold text-orange-400">
              Select Dietary Restrictions
            </label>
            <div className="grid sm:grid-cols-2 gap-4">
              {restrictionOptions.map((option, index) => (
                <motion.button
                  key={option}
                  variants={itemVariants}
                  custom={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleRestriction(option)}
                  className={`py-3 px-4 rounded-xl border-2 text-sm transition-all duration-300 flex items-center gap-2 ${
                    selectedRestrictions.includes(option)
                      ? "bg-orange-100 text-orange-800 border-orange-300 shadow-md"
                      : "bg-white text-[#333] border-orange-200 hover:border-orange-300 hover:bg-orange-50"
                  }`}
                >
                  <AnimatePresence>
                    {selectedRestrictions.includes(option) && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <FaCheck className="text-orange-500" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {option}
                </motion.button>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={buttonVariants}
            className="flex justify-center"
          >
            <motion.button
              onClick={handleSubmit}
              disabled={loading || !ingredient}
              whileHover="hover"
              whileTap="tap"
              className={`inline-flex items-center gap-2 px-8 py-4 rounded-full text-lg font-bold shadow-md transition-all duration-300 ${
                loading || !ingredient
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600 text-white"
              }`}
            >
              {loading ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <FaSearch />
                  </motion.span>
                  Searching...
                </>
              ) : (
                <>
                  Generate My Custom Meal
                  <FaArrowRight />
                </>
              )}
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default IngredientRestrictionPage;
