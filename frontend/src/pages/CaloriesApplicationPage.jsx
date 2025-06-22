import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { motion } from "framer-motion";
import { useProgress } from "../context/ProgressContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaWeight, FaRuler, FaBirthdayCake, FaRunning, FaBullseye, FaVenusMars } from "react-icons/fa";

const CaloriesApplicationPage = () => {
  const { progress, setProgress, calculateProgress } = useProgress();
  const [formData, setFormData] = useState({
    gender: "",
    weight: "",
    height: "",
    age: "",
    activityLevel: "",
    goal: "",
  });
  const [heightUnit, setHeightUnit] = useState("cm");
  const [displayHeight, setDisplayHeight] = useState("");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [displayWeight, setDisplayWeight] = useState("");
  const navigate = useNavigate();
  const hasInitialized = useRef(false);

  // Validation ranges
  const VALIDATION_RANGES = {
    age: { min: 15, max: 100 },
    height: {
      cm: { min: 100, max: 250 },
      ft: { min: 3.3, max: 8.2 },
      in: { min: 39, max: 98 }
    },
    weight: {
      kg: { min: 30, max: 200 }
    }
  };

  // Conversion functions for height
  const convertToCm = (value, unit) => {
    if (!value) return "";
    const numValue = parseFloat(value);
    switch (unit) {
      case "ft":
        return (numValue * 30.48).toFixed(2);
      case "in":
        return (numValue * 2.54).toFixed(2);
      default:
        return value;
    }
  };

  const detectHeightUnit = (value) => {
    if (!value) return "cm";
    const numValue = parseFloat(value);
    if (numValue >= 4 && numValue <= 7) return "ft";
    if (numValue >= 48 && numValue <= 84) return "in";
    return "cm";
  };

  const validateInput = (name, value, unit = null) => {
    if (!value) return true;
    const numValue = parseFloat(value);
    
    if (isNaN(numValue) || numValue < 0) return false;

    switch (name) {
      case "age":
        return numValue >= VALIDATION_RANGES.age.min && numValue <= VALIDATION_RANGES.age.max;
      case "height":
        const heightRange = VALIDATION_RANGES.height[unit || heightUnit];
        return numValue >= heightRange.min && numValue <= heightRange.max;
      case "weight":
        const weightRange = VALIDATION_RANGES.weight.kg;
        return numValue >= weightRange.min && numValue <= weightRange.max;
      default:
        return true;
    }
  };

  const getValidationMessage = (name, unit = null) => {
    switch (name) {
      case "age":
        return `Age must be between ${VALIDATION_RANGES.age.min} and ${VALIDATION_RANGES.age.max} years`;
      case "height":
        const heightRange = VALIDATION_RANGES.height[unit || heightUnit];
        return `Height must be between ${heightRange.min} and ${heightRange.max} ${unit || heightUnit}`;
      case "weight":
        const weightRange = VALIDATION_RANGES.weight.kg;
        return `Weight must be between ${weightRange.min} and ${weightRange.max} kg`;
      default:
        return "Invalid value";
    }
  };

  useEffect(() => {
    if (!hasInitialized.current) {
      const currentPath = "/calories-application";
      const newProgress = calculateProgress(currentPath);
      setProgress(newProgress);
      hasInitialized.current = true;
    }
  }, [setProgress, calculateProgress]);

  const handleInputChange = (name, value) => {
    if (name === "height") {
      setDisplayHeight(value);
      const detectedUnit = detectHeightUnit(value);
      setHeightUnit(detectedUnit);
      const cmValue = convertToCm(value, detectedUnit);
      setFormData({ ...formData, [name]: cmValue });
    } else if (name === "weight") {
      setDisplayWeight(value);
      setFormData({ ...formData, [name]: value });
    } else if (name === "age") {
      setFormData({ ...formData, [name]: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Add this new function to prevent wheel changes
  const preventWheelChange = (e) => {
    e.target.blur();
  };

  const handleCalculateCalories = async () => {
    // Validate all inputs before calculating
    if (!formData.gender) {
      toast.error("Please select your gender.");
      return;
    }

    if (!formData.weight || !formData.height || !formData.age) {
      toast.error("Please fill out all fields before calculating.");
      return;
    }

    // Validate age
    if (!validateInput("age", formData.age)) {
      toast.error(getValidationMessage("age"));
      return;
    }

    // Validate height
    if (!validateInput("height", displayHeight, heightUnit)) {
      toast.error(getValidationMessage("height", heightUnit));
      return;
    }

    // Validate weight
    if (!validateInput("weight", displayWeight, weightUnit)) {
      toast.error(getValidationMessage("weight", weightUnit));
      return;
    }

    if (!formData.activityLevel) {
      toast.error("Please select your activity level.");
      return;
    }

    if (!formData.goal) {
      toast.error("Please select your goal.");
      return;
    }

    try {
      const payload = { ...formData, weightGoal: formData.goal };
      delete payload.goal;

      const { data } = await api.put("/users/calories", payload);
      const { dailyCalories } = data;

      navigate("/calories-result", { state: { dailyCalories } });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to calculate calories. Please try again."
      );
    }
  };

  const options = {
    gender: ["Male", "Female"],
    activityLevel: ["sedentary", "light", "moderate", "active", "very_active"],
    goal: ["weight_loss", "weight_gain"],
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const subtitleVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        delay: 0.2
      }
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: 0.4
      }
    }
  };

  const inputFields = [
    {
      name: "weight",
      label: "Weight",
      unit: weightUnit,
      icon: <FaWeight className="text-xl" />
    },
    {
      name: "height",
      label: "Height",
      unit: heightUnit,
      icon: <FaRuler className="text-xl" />
    },
    {
      name: "age",
      label: "Age",
      unit: "years",
      icon: <FaBirthdayCake className="text-xl" />
    }
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between px-6 py-12 bg-gray-50">
      <ToastContainer />
      <div className="w-full max-w-4xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={titleVariants}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-extrabold text-orange-500 font-playfair mb-4">
            Calorie Calculator
          </h1>
          <p className="text-xl text-gray-600">
            Let's calculate your perfect calorie intake
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={subtitleVariants}
          className="text-center mb-12"
        >
          <p className="text-lg text-gray-700">
            Enter your details below to get a personalized calorie recommendation based on your goals and lifestyle.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={formVariants}
          className="bg-white rounded-xl shadow-sm p-8"
        >
          <div className="grid md:grid-cols-2 gap-8">
            {/* Gender Selection */}
            <div className="col-span-full">
              <label className="block mb-4 text-orange-500 font-semibold flex items-center gap-2">
                <FaVenusMars />
                Select Gender
              </label>
              <div className="flex gap-4">
                {options.gender.map((g) => (
                  <motion.button
                    key={g}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleInputChange("gender", g)}
                    className={`flex-1 py-4 rounded-xl text-lg font-medium border-2 transition-all ${
                      formData.gender === g
                        ? "bg-orange-100 text-orange-800 border-orange-300 shadow-md"
                        : "border-gray-200 hover:border-orange-300 hover:bg-orange-50"
                    }`}
                  >
                    {g}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Input Fields */}
            {inputFields.map((field, index) => (
              <motion.div
                key={field.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.5 }}
                className="relative"
              >
                <label className="block mb-2 text-orange-500 font-semibold flex items-center gap-2">
                  {field.icon}
                  {field.label}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name={field.name}
                    value={field.name === "height" ? displayHeight : field.name === "weight" ? displayWeight : formData[field.name]}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    onWheel={preventWheelChange}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    min="0"
                    className="w-full p-4 rounded-xl border-2 border-gray-200 bg-white text-gray-900 focus:border-orange-300 focus:ring-2 focus:ring-orange-200 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    {field.unit}
                  </span>
                </div>
              </motion.div>
            ))}

            {/* Activity Level */}
            <div className="col-span-full">
              <label className="block mb-4 text-orange-500 font-semibold flex items-center gap-2">
                <FaRunning />
                Activity Level
              </label>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {options.activityLevel.map((level) => (
                  <motion.button
                    key={level}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleInputChange("activityLevel", level)}
                    className={`py-4 rounded-xl text-sm font-medium border-2 transition-all ${
                      formData.activityLevel === level
                        ? "bg-orange-100 text-orange-800 border-orange-300 shadow-md"
                        : "border-gray-200 hover:border-orange-300 hover:bg-orange-50"
                    }`}
                  >
                    {level.replace("_", " ").toUpperCase()}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Goal */}
            <div className="col-span-full">
              <label className="block mb-4 text-orange-500 font-semibold flex items-center gap-2">
                <FaBullseye />
                Your Goal
              </label>
              <div className="flex gap-4">
                {options.goal.map((g) => (
                  <motion.button
                    key={g}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleInputChange("goal", g)}
                    className={`flex-1 py-4 rounded-xl text-lg font-medium border-2 transition-all ${
                      formData.goal === g
                        ? "bg-orange-100 text-orange-800 border-orange-300 shadow-md"
                        : "border-gray-200 hover:border-orange-300 hover:bg-orange-50"
                    }`}
                  >
                    {g.replace("_", " ").toUpperCase()}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="w-full mt-12 px-4 sm:px-0"
      >
        {/* Progress Bar */}
        <div className="w-full max-w-3xl mx-auto bg-gray-200 h-2 rounded-full overflow-hidden mb-6">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, delay: 0.7 }}
            className="bg-orange-500 h-full transition-all duration-500 ease-out"
          ></motion.div>
        </div>

        {/* Centered Button */}
        <div className="w-full flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCalculateCalories}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-12 rounded-full shadow-md transition-transform duration-300 focus:outline-none focus:ring-4 focus:ring-orange-300 text-lg"
          >
            Calculate My Calories
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default CaloriesApplicationPage;
