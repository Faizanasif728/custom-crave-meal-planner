import React, { useEffect, useState } from "react";
import axios from "../api";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaChevronUp, FaTrash, FaInfoCircle, FaClock } from "react-icons/fa";
import Modal from "../components/Modal";
import { toast } from "react-toastify";

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

const CustomRecipesPage = () => {
  const [customMeals, setCustomMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMealId, setSelectedMealId] = useState(null);
  const [selectedMealType, setSelectedMealType] = useState(null);
  const [openSection, setOpenSection] = useState(null);
  const [deletingMealId, setDeletingMealId] = useState(null);

  useEffect(() => {
    const fetchCustomMeals = async () => {
      try {
        const { data } = await axios.get("/users/get-custom-meals", {
          withCredentials: true,
        });
        // Sort meals by creation date (newest first)
        const sortedMeals = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setCustomMeals(sortedMeals);
      } catch (error) {
        console.error("Failed to fetch custom meals:", error);
        toast.error("Failed to fetch custom meals. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomMeals();
  }, []);

  const handleDeleteMeal = async () => {
    try {
      setDeletingMealId(selectedMealId);
      const endpoint = selectedMealType === 'ingredient' 
        ? `/custom/ingredient-restriction/${selectedMealId}`
        : `/custom/calorie-nutrient/${selectedMealId}`;
      
      await axios.delete(endpoint, {
        withCredentials: true,
      });
      
      setCustomMeals((prev) => prev.filter((meal) => meal._id !== selectedMealId));
      toast.success("Custom meal deleted successfully!");
    } catch (error) {
      console.error("Error deleting meal:", error);
      toast.error(error.response?.data?.message || "Failed to delete custom meal");
    } finally {
      setDeletingMealId(null);
      setShowDeleteModal(false);
    }
  };

  const openDeleteModal = (mealId, mealType) => {
    setSelectedMealId(mealId);
    setSelectedMealType(mealType);
    setShowDeleteModal(true);
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex justify-center items-center"
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          <p className="text-lg text-orange-500">Loading your custom meals...</p>
        </div>
      </motion.div>
    );
  }

  if (customMeals.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen flex justify-center items-center text-center px-6 text-[#333]"
      >
        <div className="max-w-md space-y-4">
          <h1 className="text-3xl font-bold text-orange-500">
            You haven't generated any custom meals yet!
          </h1>
          <p className="text-gray-600">
            Start by creating your first custom meal plan to see it here.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 text-[#333]"
    >
      {/* Sticky Header */}
      <motion.div 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-10 bg-white shadow-sm"
      >
        <div className="max-w-6xl mx-auto px-6 py-4">
          <h1 className="text-3xl font-extrabold text-orange-500"
            style={{
              fontFamily: "'Dancing Script', cursive",
              letterSpacing: "0.05em",
              lineHeight: "1.2",
              textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            Your Custom Recipes
          </h1>
          <p className="text-gray-600 mt-1"
            style={{
              fontFamily: "'Dancing Script', cursive",
              letterSpacing: "0.05em",
              lineHeight: "1.2",
              textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
            }}
          >
            Latest recipes appear first
          </p>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-12">
        <AnimatePresence>
          {customMeals.map((meal, index) => (
            <motion.div
              key={meal._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
            >
              <div className="p-6 space-y-8">
                {/* Card Header with Title, Timestamp and Delete Button */}
                <div className="relative">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                    <h2 className="text-2xl font-bold text-orange-500">
                      Custom Meal
                    </h2>
                    <div className="flex items-center text-xs md:text-sm text-gray-500 whitespace-nowrap">
                      <FaClock className="mr-1 flex-shrink-0" />
                      <span>
                        Created{" "}
                        {meal.createdAt
                          ? new Date(meal.createdAt).toLocaleString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "Recently"}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => openDeleteModal(meal._id, meal.caloriesInput ? 'calorie' : 'ingredient')}
                    disabled={deletingMealId === meal._id}
                    className="absolute top-0 right-0 flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors"
                  >
                    <FaTrash />
                    <span>Delete</span>
                  </button>
                </div>

                {/* Image and Details */}
                <div className="flex flex-col md:flex-row items-start gap-6 bg-orange-50 rounded-lg p-6">
                  {/* Left: Image */}
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="w-full md:w-96 flex-shrink-0"
                  >
                    <div className="w-full rounded-lg overflow-hidden shadow-md">
                      <img
                        src={meal.mealImageURL}
                        alt={meal.recipeName}
                        className="w-full h-auto object-cover rounded-lg transform hover:scale-105 transition duration-300"
                        style={{ maxHeight: '400px', minHeight: '250px' }}
                      />
                    </div>
                  </motion.div>

                  {/* Right: Info */}
                  <div className="flex flex-col justify-center w-full space-y-3">
                    <h2 className="text-2xl font-bold text-orange-500">
                      {meal.recipeName}
                    </h2>
                    
                    {/* User Inputs Grid */}
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                      {/* For Ingredient Restriction Meals */}
                      {meal.ingredient && (
                        <>
                          <div className="bg-white p-3 rounded-lg shadow-sm">
                            <p className="font-semibold text-orange-500">Your Ingredient</p>
                            <p>{meal.ingredient || 'Not specified'}</p>
                          </div>
                          <div className="bg-white p-3 rounded-lg shadow-sm">
                            <p className="font-semibold text-orange-500">Your Restrictions</p>
                            <p>{meal.restrictions?.join(', ') || 'None selected'}</p>
                          </div>
                        </>
                      )}

                      {/* For Calorie Nutrient Meals */}
                      {meal.caloriesInput && (
                        <>
                          <div className="bg-white p-3 rounded-lg shadow-sm">
                            <p className="font-semibold text-orange-500">Target Calories</p>
                            <p>{meal.caloriesInput || 'Not specified'} kcal</p>
                          </div>
                          <div className="bg-white p-3 rounded-lg shadow-sm">
                            <p className="font-semibold text-orange-500">Selected Nutrient</p>
                            <p>
                              {meal.nutrientType 
                                ? `${meal.nutrientType.charAt(0).toUpperCase() + meal.nutrientType.slice(1)}: ${meal.nutrientValue}${meal.nutrientType === 'sodium' || meal.nutrientType === 'cholesterol' ? 'mg' : 'g'}`
                                : 'Not specified'
                              }
                            </p>
                          </div>
                        </>
                      )}

                      {/* Common Fields */}
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <p className="font-semibold text-orange-500">Actual Calories</p>
                        <p>{meal.calories} kcal</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <p className="font-semibold text-orange-500">Prep Time</p>
                        <p>{meal.preparationTime} minutes</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Accordion Sections */}
                <div className="space-y-4">
                  <AccordionSection
                    title="Ingredients"
                    isOpen={openSection === `${meal._id}-ingredients`}
                    toggle={() => setOpenSection(openSection === `${meal._id}-ingredients` ? null : `${meal._id}-ingredients`)}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {meal.ingredients.map((item, index) => (
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
                    isOpen={openSection === `${meal._id}-instructions`}
                    toggle={() => setOpenSection(openSection === `${meal._id}-instructions` ? null : `${meal._id}-instructions`)}
                  >
                    <div className="space-y-4">
                      <p className="text-gray-600 italic mb-4">Serves: {meal.serves}</p>
                      {Array.isArray(meal.instructions) ? (
                        meal.instructions.map((step, i) => {
                          // Split the instruction into parts
                          const parts = step.split(':');
                          if (parts.length >= 3) {
                            const stepNumber = parts[0].trim();
                            const title = parts[1].trim();
                            const description = parts.slice(2).join(':').trim();
                            
                            return (
                              <div key={i} className="text-gray-700 leading-relaxed">
                                <span className="font-bold text-black">{stepNumber}: {title}:</span>
                                <p className="mt-1">{description}</p>
                              </div>
                            );
                          }
                          return <p key={i} className="text-gray-700 leading-relaxed">{step}</p>;
                        })
                      ) : (
                        <p className="text-gray-700 leading-relaxed">{meal.instructions}</p>
                      )}
                    </div>
                  </AccordionSection>

                  <AccordionSection
                    title="Nutrient Breakdown"
                    isOpen={openSection === `${meal._id}-nutrients`}
                    toggle={() => setOpenSection(openSection === `${meal._id}-nutrients` ? null : `${meal._id}-nutrients`)}
                  >
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {meal.nutrients &&
                        Object.entries(meal.nutrients).map(([key, val]) => (
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
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <Modal
            title="Delete Custom Meal"
            message="Are you sure you want to delete this custom meal? This action cannot be undone."
            onConfirm={handleDeleteMeal}
            onCancel={() => setShowDeleteModal(false)}
            confirmText="Delete"
            cancelText="Cancel"
            isLoading={deletingMealId !== null}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CustomRecipesPage;
