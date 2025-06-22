import React, { useState, useEffect } from "react";
import api from "../api";
import { toast } from "react-toastify";
import {
  FaCheck,
  FaBacon,
  FaFish,
  FaLeaf,
  FaSeedling,
  FaDrumstickBite,
  FaPepperHot,
} from "react-icons/fa";

const dietaryOptions = [
  {
    label: "Keto",
    value: "Keto",
    icon: <FaBacon className="text-3xl text-orange-500" />,
    description:
      "A high-fat, low-carb diet that helps your body burn fat for energy. Focuses on healthy fats, proteins, and minimal carbohydrates.",
    benefits: [
      "Weight loss",
      "Improved blood sugar control",
      "Increased energy",
    ],
  },
  {
    label: "Mediterranean",
    value: "Mediterranean",
    icon: <FaFish className="text-3xl text-orange-500" />,
    description:
      "Inspired by traditional eating habits of countries bordering the Mediterranean Sea. Emphasizes fruits, vegetables, whole grains, and healthy fats.",
    benefits: ["Heart health", "Longevity", "Reduced risk of chronic diseases"],
  },
  {
    label: "Vegan",
    value: "Vegan",
    icon: <FaLeaf className="text-3xl text-orange-500" />,
    description:
      "Excludes all animal products including meat, dairy, and eggs. Focuses on plant-based foods rich in nutrients.",
    benefits: [
      "Lower cholesterol",
      "Reduced environmental impact",
      "Rich in antioxidants",
    ],
  },
  {
    label: "Vegetarian",
    value: "Vegetarian",
    icon: <FaSeedling className="text-3xl text-orange-500" />,
    description:
      "Excludes meat but may include dairy and eggs. Emphasizes plant-based foods while allowing for some animal products.",
    benefits: ["Heart health", "Weight management", "Lower blood pressure"],
  },
  {
    label: "Non-Vegetarian",
    value: "Non-Vegetarian",
    icon: <FaDrumstickBite className="text-3xl text-orange-500" />,
    description:
      "Includes all food groups including meat, poultry, fish, dairy, and plant-based foods. Focuses on balanced nutrition from various sources.",
    benefits: [
      "Complete protein sources",
      "Rich in essential nutrients",
      "Flexible eating pattern",
    ],
  },
  {
    label: "Desi",
    value: "Desi",
    icon: <FaPepperHot className="text-3xl text-orange-500" />,
    description:
      "Traditional South Asian diet focusing on local ingredients, spices, and cooking methods. Balances grains, vegetables, and proteins.",
    benefits: [
      "Cultural authenticity",
      "Rich in spices and flavors",
      "Balanced nutrition",
    ],
  },
];

const DietNutritionPage = () => {
  const [selectedDietaryType, setSelectedDietaryType] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserDietaryType = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/users/dietary-type");
      setSelectedDietaryType(data.dietaryType);
    } catch (error) {
      console.error("Error fetching dietary type:", error);
      setError(error.response?.data?.message || "Error fetching dietary type");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDietaryType();
  }, []);

  const handleDietaryTypeChange = async (newDietaryType) => {
    try {
      setSelectedDietaryType(newDietaryType);
      const { data } = await api.put("/users/update-dietary-type", {
        dietaryType: newDietaryType,
      });
      if (data.success) {
        toast.success("Dietary type updated successfully!");
      } else {
        throw new Error(data.message || "Failed to update dietary type");
      }
    } catch (error) {
      console.error("Error updating dietary type:", error);
      toast.error(
        error.response?.data?.message || "Error updating dietary type"
      );
      fetchUserDietaryType();
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
          Your selected Dietary Type
        </h1>
        <div className="mt-3"></div>
        <p className="text-gray-600 mb-8 text-center">
          Your selected preferred dietary type to get personalized meal
          recommendations.
        </p>

        <div className="space-y-6">
          {dietaryOptions.map((diet) => (
            <div
              key={diet.value}
              className={`p-6 rounded-xl border transition-all duration-300 ${
                selectedDietaryType === diet.value
                  ? "border-orange-500 bg-white shadow-lg"
                  : "border-gray-200 bg-white hover:border-orange-300 hover:shadow-md"
              }`}
            >
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 mt-1">{diet.icon}</div>

                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor={diet.value}
                      className="text-xl font-semibold text-gray-800 cursor-pointer"
                    >
                      {diet.label}
                    </label>
                    <div className="flex items-center">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedDietaryType === diet.value
                            ? "border-orange-500 bg-orange-500"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedDietaryType === diet.value && (
                          <FaCheck className="text-white text-xs" />
                        )}
                      </div>
                      <input
                        type="radio"
                        id={diet.value}
                        name="dietaryType"
                        value={diet.value}
                        checked={selectedDietaryType === diet.value}
                        onChange={() => handleDietaryTypeChange(diet.value)}
                        className="sr-only"
                      />
                    </div>
                  </div>

                  <p className="mt-2 text-gray-600">{diet.description}</p>

                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-orange-500 mb-2">
                      Key Benefits:
                    </h4>
                    <ul className="flex flex-wrap gap-2">
                      {diet.benefits.map((benefit, index) => (
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

export default DietNutritionPage;
