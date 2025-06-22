import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MdEco,
  MdOutlineRestaurantMenu,
  MdOutlineSetMeal,
  MdOutlineEggAlt,
  MdOutlineLocalPizza,
  MdOutlineEmojiNature,
  MdInfoOutline,
} from "react-icons/md";
import { FaArrowRight } from "react-icons/fa";
import { useProgress } from "../context/ProgressContext";
import api from "../api";

const dietaryOptions = [
  {
    label: "Keto",
    icon: <MdOutlineLocalPizza className="text-3xl" />,
    value: "Keto",
    excludes: "Legumes, Starchy Vegetables, High-carb Grains",
    description:
      "High-fat, low-carb diet focusing on healthy fats and proteins",
  },
  {
    label: "Vegan",
    icon: <MdEco className="text-3xl" />,
    value: "Vegan",
    excludes: "Red Meat, Poultry, Fish, Shellfish, Dairy, Eggs, Mayo, Honey",
    description: "Plant-based diet excluding all animal products",
  },
  {
    label: "Vegetarian",
    icon: <MdOutlineEmojiNature className="text-3xl" />,
    value: "Vegetarian",
    excludes: "Red Meat, Poultry, Fish, Shellfish",
    description: "Plant-based diet including dairy and eggs",
  },
  {
    label: "Non-Vegetarian",
    icon: <MdOutlineRestaurantMenu className="text-3xl" />,
    value: "Non-Vegetarian",
    excludes: "None",
    description: "Includes all food groups including meat and animal products",
  },
  {
    label: "Mediterranean",
    icon: <MdOutlineSetMeal className="text-3xl" />,
    value: "Mediterranean",
    excludes: "Red Meat, Fruit Juice, Starchy Vegetables",
    description: "Focus on whole foods, healthy fats, and lean proteins",
  },
  {
    label: "Desi",
    icon: <MdOutlineEggAlt className="text-3xl" />,
    value: "Desi",
    excludes: "Heavy Processed Oils, Sugary Sweets",
    description: "Traditional South Asian cuisine with modern health focus",
  },
];

const DietaryTypePage = () => {
  const { progress, setProgress, calculateProgress } = useProgress();
  const [selectedDiet, setSelectedDiet] = useState("");
  const [showInfo, setShowInfo] = useState(false);
  const [weightGoal, setWeightGoal] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { dailyCalories } = location.state || {};
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current) {
      const currentPath = "/dietary-type";
      const newProgress = calculateProgress(currentPath);
      setProgress(newProgress);
      hasInitialized.current = true;
    }
  }, [setProgress, calculateProgress]);

  useEffect(() => {
    // Fetch weight goal from user profile
    const fetchWeightGoal = async () => {
      try {
        const { data } = await api.get("/auth/get-profile");
        setWeightGoal(data.profile?.weightGoal || "Not Set");
      } catch (error) {
        console.error("Error fetching weight goal:", error);
        setWeightGoal("Not Set");
      }
    };
    fetchWeightGoal();
  }, []);

  const handleNext = () => {
    if (selectedDiet) {
      api
        .put("/users/update-dietary-type", { dietaryType: selectedDiet })
        .catch((error) => console.error("Error saving dietary type:", error));

      navigate("/meal-type", {
        state: { weightGoal, dietaryType: selectedDiet, dailyCalories },
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col text-black bg-gradient-to-b from-gray-50 to-white">
      <div className="flex-grow px-6 pt-12 pb-16 flex flex-col justify-between">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center mb-10"
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
            What do you like to eat?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-700"
          >
            Choose your dietary preference. You'll be able to further customize
            meals later.
          </motion.p>
        </motion.div>

        {/* Dietary Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
        >
          {dietaryOptions.map((diet, index) => (
            <motion.button
              key={diet.value}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.5 }}
              onClick={() => setSelectedDiet(diet.value)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex flex-col items-start p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                selectedDiet === diet.value
                  ? "bg-orange-100 border-orange-300 text-orange-800 shadow-md"
                  : "bg-white border-gray-200 hover:border-orange-300 hover:bg-orange-50"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="text-orange-500">{diet.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {diet.label}
                </h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">{diet.description}</p>
              <div className="mt-auto">
                <p className="text-xs text-gray-500">
                  <span className="font-medium text-orange-500">Excludes:</span>{" "}
                  {diet.excludes}
                </p>
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-4xl mx-auto mt-8"
        >
          <motion.button
            onClick={() => setShowInfo(!showInfo)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gray-50 p-4 rounded-xl flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <MdInfoOutline className="text-xl text-orange-500" />
              <span className="font-medium text-gray-800">
                About Dietary Types
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
            animate={{
              height: showInfo ? "auto" : 0,
              opacity: showInfo ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-gray-50 p-6 rounded-xl mt-2">
              <p className="text-gray-600 text-sm">
                Your dietary type helps us create meal plans that align with
                your preferences and restrictions. We'll ensure all recipes and
                meal suggestions match your chosen diet while maintaining
                nutritional balance.
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="w-full max-w-4xl mx-auto mt-12"
        >
          <div className="bg-gray-200 h-2 rounded-full overflow-hidden mb-6">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.9 }}
              className="bg-orange-500 h-full transition-all duration-500 ease-out"
            ></motion.div>
          </div>

          {/* Next Button */}
          <div className="flex justify-center">
            <motion.button
              onClick={handleNext}
              disabled={!selectedDiet}
              whileHover={{ scale: selectedDiet ? 1.05 : 1 }}
              whileTap={{ scale: selectedDiet ? 0.95 : 1 }}
              className={`bg-orange-500 text-white font-bold py-4 px-12 rounded-full shadow-md transition-all duration-300 flex items-center gap-2 ${
                !selectedDiet
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-orange-600"
              }`}
            >
              Continue to Next Step
              <FaArrowRight />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DietaryTypePage;
