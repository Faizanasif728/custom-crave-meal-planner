import React, { useState, useEffect } from "react";
import api from "../api";
import { toast } from "react-toastify";
import {
  FaCheck,
  FaCoffee,
  FaUtensils,
  FaMoon,
  FaAppleAlt,
} from "react-icons/fa";

const mealOptions = [
  {
    label: "Breakfast",
    value: "Breakfast",
    icon: <FaCoffee className="text-3xl text-orange-500" />,
    description:
      "Start your day with a nutritious breakfast to fuel your body and mind. Essential for maintaining energy levels and metabolism.",
    benefits: [
      "Boosts metabolism",
      "Improves concentration",
      "Provides essential nutrients",
    ],
  },
  {
    label: "Lunch",
    value: "Lunch",
    icon: <FaUtensils className="text-3xl text-orange-500" />,
    description:
      "A balanced lunch helps maintain energy levels throughout the day and prevents afternoon slumps.",
    benefits: ["Sustains energy", "Prevents overeating", "Supports digestion"],
  },
  {
    label: "Dinner",
    value: "Dinner",
    icon: <FaMoon className="text-3xl text-orange-500" />,
    description:
      "A well-planned dinner helps with recovery and prepares your body for rest. Focus on lighter, easily digestible meals.",
    benefits: [
      "Aids recovery",
      "Promotes better sleep",
      "Supports muscle repair",
    ],
  },
  {
    label: "Snack",
    value: "Snack",
    icon: <FaAppleAlt className="text-3xl text-orange-500" />,
    description:
      "Healthy snacks between meals help maintain blood sugar levels and prevent overeating during main meals.",
    benefits: ["Controls hunger", "Maintains energy", "Provides nutrients"],
  },
];

const MealsSchedulePage = () => {
  const [selectedMealTypes, setSelectedMealTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserMealTypes = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/users/meal-type");
      setSelectedMealTypes(data.mealType);
    } catch (error) {
      console.error("Error fetching meal types:", error);
      setError(error.response?.data?.message || "Error fetching meal types");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserMealTypes();
  }, []);

  const handleMealTypeChange = async (mealType) => {
    try {
      const newSelectedMealTypes = selectedMealTypes.includes(mealType)
        ? selectedMealTypes.filter((type) => type !== mealType)
        : [...selectedMealTypes, mealType];

      setSelectedMealTypes(newSelectedMealTypes);

      const { data } = await api.put("/users/update-meal-type", {
        mealType: newSelectedMealTypes,
      });

      if (data.success) {
        toast.success("Meal schedule updated successfully!");
      } else {
        throw new Error(data.message || "Failed to update meal schedule");
      }
    } catch (error) {
      console.error("Error updating meal types:", error);
      toast.error(
        error.response?.data?.message || "Error updating meal schedule"
      );
      fetchUserMealTypes();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1
          className="text-3xl md:text-4xl font-extrabold text-orange-500 mb-2 text-center drop-shadow-sm"
          style={{
            fontFamily: `'Dancing Script', 'Pacifico', 'Great Vibes', cursive, 'Playfair Display', serif`,
          }}
        >
          Your Selected Meal Type
        </h1>
        <div className="mt-3"></div>
        <p className="text-gray-600 mb-8 text-center">
          Your selected preferred meal times to get personalized meal
          recommendations.
        </p>

        <div className="space-y-6">
          {mealOptions.map((meal) => (
            <div
              key={meal.value}
              className={`p-6 rounded-xl border transition-all duration-300 ${
                selectedMealTypes.includes(meal.value)
                  ? "border-orange-500 bg-white shadow-lg"
                  : "border-gray-200 bg-white hover:border-orange-300 hover:shadow-md"
              }`}
            >
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 mt-1">{meal.icon}</div>

                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor={meal.value}
                      className="text-xl font-semibold text-gray-800 cursor-pointer"
                    >
                      {meal.label}
                    </label>
                    <div className="flex items-center">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedMealTypes.includes(meal.value)
                            ? "border-orange-500 bg-orange-500"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedMealTypes.includes(meal.value) && (
                          <FaCheck className="text-white text-xs" />
                        )}
                      </div>
                      <input
                        type="checkbox"
                        id={meal.value}
                        name="mealType"
                        value={meal.value}
                        checked={selectedMealTypes.includes(meal.value)}
                        onChange={() => handleMealTypeChange(meal.value)}
                        className="sr-only"
                      />
                    </div>
                  </div>

                  <p className="mt-2 text-gray-600">{meal.description}</p>

                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-orange-500 mb-2">
                      Key Benefits:
                    </h4>
                    <ul className="flex flex-wrap gap-2">
                      {meal.benefits.map((benefit, index) => (
                        <li
                          key={index}
                          className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-sm"
                        >
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MealsSchedulePage;
