import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaArrowRight, FaInfoCircle } from "react-icons/fa";
import { useProgress } from "../context/ProgressContext";

const NumberOfDaysPage = () => {
  const { progress, setProgress, calculateProgress } = useProgress();
  const [noOfDays, setNoOfDays] = useState("");
  const [showInfo, setShowInfo] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { weightGoal, dietaryType, mealType, dailyCalories } =
    location.state || {};
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current) {
      const currentPath = "/number-of-days";
      const newProgress = calculateProgress(currentPath);
      setProgress(newProgress);
      hasInitialized.current = true;
    }
  }, [setProgress, calculateProgress]);

  const handleNext = async () => {
    if (noOfDays && Number(noOfDays) > 0) {
      try {
        const response = await api.post("/mealplan/generate", {
          weightGoal,
          dietaryType,
          mealType,
          noOfDays,
        });
        const mealPlan = response.data.mealPlan;

        navigate("/meal-plan-result", {
          state: { mealPlan, dailyCalories },
        });
      } catch (error) {
        console.error("Error generating meal plan:", error);
        alert(
          error.response?.data?.message ||
            "Failed to generate meal plan. Please try again."
        );
      }
    }
  };

  const presetDays = [1, 3, 5, 7];

  return (
    <div className="min-h-screen text-black px-6 pt-12 pb-32 flex flex-col items-center justify-start bg-gradient-to-b from-gray-50 to-white">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-block"
        >
          <FaCalendarAlt className="text-5xl text-orange-400 mx-auto mb-4" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-extrabold text-orange-500 mb-2"
          style={{
            fontFamily: "'Dancing Script', cursive",
            letterSpacing: "0.05em",
            lineHeight: "1.2",
            textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          How Long Do You Want to Plan?
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-700 text-lg max-w-xl mx-auto"
        >
          Choose the number of days you want us to generate your personalized
          meal plan for.
        </motion.p>
      </motion.div>

      {/* Info Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="w-full max-w-md mb-8"
      >
        <motion.button
          onClick={() => setShowInfo(!showInfo)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gray-50 p-4 rounded-xl flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <FaInfoCircle className="text-xl text-orange-500" />
            <span className="font-medium text-gray-800">
              About Meal Planning Duration
            </span>
          </div>
          <motion.span
            animate={{ rotate: showInfo ? 90 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <FaArrowRight />
          </motion.span>
        </motion.button>

        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: showInfo ? "auto" : 0, opacity: showInfo ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="bg-gray-50 p-6 rounded-xl mt-2">
            <p className="text-gray-600 text-sm">
              The duration of your meal plan helps us create a comprehensive
              schedule that fits your lifestyle. Longer plans allow for more
              variety and better meal rotation, while shorter plans are great
              for quick starts.
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Preset Days */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="w-full max-w-md mb-8"
      >
        <div className="grid grid-cols-4 gap-4">
          {presetDays.map((days, index) => (
            <motion.button
              key={days}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 1.0 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setNoOfDays(days.toString())}
              className={`p-4 rounded-xl text-center transition-all duration-300 ${
                noOfDays === days.toString()
                  ? "bg-orange-100 text-orange-800 border-2 border-orange-300 shadow-md"
                  : "bg-white border-2 border-gray-200 hover:border-orange-300 hover:bg-orange-50"
              }`}
            >
              <span className="text-2xl font-bold">{days}</span>
              <p className="text-xs text-gray-500">days</p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Input Field */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="w-full max-w-md text-center"
      >
        <label className="block mb-4 text-xl font-semibold text-orange-500">
          Or Enter Custom Number of Days
        </label>
        <div className="relative">
          <input
            type="number"
            value={noOfDays}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || (Number(value) >= 1 && Number(value) <= 7)) {
                setNoOfDays(value);
              }
            }}
            placeholder="e.g. 7"
            min="1"
            max="7"
            className="w-full text-center px-4 py-3 rounded-xl bg-white text-black text-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-300 transition-all duration-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            days
          </span>
        </div>
      </motion.div>

      {/* Progress + Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
        className="w-full max-w-md mt-12"
      >
        <div className="bg-gray-200 h-2 rounded-full overflow-hidden mb-6">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, delay: 1.5 }}
            className="bg-orange-500 h-full transition-all duration-500 ease-out"
          ></motion.div>
        </div>

        <div className="flex justify-center">
          <motion.button
            onClick={handleNext}
            disabled={!noOfDays || Number(noOfDays) <= 0}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-12 py-4 text-lg font-bold rounded-full shadow-md transition-all duration-300 focus:outline-none flex items-center gap-2 ${
              noOfDays && Number(noOfDays) > 0
                ? "bg-orange-500 hover:bg-orange-600 text-white"
                : "bg-gray-400 text-white cursor-not-allowed"
            }`}
          >
            Generate Meal Plan
            <FaArrowRight />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default NumberOfDaysPage;
