import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaChevronUp, FaSyncAlt, FaUtensils, FaInfoCircle } from "react-icons/fa";
import axios from "../api";

const AccordionSection = ({ title, children, isOpen, toggle }) => (
  <div className="mb-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
    <button
      onClick={toggle}
      className="w-full flex justify-between items-center px-6 py-4 text-left text-orange-500 font-bold transition duration-300 hover:bg-orange-50 rounded-lg"
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

const MealPlanResultPage = () => {
  const location = useLocation();
  const { mealPlan, dailyCalories } = location.state || {};
  const [openSection, setOpenSection] = useState(null);
  const [currentMealPlan, setCurrentMealPlan] = useState(mealPlan);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current && mealPlan) {
      setCurrentMealPlan(mealPlan);
      hasInitialized.current = true;
    }
  }, [mealPlan]);

  const handleRegenerateMealPlan = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("/mealplan/regenerate");
      console.log("Regenerated Meal Plan Response:", response.data);

      if (response.data?.success && response.data?.mealPlan) {
        setOpenSection(null);
        setCurrentMealPlan(response.data.mealPlan);
      } else {
        throw new Error(response.data?.message || "Invalid response from server");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to regenerate meal plan");
    } finally {
      setLoading(false);
    }
  };

  if (!currentMealPlan || !currentMealPlan.mealPlans) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-700 px-6">
        <div className="text-center space-y-4">
          <FaUtensils className="text-6xl text-orange-400 mx-auto" />
          <h1 className="text-3xl font-extrabold text-orange-500">No Meal Plan Found</h1>
          <p className="mt-4 text-gray-500 max-w-md">
            Please generate a meal plan first to view your personalized nutrition recommendations.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-[#333]">
      {/* Sticky Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-10 bg-white shadow-sm"
      >
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl font-extrabold text-orange-500 text-left"
              style={{
                fontFamily: "'Dancing Script', cursive",
                letterSpacing: "0.05em",
                lineHeight: "1.2",
                textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              Your Meal Plan
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center gap-4"
            >
              <p className="text-lg font-semibold text-gray-700">
                Daily Target:{" "}
                <span className="text-orange-500 font-bold">{dailyCalories} kcal</span>
              </p>
              <button
                onClick={handleRegenerateMealPlan}
                className="flex items-center gap-2 text-orange-500 px-4 py-2 rounded-lg border border-orange-300 hover:bg-orange-50 transition duration-300"
                disabled={loading}
              >
                {loading ? (
                  <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-orange-500 rounded-full"></div>
                ) : (
                  <>
                    <FaSyncAlt size={16} />
                    <span>Regenerate</span>
                  </>
                )}
              </button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-12">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg"
          >
            {error}
          </motion.div>
        )}

        {/* Daily Plans */}
        {currentMealPlan.mealPlans.map((day, index) => (
          <motion.div
            key={day.day}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="p-6 space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                className="flex items-center gap-3"
              >
                <h2 className="text-2xl font-bold text-orange-500">
                  Day {day.day}
                </h2>
              </motion.div>

              {/* Recipes */}
              {day.recipes.map((recipe, recipeIndex) => {
                const recipeIdentifier = `day-${day.day}-recipe-${recipe.recipeId}-index-${recipeIndex}`;
                return (
                  <motion.div
                    key={recipeIdentifier}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.0 + index * 0.1 + recipeIndex * 0.1 }}
                    className="space-y-6"
                  >
                    {/* Image and Details */}
                    <div className="flex flex-col md:flex-row items-start gap-6 bg-orange-50 rounded-lg p-6">
                      {/* Left: Image */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 1.2 + index * 0.1 + recipeIndex * 0.1 }}
                        className="w-full md:w-96 flex-shrink-0"
                      >
                        <div className="w-full rounded-lg overflow-hidden shadow-md">
                          <img
                            src={recipe.mealImageURL}
                            alt={recipe.recipeName}
                            className="w-full h-auto object-cover rounded-lg transform hover:scale-105 transition duration-300"
                            style={{ maxHeight: '400px', minHeight: '250px' }}
                          />
                        </div>
                      </motion.div>

                      {/* Right: Info */}
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 1.4 + index * 0.1 + recipeIndex * 0.1 }}
                        className="flex flex-col justify-center w-full space-y-3"
                      >
                        <h3 className="text-2xl font-bold text-orange-500">
                          {recipe.recipeName}
                        </h3>
                        <p className="text-orange-400 font-medium">
                          {recipe.recipeNameUrdu}
                        </p>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 1.6 + index * 0.1 + recipeIndex * 0.1 }}
                            className="bg-white p-3 rounded-lg shadow-sm"
                          >
                            <p className="font-semibold text-orange-500">Meal Type</p>
                            <p className="capitalize">{recipe.mealType}</p>
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 1.7 + index * 0.1 + recipeIndex * 0.1 }}
                            className="bg-white p-3 rounded-lg shadow-sm"
                          >
                            <p className="font-semibold text-orange-500">Calories</p>
                            <p>{recipe.calories} kcal</p>
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 1.8 + index * 0.1 + recipeIndex * 0.1 }}
                            className="bg-white p-3 rounded-lg shadow-sm"
                          >
                            <p className="font-semibold text-orange-500">Servings</p>
                            <p>{recipe.servings}</p>
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 1.9 + index * 0.1 + recipeIndex * 0.1 }}
                            className="bg-white p-3 rounded-lg shadow-sm"
                          >
                            <p className="font-semibold text-orange-500">Diet Type</p>
                            <p>{recipe.dietaryType}</p>
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 2.0 + index * 0.1 + recipeIndex * 0.1 }}
                            className="bg-white p-3 rounded-lg shadow-sm"
                          >
                            <p className="font-semibold text-orange-500">Prep Time</p>
                            <p>{recipe.preparationTime} minutes</p>
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 2.1 + index * 0.1 + recipeIndex * 0.1 }}
                            className="bg-white p-3 rounded-lg shadow-sm"
                          >
                            <p className="font-semibold text-orange-500">Weight Goal</p>
                            <p>{recipe.weightGoal}</p>
                          </motion.div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Accordion Sections */}
                    <div className="space-y-4">
                      <AccordionSection
                        title="Nutrients Breakdown"
                        isOpen={openSection === `nutrients-${recipeIdentifier}`}
                        toggle={() =>
                          setOpenSection(
                            openSection === `nutrients-${recipeIdentifier}`
                              ? null
                              : `nutrients-${recipeIdentifier}`
                          )
                        }
                      >
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div className="bg-orange-50 p-3 rounded-lg">
                            <p className="font-semibold text-orange-500">Protein</p>
                            <p>{recipe.nutrients?.protein || 0}g</p>
                          </div>
                          <div className="bg-orange-50 p-3 rounded-lg">
                            <p className="font-semibold text-orange-500">Carbs</p>
                            <p>{recipe.nutrients?.carbs || 0}g</p>
                          </div>
                          <div className="bg-orange-50 p-3 rounded-lg">
                            <p className="font-semibold text-orange-500">Fats</p>
                            <p>{recipe.nutrients?.fats || 0}g</p>
                          </div>
                          <div className="bg-orange-50 p-3 rounded-lg">
                            <p className="font-semibold text-orange-500">Fiber</p>
                            <p>{recipe.nutrients?.fiber || 0}g</p>
                          </div>
                          <div className="bg-orange-50 p-3 rounded-lg">
                            <p className="font-semibold text-orange-500">Sodium</p>
                            <p>{recipe.nutrients?.sodium || 0}mg</p>
                          </div>
                          <div className="bg-orange-50 p-3 rounded-lg">
                            <p className="font-semibold text-orange-500">Cholesterol</p>
                            <p>{recipe.nutrients?.cholesterol || 0}mg</p>
                          </div>
                        </div>
                      </AccordionSection>

                      <AccordionSection
                        title="Ingredients"
                        isOpen={openSection === `ingredients-${recipeIdentifier}`}
                        toggle={() =>
                          setOpenSection(
                            openSection === `ingredients-${recipeIdentifier}`
                              ? null
                              : `ingredients-${recipeIdentifier}`
                          )
                        }
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {recipe.ingredients?.length ? (
                            recipe.ingredients.map((ing, i) => (
                              <div key={i} className="bg-orange-50 p-3 rounded-lg">
                                <p className="font-semibold text-orange-500">{ing.englishName}</p>
                                <p className="text-gray-600">{ing.urduName}</p>
                                <p className="text-sm text-gray-500">{ing.quantity}</p>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500">No ingredients available</p>
                          )}
                        </div>
                      </AccordionSection>

                      <AccordionSection
                        title="Step-by-Step Instructions"
                        isOpen={openSection === `instructions-${recipeIdentifier}`}
                        toggle={() => {
                          const newSection = openSection === `instructions-${recipeIdentifier}` ? null : `instructions-${recipeIdentifier}`;
                          setOpenSection(newSection);
                        }}
                      >
                        <div className="space-y-4">
                          <p className="text-gray-600 italic mb-4">Serves: {recipe.serves}</p>
                          {recipe.instructions?.length ? (
                            recipe.instructions.map((step, i) => {
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
                            <p className="text-gray-500">No instructions available</p>
                          )}
                        </div>
                      </AccordionSection>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MealPlanResultPage;
