import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MdFreeBreakfast,
  MdLunchDining,
  MdDinnerDining,
  MdFastfood,
  MdInfoOutline,
} from "react-icons/md";
import { FaArrowRight } from "react-icons/fa";
import { useProgress } from "../context/ProgressContext";

const mealOptions = [
  {
    label: "Breakfast",
    icon: <MdFreeBreakfast className="text-3xl" />,
    description: "Start your day with a nutritious meal",
    time: "6:00 AM - 10:00 AM"
  },
  {
    label: "Lunch",
    icon: <MdLunchDining className="text-3xl" />,
    description: "Midday meal to keep you energized",
    time: "11:00 AM - 2:00 PM"
  },
  {
    label: "Dinner",
    icon: <MdDinnerDining className="text-3xl" />,
    description: "Evening meal to end your day right",
    time: "6:00 PM - 9:00 PM"
  },
  {
    label: "Snack",
    icon: <MdFastfood className="text-3xl" />,
    description: "Quick bites between meals",
    time: "Anytime"
  },
];

const MealTypePage = () => {
  const [mealType, setMealType] = useState([]);
  const [showInfo, setShowInfo] = useState(false);
  const { progress, setProgress, calculateProgress } = useProgress();
  const navigate = useNavigate();
  const location = useLocation();
  const { weightGoal, dietaryType, dailyCalories } = location.state || {};
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current) {
      const currentPath = "/meal-type";
      const newProgress = calculateProgress(currentPath);
      setProgress(newProgress);
      hasInitialized.current = true;
    }
  }, [setProgress, calculateProgress]);

  const toggleMealType = (type) => {
    setMealType((prev) =>
      prev.includes(type)
        ? prev.filter((item) => item !== type)
        : [...prev, type]
    );
  };

  const handleNext = () => {
    if (mealType.length > 0) {
      navigate("/number-of-days", {
        state: { weightGoal, dietaryType, mealType, dailyCalories },
      });
    }
  };

  return (
    <div className="min-h-screen text-black px-6 pt-10 pb-40 flex flex-col items-center bg-gradient-to-b from-gray-50 to-white">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <motion.h1
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-extrabold text-orange-500 mb-4"
          style={{
            fontFamily: "'Dancing Script', cursive",
            letterSpacing: "0.05em",
            lineHeight: "1.2",
            textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          Select Your Meal Type
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center text-gray-700 max-w-xl mx-auto"
        >
          Choose which meals you usually consume. This helps us personalize your meal plan!
        </motion.p>
      </motion.div>

      {/* Info Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="w-full max-w-2xl mb-8"
      >
        <motion.button
          onClick={() => setShowInfo(!showInfo)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gray-50 p-4 rounded-xl flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <MdInfoOutline className="text-xl text-orange-500" />
            <span className="font-medium text-gray-800">About Meal Selection</span>
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
              Selecting your preferred meals helps us create a personalized meal plan that fits your daily routine. 
              We'll ensure your meals are well-balanced and aligned with your dietary preferences and goals.
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Meal Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="grid sm:grid-cols-2 gap-6 w-full max-w-2xl"
      >
        {mealOptions.map((meal, index) => {
          const selected = mealType.includes(meal.label);
          return (
            <motion.div
              key={meal.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
              onClick={() => toggleMealType(meal.label)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`cursor-pointer border-2 transition-all duration-300 p-6 rounded-xl shadow-lg flex flex-col ${
                selected
                  ? "bg-orange-100 border-orange-300 text-orange-800 shadow-xl"
                  : "bg-white border-gray-200 hover:border-orange-300 hover:bg-orange-50"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-orange-500">{meal.icon}</div>
                  <span className="text-lg font-semibold text-gray-800">
                    {meal.label}
                  </span>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 transition-colors duration-300 ${
                    selected
                      ? "bg-orange-500 border-orange-500"
                      : "border-gray-300"
                  }`}
                />
              </div>
              <p className="text-sm text-gray-600 mb-2">{meal.description}</p>
              <p className="text-xs text-gray-500">Recommended time: {meal.time}</p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Progress & Next */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="w-full px-4 sm:px-0 mt-12"
      >
        {/* Progress Bar */}
        <div className="w-full max-w-2xl mx-auto bg-gray-200 h-2 rounded-full overflow-hidden mb-6">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, delay: 1.3 }}
            className="bg-orange-500 h-full transition-all duration-500 ease-out"
          ></motion.div>
        </div>

        {/* Centered Button */}
        <div className="w-full flex justify-center">
          <motion.button
            onClick={handleNext}
            whileHover={{
              scale: mealType.length > 0 ? 1.05 : 1,
              boxShadow: mealType.length > 0 ? "0px 0px 20px rgba(249,115,22,0.4)" : "none",
            }}
            whileTap={{ scale: 0.95 }}
            disabled={mealType.length === 0}
            className={`px-12 py-4 rounded-full text-lg font-bold shadow-xl transition-all duration-300 flex items-center gap-2 ${
              mealType.length > 0
                ? "bg-orange-500 text-white hover:bg-orange-600"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Continue to Next Step
            <FaArrowRight />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default MealTypePage;
