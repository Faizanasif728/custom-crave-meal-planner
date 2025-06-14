import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from "react-countup";
import { useProgress } from "../context/ProgressContext";
import Confetti from "react-confetti";
import { FaFire, FaChartLine, FaUtensils, FaArrowRight } from "react-icons/fa";

const CaloriesResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { dailyCalories } = location.state || {};
  const { progress, setProgress, calculateProgress } = useProgress();
  const [showConfetti, setShowConfetti] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const currentPath = "/calories-result";
    setProgress(calculateProgress(currentPath));
  }, [setProgress, calculateProgress]);

  useEffect(() => {
    if (!dailyCalories || isNaN(dailyCalories) || dailyCalories <= 0) {
      alert("Invalid calorie data. Please re-enter your details.");
      navigate("/calories-application");
    }

    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, [dailyCalories, navigate]);

  const handleNext = () => {
    navigate("/dietary-type", {
      state: { dailyCalories },
      replace: true,
    });
  };

  const features = [
    {
      icon: <FaFire className="text-3xl" />,
      title: "Daily Energy",
      description: "Your body's required energy intake for optimal function"
    },
    {
      icon: <FaChartLine className="text-3xl" />,
      title: "Metabolic Rate",
      description: "Based on your activity level and body composition"
    },
    {
      icon: <FaUtensils className="text-3xl" />,
      title: "Meal Planning",
      description: "Perfect for creating balanced meal plans"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-black relative bg-gradient-to-b from-gray-50 to-white">
      {showConfetti && (
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      )}
      
      {/* Result Card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-4xl text-center bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
      >
        <motion.h1
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-extrabold text-orange-500 mb-4"
          style={{
            fontFamily: "'Dancing Script', cursive",
            letterSpacing: "0.05em",
            lineHeight: "1.2",
            textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          Your Daily Calorie Needs
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-700 text-lg mb-6"
        >
          Based on your inputs, your estimated daily calorie needs are:
        </motion.p>

        {/* Glow Pulse Effect */}
        <div className="relative inline-block my-8">
          <motion.div
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 0, scale: 2 }}
            transition={{ duration: 1.5, ease: "easeOut", repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-orange-400 opacity-50 blur-2xl"
          />
          <motion.span
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative text-6xl font-bold text-orange-500"
          >
            <CountUp end={dailyCalories} duration={2} separator="," /> kcal
          </motion.span>
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="bg-orange-50 p-6 rounded-xl flex flex-col items-center text-center"
            >
              <div className="text-orange-500 mb-4 flex justify-center items-center w-12 h-12">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Details Toggle */}
        <motion.button
          onClick={() => setShowDetails(!showDetails)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-8 text-orange-500 font-medium flex items-center justify-center gap-2 mx-auto"
        >
          {showDetails ? "Hide Details" : "Show Details"}
          <motion.span
            animate={{ rotate: showDetails ? 90 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <FaArrowRight />
          </motion.span>
        </motion.button>

        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 text-left"
            >
              <div className="bg-gray-50 p-6 rounded-xl">
                <h4 className="font-semibold text-gray-800 mb-4">Understanding Your Calorie Needs</h4>
                <ul className="space-y-3 text-gray-600">
                  <li>• This calculation is based on your Basal Metabolic Rate (BMR) and activity level</li>
                  <li>• Your BMR is the number of calories your body needs at rest</li>
                  <li>• Activity level multiplier accounts for your daily physical activity</li>
                  <li>• This number represents your maintenance calories</li>
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Progress & Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="w-full max-w-3xl mt-12"
      >
        {/* Progress Bar */}
        <div className="bg-gray-200 h-2 rounded-full overflow-hidden mb-6">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1 }}
            className="bg-orange-500 h-full transition-all duration-500 ease-out"
          ></motion.div>
        </div>

        {/* Centered Button */}
        <div className="flex justify-center pb-6">
          <motion.button
            onClick={handleNext}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-12 rounded-full shadow-md text-lg transition-transform duration-300 focus:outline-none focus:ring-4 focus:ring-orange-300"
          >
            Continue to Next Step
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default CaloriesResultPage;
