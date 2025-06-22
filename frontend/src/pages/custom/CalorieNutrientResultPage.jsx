import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaSyncAlt, FaInfoCircle, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api";
import { toast } from "react-hot-toast";

const AccordionSection = ({ title, children, isOpen, toggle }) => (
  <div className="mb-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
    <button
      onClick={toggle}
      className={`w-full flex justify-between items-center px-6 py-4 text-left text-orange-500 font-bold transition duration-300 rounded-lg ${
        !isOpen ? 'hover:bg-orange-50' : ''
      }`}
    >
      <div className="flex items-center gap-2">
        <FaInfoCircle className="text-orange-400" />
        <span>{title}</span>
      </div>
      {isOpen ? <FaChevronUp className="text-orange-400" /> : <FaChevronDown className="text-orange-400" />}
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="content"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="px-6 pb-6 text-sm text-gray-700 space-y-3"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const CalorieNutrientResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { customMeal: initialResult } = location.state || {};
  const [result, setResult] = useState(initialResult);
  const [loading, setLoading] = useState(false);
  const [openSection, setOpenSection] = useState(null);

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-extrabold text-orange-500">
            No Meal Found
          </h1>
          <p className="text-gray-500 max-w-md">
            Please try again with different inputs.
          </p>
        </div>
      </div>
    );
  }

  const handleRefresh = async () => {
    try {
      setLoading(true);
      const { data } = await api.post("/custom/refresh-meal-calorie-nutrient", {
        calories: location.state?.calories,
        nutrient: location.state?.nutrient
      });
      if (data) {
        // Ensure instructions are properly formatted as array
        const formattedData = {
          ...data,
          instructions: Array.isArray(data.instructions) 
            ? [...data.instructions]  // Keep as array of strings
            : [data.instructions]     // If string, make it single-item array
        };
        setResult(formattedData);
        toast.success("Meal refreshed successfully!");
      }
    } catch (error) {
      console.error("Error refreshing meal:", error);
      const errorMessage = error.response?.data?.message || "Failed to refresh meal. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-[#333]">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-extrabold text-orange-500"
              style={{
                fontFamily: "'Dancing Script', cursive",
                letterSpacing: "0.05em",
                lineHeight: "1.2",
                textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              Custom Meal Result
            </h1>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 text-orange-500 px-4 py-2 rounded-lg border border-orange-300 hover:bg-orange-50 transition duration-300"
              title="Refresh Meal"
            >
              {loading ? (
                <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-orange-500 rounded-full" />
              ) : (
                <>
                  <FaSyncAlt size={16} />
                  <span>Refresh</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden"
        >
          <div className="p-6 space-y-8">
            {/* Image and Details */}
            <div className="flex flex-col md:flex-row items-start gap-6 bg-orange-50 rounded-lg p-6">
              {/* Left: Image */}
              <div className="w-full md:w-96 flex-shrink-0">
                <div className="w-full rounded-lg overflow-hidden shadow-md">
                  <img
                    src={result.mealImageURL}
                    alt={result.recipeName}
                    className="w-full h-auto object-cover rounded-lg transform hover:scale-105 transition duration-300"
                    style={{ maxHeight: '400px', minHeight: '250px' }}
                  />
                </div>
              </div>

              {/* Right: Info */}
              <div className="flex flex-col justify-center w-full space-y-3">
                <h2 className="text-2xl font-bold text-orange-500">
                  {result.recipeName}
                </h2>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="font-semibold text-orange-500">Target Calories</p>
                    <p>{location.state?.calories || 'Not specified'} kcal</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="font-semibold text-orange-500">Prep Time</p>
                    <p>{result.preparationTime} minutes</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="font-semibold text-orange-500">Selected Nutrient</p>
                    <p>
                      {location.state?.nutrient?.type 
                        ? `${location.state.nutrient.type.charAt(0).toUpperCase() + location.state.nutrient.type.slice(1)}: ${location.state.nutrient.value}${location.state.nutrient.type === 'sodium' || location.state.nutrient.type === 'cholesterol' ? 'mg' : 'g'}`
                        : 'Not specified'
                      }
                    </p>
                  </div>
                  {/* NEW: Actual Nutrient Box */}
                  {location.state?.nutrient?.type && (
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <p className="font-semibold text-orange-500">
                        Actual {location.state.nutrient.type.charAt(0).toUpperCase() + location.state.nutrient.type.slice(1)}
                      </p>
                      <p>
                        {result.nutrients && result.nutrients[location.state.nutrient.type] !== undefined
                          ? `${result.nutrients[location.state.nutrient.type]}${['sodium', 'cholesterol'].includes(location.state.nutrient.type) ? 'mg' : 'g'}`
                          : 'Not available'}
                      </p>
                    </div>
                  )}
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="font-semibold text-orange-500">Actual Calories</p>
                    <p>{result.calories} kcal</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Accordion Sections */}
            <div className="space-y-4">
              <AccordionSection
                title="Ingredients"
                isOpen={openSection === "ingredients"}
                toggle={() => setOpenSection(openSection === "ingredients" ? null : "ingredients")}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.ingredients.map((item, index) => (
                    <div key={index} className="bg-orange-50 p-3 rounded-lg">
                      {typeof item === "object" ? (
                        <>
                          <p className="font-semibold text-orange-500">{item.englishName}</p>
                          <p className="text-gray-600">{item.urduName}</p>
                          <p className="text-sm text-gray-500">{item.quantity}</p>
                        </>
                      ) : (
                        <p className="text-gray-700">{item}</p>
                      )}
                    </div>
                  ))}
                </div>
              </AccordionSection>

              <AccordionSection
                title="Instructions"
                isOpen={openSection === "instructions"}
                toggle={() => setOpenSection(openSection === "instructions" ? null : "instructions")}
              >
                <div className="space-y-4">
                  <p className="text-gray-600 italic mb-4">Serves: {result.serves}</p>
                  {Array.isArray(result.instructions) ? (
                    result.instructions.map((step, i) => {
                      // Match "Step X: Title" format
                      const stepMatch = step.match(/^(Step\s+\d+:\s+[^:]+)(?::|$)/i);
                      
                      if (stepMatch) {
                        const stepTitle = stepMatch[1].trim();
                        const description = step.slice(stepMatch[0].length).trim();
                        
                        return (
                          <div key={i} className="text-gray-700 leading-relaxed">
                            <span className="font-bold text-black">{stepTitle}</span>
                            {description && <p className="mt-1">{description}</p>}
                          </div>
                        );
                      }
                      
                      // If no step format is found, display as is
                      return (
                        <div key={i} className="text-gray-700 leading-relaxed">
                          <p>{step}</p>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-gray-700 leading-relaxed">{result.instructions}</p>
                  )}
                </div>
              </AccordionSection>

              <AccordionSection
                title="Nutrient Breakdown"
                isOpen={openSection === "nutrients"}
                toggle={() => setOpenSection(openSection === "nutrients" ? null : "nutrients")}
              >
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {result.nutrients &&
                    Object.entries(result.nutrients).map(([key, val]) => (
                      <div key={key} className="bg-orange-50 p-3 rounded-lg">
                        <p className="font-semibold text-orange-500">
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </p>
                        <p>
                          {val}
                          {["sodium", "cholesterol"].includes(key) ? "mg" : "g"}
                        </p>
                      </div>
                    ))}
                </div>
              </AccordionSection>
            </div>

            {/* Back Button */}
            <div className="flex justify-center pt-6">
              <button
                onClick={() => navigate("/custom-category")}
                className="bg-orange-500 text-white px-8 py-3 rounded-lg font-bold text-sm shadow-sm hover:bg-orange-600 transition duration-300"
              >
                Back to Custom Options
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CalorieNutrientResultPage;
