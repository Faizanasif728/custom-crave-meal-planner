import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaLeaf, FaFireAlt, FaArrowRight } from "react-icons/fa";

const CustomTypeSelectorPage = () => {
  const navigate = useNavigate();

  const goToIngredientPage = () =>
    navigate("/custom-category/ingredient-restriction");
  const goToCaloriePage = () => navigate("/custom-category/calorie-nutrient");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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

  const cardVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.02,
      boxShadow: "0px 0px 20px rgba(249,115,22,0.2)",
      transition: {
        duration: 0.3
      }
    },
    tap: {
      scale: 0.98
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-[#333] px-6 py-12 bg-gradient-to-b from-gray-50 to-white">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center max-w-3xl w-full"
      >
        <motion.h1
          variants={itemVariants}
          className="text-4xl font-extrabold text-orange-500 mb-6"
          style={{
            fontFamily: "'Dancing Script', cursive",
            letterSpacing: "0.05em",
            lineHeight: "1.2",
            textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          Choose Your Custom Meal Type
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className="text-lg text-gray-700 mb-10"
        >
          Select how you'd like to generate your custom meal:
        </motion.p>

        <div className="grid sm:grid-cols-2 gap-8">
          <motion.button
            variants={cardVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={goToIngredientPage}
            className="w-full p-8 bg-white border-2 border-orange-200 rounded-xl hover:border-orange-400 transition-all duration-300 shadow-lg text-left group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-orange-100 rounded-full group-hover:bg-orange-200 transition-colors duration-300">
                <FaLeaf className="text-2xl text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-orange-500">By Ingredient & Restrictions</h3>
            </div>
            <p className="text-gray-700 mb-4">
              Provide a main ingredient and your dietary restrictions. We'll
              find a meal that matches!
            </p>
            <div className="flex items-center text-orange-500 font-medium">
              Get Started
              <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </motion.button>

          <motion.button
            variants={cardVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={goToCaloriePage}
            className="w-full p-8 bg-white border-2 border-orange-200 rounded-xl hover:border-orange-400 transition-all duration-300 shadow-lg text-left group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-orange-100 rounded-full group-hover:bg-orange-200 transition-colors duration-300">
                <FaFireAlt className="text-2xl text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-orange-500">By Calories & Nutrient</h3>
            </div>
            <p className="text-gray-700 mb-4">
              Enter your target calories and one nutrient. We'll search for a
              match within range.
            </p>
            <div className="flex items-center text-orange-500 font-medium">
              Get Started
              <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default CustomTypeSelectorPage;
