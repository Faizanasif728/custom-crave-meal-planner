import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProgress } from "../context/ProgressContext";
import { motion } from "framer-motion";
import { FaUtensils, FaUserAlt, FaHeart, FaChartLine, FaLeaf, FaClock } from "react-icons/fa";

const SetupAccountPage = () => {
  const { progress, setProgress, calculateProgress } = useProgress();
  const navigate = useNavigate();

  useEffect(() => {
    const currentPath = "/setup-account";
    const newProgress = calculateProgress(currentPath);
    setProgress(newProgress);
  }, []); // Empty dependency array since we only want this to run once on mount

  const handleNext = () => {
    navigate("/your-diet");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
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
        delay: 0.5
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
        ease: "easeOut"
      }
    }
  };

  const steps = [
    {
      step: "1",
      icon: <FaLeaf className="text-2xl" />,
      label: "Your Diet & Preferences",
      desc: "Tell us about your dietary preferences, restrictions, and any allergies. We'll customize your meal plans to match your lifestyle and cultural preferences.",
      benefits: ["Personalized meal recommendations", "Cultural food preferences", "Allergy-safe options"]
    },
    {
      step: "2",
      icon: <FaUserAlt className="text-2xl" />,
      label: "Your Health Profile",
      desc: "Share your health goals, current weight, height, and activity level. Our AI will calculate your optimal calorie intake and nutritional needs.",
      benefits: ["Customized calorie goals", "Personalized nutrition plans", "Activity-based recommendations"]
    },
    {
      step: "3",
      icon: <FaUtensils className="text-2xl" />,
      label: "Your Meal Schedule",
      desc: "Choose your preferred meal times and portion sizes. We'll create a schedule that fits your daily routine and helps you maintain consistent eating habits.",
      benefits: ["Flexible meal timing", "Portion control guidance", "Routine-based planning"]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between px-4 py-10 bg-gray-50">
      {/* Content Area */}
      <div className="w-full max-w-4xl mx-auto p-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
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
            Welcome to Custom Crave
          </h1>
          <p className="text-xl text-gray-600">
            Your Personalized Journey to Better Health Starts Here
          </p>
        </motion.div>
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={subtitleVariants}
          className="text-center mb-12"
        >
          <p className="text-lg text-gray-700 mb-6">
            Let's create your perfect meal plan! We'll guide you through a simple setup process to understand your preferences and goals.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={featureVariants}
              whileHover={{ y: -5 }}
              className="bg-white p-4 rounded-lg shadow-sm"
            >
              <FaHeart className="text-3xl text-orange-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800">Personalized Plans</h3>
              <p className="text-sm text-gray-600">Tailored to your unique needs and preferences</p>
            </motion.div>
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={featureVariants}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -5 }}
              className="bg-white p-4 rounded-lg shadow-sm"
            >
              <FaChartLine className="text-3xl text-orange-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800">Smart Tracking</h3>
              <p className="text-sm text-gray-600">Monitor your progress and stay on track</p>
            </motion.div>
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={featureVariants}
              transition={{ delay: 0.4 }}
              whileHover={{ y: -5 }}
              className="bg-white p-4 rounded-lg shadow-sm"
            >
              <FaClock className="text-3xl text-orange-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800">Time-Saving</h3>
              <p className="text-sm text-gray-600">Quick, easy, and efficient meal planning</p>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="space-y-8"
        >
          {steps.map((item, index) => (
            <motion.div
              key={item.step}
              variants={itemVariants}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: index * 0.2
                  }}
                  className="w-12 h-12 flex items-center justify-center bg-orange-100 text-orange-500 rounded-full"
                >
                  {item.icon}
                </motion.div>
                <div className="flex-grow">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{
                      delay: 0.2 + index * 0.2,
                      duration: 0.5
                    }}
                  >
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{item.label}</h3>
                    <p className="text-gray-600 mb-4">{item.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {item.benefits.map((benefit, i) => (
                        <motion.span
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, amount: 0.3 }}
                          transition={{ delay: 0.3 + i * 0.1 }}
                          className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-sm"
                        >
                          {benefit}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Bottom Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
        className="w-full mt-12 px-4 sm:px-0"
      >
        {/* Progress Bar */}
        <div className="w-full max-w-3xl mx-auto bg-gray-200 h-2 rounded-full overflow-hidden mb-6">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${progress}%` }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1 }}
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
            Let's Get Started
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default SetupAccountPage;
