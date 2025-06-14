import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useProgress } from "../context/ProgressContext";
import { motion } from "framer-motion";
import { FaLeaf, FaAllergies, FaUtensils, FaHeart } from "react-icons/fa";

const YourDietPage = () => {
  const { progress, setProgress, calculateProgress } = useProgress();
  const navigate = useNavigate();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current) {
      const currentPath = "/your-diet";
      const newProgress = calculateProgress(currentPath);
      setProgress(newProgress);
      hasInitialized.current = true;
    }
  }, [setProgress, calculateProgress]);

  const handleNext = () => {
    navigate("/calories-application");
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

  const featureVariants = {
    hidden: { opacity: 0, y: 50 },
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

  const dietFeatures = [
    {
      icon: <FaLeaf className="text-3xl" />,
      title: "Dietary Preferences",
      description: "Tell us about your preferred eating style and any specific dietary requirements."
    },
    {
      icon: <FaAllergies className="text-3xl" />,
      title: "Allergies & Restrictions",
      description: "List any food allergies or restrictions to ensure your safety."
    },
    {
      icon: <FaUtensils className="text-3xl" />,
      title: "Food Preferences",
      description: "Share your favorite cuisines and foods you'd like to include or avoid."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between px-4 py-10 bg-gray-50">
      {/* Content Area */}
      <div className="w-full max-w-4xl mx-auto p-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={titleVariants}
          className="text-center mb-8"
        >
          <h1 
            className="text-4xl font-extrabold text-orange-500 mb-4"
            style={{
              fontFamily: "'Dancing Script', cursive",
              letterSpacing: "0.05em",
              lineHeight: "1.2",
              textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            Your Diet Preferences
          </h1>
          <p className="text-xl text-gray-600">
            Let's customize your meal plan to match your lifestyle
          </p>
        </motion.div>
        
        <motion.div
          initial="hidden"
          animate="visible"
          variants={subtitleVariants}
          className="text-center mb-12"
        >
          <p className="text-lg text-gray-700 mb-6">
            We'll ask about your dietary needs, allergies, and preferences to help
            us create the perfect plan for you.
          </p>
          <p className="text-gray-600">
            Based on your responses, your meal plans will exclude ingredients that
            don't align with your goals.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={featureVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {dietFeatures.map((feature, index) => (
            <motion.div
              key={index}
              variants={featureVariants}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-orange-500 mb-4">{feature.icon}</div>
              <h3 className="font-semibold text-gray-800 text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={subtitleVariants}
          className="text-center"
        >
          <div className="inline-flex items-center text-orange-500 mb-4">
            <FaHeart className="mr-2" />
            <span className="font-semibold">Your preferences matter to us</span>
          </div>
          <p className="text-gray-600">
            We'll use this information to create personalized meal plans that perfectly match your needs and preferences.
          </p>
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
            onClick={handleNext}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-10 rounded-full shadow-md transition-transform duration-300 focus:outline-none focus:ring-4 focus:ring-orange-300"
          >
            Continue
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default YourDietPage;
