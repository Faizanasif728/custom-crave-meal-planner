import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { motion, AnimatePresence } from "framer-motion";
import { FaFire, FaArrowRight, FaInfoCircle, FaSearch } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const allowedNutrients = [
  { name: "protein", unit: "g", icon: "🥩" },
  { name: "carbs", unit: "g", icon: "🍞" },
  { name: "fats", unit: "g", icon: "🥑" },
  { name: "fiber", unit: "g", icon: "🥬" },
  { name: "sodium", unit: "mg", icon: "🧂" },
  { name: "cholesterol", unit: "mg", icon: "🥚" },
];

const CalorieNutrientPage = () => {
  const [calories, setCalories] = useState("");
  const [nutrientType, setNutrientType] = useState("");
  const [nutrientValue, setNutrientValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const navigate = useNavigate();

  const preventWheelChange = (e) => {
    e.target.blur();
  };

  const handleCaloriesChange = (value) => {
    setCalories(value);
  };

  const handleNutrientValueChange = (value) => {
    setNutrientValue(value);
  };

  const validateInputs = () => {
    if (!calories) {
      toast.error("Please enter target calories");
      return false;
    }

    const numCalories = Number(calories);
    if (numCalories < 100 || numCalories > 2000) {
      toast.error("Calories must be between 100 and 2000 kcal");
      return false;
    }

    if (!nutrientType) {
      toast.error("Please select a nutrient type");
      return false;
    }

    if (!nutrientValue) {
      toast.error("Please enter nutrient value");
      return false;
    }

    const numNutrientValue = Number(nutrientValue);
    const maxValues = {
      protein: 100,
      carbs: 200,
      fats: 100,
      fiber: 50,
      sodium: 2000,
      cholesterol: 500
    };

    if (numNutrientValue < 0 || numNutrientValue > maxValues[nutrientType]) {
      toast.error(`${nutrientType.charAt(0).toUpperCase() + nutrientType.slice(1)} must be between 0 and ${maxValues[nutrientType]} ${allowedNutrients.find(n => n.name === nutrientType)?.unit}`);
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateInputs()) {
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.post("/custom/calorie-nutrient", {
        calories,
        nutrient: { type: nutrientType, value: nutrientValue },
        save: true,
      });
      navigate("/custom-category/calorie-nutrient-result", {
        state: { 
          customMeal: data,
          calories: calories,
          nutrient: { type: nutrientType, value: nutrientValue }
        },
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Unable to find a meal match. Please try again.";
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
        <motion.div
          variants={itemVariants}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-4"
          >
            <FaFire className="text-5xl text-orange-500" />
          </motion.div>
          <motion.h1
            variants={itemVariants}
            className="text-4xl font-extrabold text-orange-500 mb-4"
            style={{
              fontFamily: "'Dancing Script', cursive",
              letterSpacing: "0.05em",
              lineHeight: "1.2",
              textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            Calorie & Nutrient Meal Generator
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-lg text-gray-700"
          >
            Enter your target <span className="text-orange-500 font-medium">calories</span> and
            select one <span className="text-orange-500 font-medium">nutrient</span> to generate your perfect meal.
          </motion.p>
        </motion.div>

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
              <FaInfoCircle className="text-xl text-orange-500" />
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
                    Enter your target calorie count and select one nutrient (like protein, carbs, or fiber) 
                    along with its desired amount. We'll generate a meal that matches your nutritional requirements.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="space-y-8">
          {/* Calories Input */}
          <motion.div variants={itemVariants}>
            <label className="block mb-2 text-lg font-semibold text-orange-400">
              Target Calories
            </label>
            <div className="relative">
              <input
                type="number"
                value={calories}
                onChange={(e) => handleCaloriesChange(e.target.value)}
                onWheel={preventWheelChange}
                placeholder="e.g. 500"
                min="100"
                max="2000"
                className="w-full p-4 rounded-xl border-2 border-orange-200 bg-white text-[#333] focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-500 transition-all duration-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none">
                kcal
              </span>
            </div>
          </motion.div>

          {/* Nutrient Type Selection */}
          <motion.div variants={itemVariants}>
            <label className="block mb-4 text-lg font-semibold text-orange-400">
              Select One Nutrient
            </label>
            <div className="grid sm:grid-cols-3 gap-4">
              {allowedNutrients.map((nutrient, index) => (
                <motion.button
                  key={nutrient.name}
                  variants={itemVariants}
                  custom={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setNutrientType(nutrientType === nutrient.name ? "" : nutrient.name)}
                  className={`p-4 rounded-xl border-2 text-center transition-all duration-300 flex flex-col items-center gap-2 ${
                    nutrientType === nutrient.name
                      ? "bg-orange-100 text-orange-800 border-orange-300 shadow-md"
                      : "bg-white text-[#333] border-orange-200 hover:border-orange-300 hover:bg-orange-50"
                  }`}
                >
                  <span className="text-2xl">{nutrient.icon}</span>
                  <span className="font-medium capitalize">{nutrient.name}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Nutrient Value Input */}
          {nutrientType && (
            <motion.div
              variants={itemVariants}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <label className="block mb-2 text-lg font-semibold text-orange-400">
                {nutrientType.charAt(0).toUpperCase() + nutrientType.slice(1)} Amount
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={nutrientValue}
                  onChange={(e) => handleNutrientValueChange(e.target.value)}
                  onWheel={preventWheelChange}
                  placeholder={`e.g. 25`}
                  min="0"
                  className="w-full p-4 rounded-xl border-2 border-orange-200 bg-white text-[#333] focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-500 transition-all duration-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none">
                  {allowedNutrients.find(n => n.name === nutrientType)?.unit}
                </span>
              </div>
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.div
            variants={buttonVariants}
            className="flex justify-center"
          >
            <motion.button
              onClick={handleSubmit}
              disabled={loading || !calories || !nutrientType || !nutrientValue}
              whileHover="hover"
              whileTap="tap"
              className={`inline-flex items-center gap-2 px-8 py-4 rounded-full text-lg font-bold shadow-md transition-all duration-300 ${
                loading || !calories || !nutrientType || !nutrientValue
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
                    <FaInfoCircle />
                  </motion.span>
                  Searching...
                </>
              ) : (
                <>
                  Generate Meal
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

export default CalorieNutrientPage;
