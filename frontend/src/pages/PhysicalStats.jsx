import React, { useEffect, useState } from "react";
import axios from "../api";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  FiEdit2,
  FiUser,
  FiActivity,
  FiTarget,
  FiAlertCircle,
} from "react-icons/fi";

const PhysicalStats = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [profileImage, setProfileImage] = useState(
    "https://via.placeholder.com/150"
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [statsResponse, profileResponse] = await Promise.all([
          axios.get("/users/physical-stats"),
          axios.get("/users/get-profile"),
        ]);

        if (!statsResponse.data.success) {
          setError("Failed to fetch user profile");
          toast.error("Failed to load profile data. Please try again.");
          return;
        }

        setUserProfile(statsResponse.data.userProfile);

        if (profileResponse.data.user?.profileImage) {
          setProfileImage(profileResponse.data.user.profileImage);
        }

        // Scroll to top after data is loaded
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (error) {
        console.error("Error fetching user data:", error);
        const errorMessage =
          error.response?.data?.message || "Error fetching user data";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center space-y-4"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <FiAlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <p className="text-red-500 text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <FiUser className="w-12 h-12 text-orange-500 mx-auto" />
          <p className="text-gray-600 text-lg">No profile data available</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200"
          >
            Refresh
          </button>
        </motion.div>
      </div>
    );
  }

  const formatValue = (value, unit = "") => {
    return value === null || value === "not_specified"
      ? "Not set"
      : `${value}${unit}`;
  };

  const formatActivityLevel = (level) => {
    if (!level || level === "not_specified") return "Not set";
    return level.charAt(0).toUpperCase() + level.slice(1).replace("_", " ");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen p-6 text-[#333]"
    >
      <div className="max-w-4xl mx-auto">
        <motion.h1
          variants={itemVariants}
          className="text-3xl md:text-4xl font-extrabold text-orange-500 text-center drop-shadow-sm"
          style={{
            fontFamily: `'Dancing Script', 'Pacifico', 'Great Vibes', cursive, 'Playfair Display', serif`,
          }}
        >
          Physical Profile
        </motion.h1>

        {/* Profile Image Section */}
        <motion.div
          variants={itemVariants}
          className="mb-8 flex items-center space-x-6"
        >
          <motion.img
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            src={profileImage}
            alt="Profile"
            className="w-32 h-32 rounded-full border-1 border-orange-400 object-cover shadow-lg"
          />
          <div>
            <h2 className="text-2xl font-semibold text-orange-500">
              Personal Information
            </h2>
            <p className="text-gray-600">
              Manage your physical profile and health goals
            </p>
          </div>
        </motion.div>

        {/* Main Stats Grid */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Basic Information */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="border border-orange-200 p-6 rounded-lg shadow-sm bg-white/50 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center space-x-2 mb-4">
              <FiUser className="text-xl text-orange-500" />
              <h3 className="text-xl font-semibold text-orange-500">
                Basic Information
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Gender:</span>
                <span className="font-medium">
                  {formatValue(userProfile.gender)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Age:</span>
                <span className="font-medium">
                  {formatValue(userProfile.age, " years")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Height:</span>
                <span className="font-medium">
                  {formatValue(userProfile.height, " cm")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Weight:</span>
                <span className="font-medium">
                  {formatValue(userProfile.weight, " kg")}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Health Goals */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="border border-orange-200 p-6 rounded-lg shadow-sm bg-white/50 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center space-x-2 mb-4">
              <FiTarget className="text-xl text-orange-500" />
              <h3 className="text-xl font-semibold text-orange-500">
                Health Goals
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Activity Level:</span>
                <span className="font-medium">
                  {formatActivityLevel(userProfile.activityLevel)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Weight Goal:</span>
                <span className="font-medium">
                  {formatValue(userProfile.weightGoal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Daily Calories:</span>
                <span className="font-medium">
                  {formatValue(userProfile.dailyCalories, " kcal")}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Edit Button */}
        <motion.div variants={itemVariants} className="mt-8 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors duration-200 flex items-center space-x-2"
            onClick={() => {
              toast.info("Edit functionality coming soon!");
            }}
          >
            <FiEdit2 />
            <span>Edit Profile</span>
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PhysicalStats;
