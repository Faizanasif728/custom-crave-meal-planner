import React, { useEffect, useState } from "react";
import api from "../api";
import Modal from "../components/Modal";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaChevronDown,
  FaChevronUp,
  FaTrash,
  FaInfoCircle,
  FaClock,
} from "react-icons/fa";

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
      {isOpen ? (
        <FaChevronUp className="text-orange-400" />
      ) : (
        <FaChevronDown className="text-orange-400" />
      )}
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

const MyMealPlansPage = () => {
  const [mealPlans, setMealPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMealPlanId, setSelectedMealPlanId] = useState(null);
  const [openSection, setOpenSection] = useState(null);

  useEffect(() => {
    const fetchMealPlans = async () => {
      try {
        const response = await api.get("/mealplan/all");
        const sortedMealPlans = (response.data.mealPlans || []).sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setMealPlans(sortedMealPlans);
      } catch (error) {
        console.error("Error fetching meal plans:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMealPlans();
  }, []);

  const handleDeleteMealPlan = async () => {
    try {
      await api.delete(`/mealplan/${selectedMealPlanId}`);
      setMealPlans((prev) =>
        prev.filter((plan) => plan._id !== selectedMealPlanId)
      );
      toast.success("Meal plan deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete meal plan.");
    } finally {
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-[#333]">
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <h1
            className="text-3xl md:text-4xl font-extrabold text-orange-500 text-center drop-shadow-sm"
            style={{
              fontFamily: `'Dancing Script', 'Pacifico', 'Great Vibes', cursive, 'Playfair Display', serif`,
            }}
          >
            Saved Meal Plans
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-12">
        {loading ? (
          <p className="text-center text-gray-500">Loading meal plans...</p>
        ) : mealPlans.length === 0 ? (
          <p className="text-center text-gray-500">No meal plans found.</p>
        ) : (
          mealPlans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="p-6 space-y-8">
                <div className="relative">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                    <h2 className="text-2xl font-bold text-orange-500">
                      Meal Plan
                    </h2>
                    <div className="flex items-center text-xs md:text-sm text-gray-500 whitespace-nowrap">
                      <FaClock className="mr-1 flex-shrink-0" />
                      <span>
                        Created{" "}
                        {plan.createdAt
                          ? new Date(plan.createdAt).toLocaleString("en-US", {
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
                    onClick={() => {
                      setSelectedMealPlanId(plan._id);
                      setShowDeleteModal(true);
                    }}
                    className="absolute top-0 right-0 flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors"
                  >
                    <FaTrash />
                    <span>Delete</span>
                  </button>
                </div>

                {plan.mealPlans.map((dayPlan, dayIndex) => (
                  <div key={dayIndex} className="space-y-6">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-orange-500">
                        Day {dayPlan.day}
                      </h3>
                      <div className="ml-auto bg-orange-50 px-3 py-1 rounded-full">
                        <span className="text-orange-500 font-medium">
                          {dayPlan.totalCalories} kcal
                        </span>
                      </div>
                    </div>

                    {dayPlan.recipes.map((recipe, recipeIndex) => {
                      const recipeIdentifier = `${plan._id}-${dayPlan.day}-${recipe.mealType}-${recipe.recipeId}`;
                      return (
                        <div key={recipeIndex} className="space-y-6">
                          <div className="flex flex-col md:flex-row items-start gap-6 bg-orange-50 rounded-lg p-6">
                            <div className="w-full md:w-96 flex-shrink-0">
                              <div className="w-full rounded-lg overflow-hidden shadow-md">
                                <img
                                  src={recipe.mealImageURL}
                                  alt={recipe.recipeName}
                                  className="w-full h-auto object-cover rounded-lg transform hover:scale-105 transition duration-300"
                                  style={{
                                    maxHeight: "400px",
                                    minHeight: "250px",
                                  }}
                                />
                              </div>
                            </div>

                            <div className="flex flex-col justify-center w-full space-y-3">
                              <h3 className="text-2xl font-bold text-orange-500">
                                {recipe.recipeName}
                              </h3>
                              <p className="text-orange-400 font-medium">
                                {recipe.recipeNameUrdu}
                              </p>
                              <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                                <div className="bg-white p-3 rounded-lg shadow-sm">
                                  <p className="font-semibold text-orange-500">
                                    Meal Type
                                  </p>
                                  <p className="capitalize">
                                    {recipe.mealType}
                                  </p>
                                </div>
                                <div className="bg-white p-3 rounded-lg shadow-sm">
                                  <p className="font-semibold text-orange-500">
                                    Calories
                                  </p>
                                  <p>{recipe.calories} kcal</p>
                                </div>
                                <div className="bg-white p-3 rounded-lg shadow-sm">
                                  <p className="font-semibold text-orange-500">
                                    Servings
                                  </p>
                                  <p>{recipe.servings}</p>
                                </div>
                                <div className="bg-white p-3 rounded-lg shadow-sm">
                                  <p className="font-semibold text-orange-500">
                                    Diet Type
                                  </p>
                                  <p>{recipe.dietaryType}</p>
                                </div>
                                <div className="bg-white p-3 rounded-lg shadow-sm">
                                  <p className="font-semibold text-orange-500">
                                    Prep Time
                                  </p>
                                  <p>{recipe.preparationTime} minutes</p>
                                </div>
                                <div className="bg-white p-3 rounded-lg shadow-sm">
                                  <p className="font-semibold text-orange-500">
                                    Weight Goal
                                  </p>
                                  <p>{recipe.weightGoal}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <AccordionSection
                              title="Nutrients Breakdown"
                              isOpen={
                                openSection === `nutrients-${recipeIdentifier}`
                              }
                              toggle={() =>
                                setOpenSection(
                                  openSection ===
                                    `nutrients-${recipeIdentifier}`
                                    ? null
                                    : `nutrients-${recipeIdentifier}`
                                )
                              }
                            >
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="bg-orange-50 p-3 rounded-lg">
                                  <p className="font-semibold text-orange-500">
                                    Protein
                                  </p>
                                  <p>{recipe.nutrients?.protein || 0}g</p>
                                </div>
                                <div className="bg-orange-50 p-3 rounded-lg">
                                  <p className="font-semibold text-orange-500">
                                    Carbs
                                  </p>
                                  <p>{recipe.nutrients?.carbs || 0}g</p>
                                </div>
                                <div className="bg-orange-50 p-3 rounded-lg">
                                  <p className="font-semibold text-orange-500">
                                    Fats
                                  </p>
                                  <p>{recipe.nutrients?.fats || 0}g</p>
                                </div>
                                <div className="bg-orange-50 p-3 rounded-lg">
                                  <p className="font-semibold text-orange-500">
                                    Fiber
                                  </p>
                                  <p>{recipe.nutrients?.fiber || 0}g</p>
                                </div>
                                <div className="bg-orange-50 p-3 rounded-lg">
                                  <p className="font-semibold text-orange-500">
                                    Sodium
                                  </p>
                                  <p>{recipe.nutrients?.sodium || 0}mg</p>
                                </div>
                                <div className="bg-orange-50 p-3 rounded-lg">
                                  <p className="font-semibold text-orange-500">
                                    Cholesterol
                                  </p>
                                  <p>{recipe.nutrients?.cholesterol || 0}mg</p>
                                </div>
                              </div>
                            </AccordionSection>

                            <AccordionSection
                              title="Ingredients"
                              isOpen={
                                openSection ===
                                `ingredients-${recipeIdentifier}`
                              }
                              toggle={() =>
                                setOpenSection(
                                  openSection ===
                                    `ingredients-${recipeIdentifier}`
                                    ? null
                                    : `ingredients-${recipeIdentifier}`
                                )
                              }
                            >
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {recipe.ingredients?.length ? (
                                  recipe.ingredients.map((ing, i) => (
                                    <div
                                      key={i}
                                      className="bg-orange-50 p-3 rounded-lg"
                                    >
                                      <p className="font-semibold text-orange-500">
                                        {ing.englishName}
                                      </p>
                                      <p className="text-gray-600">
                                        {ing.urduName}
                                      </p>
                                      <p className="text-sm text-gray-500">
                                        {ing.quantity}
                                      </p>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-gray-500">
                                    No ingredients available
                                  </p>
                                )}
                              </div>
                            </AccordionSection>

                            <AccordionSection
                              title="Step-by-Step Instructions"
                              isOpen={
                                openSection ===
                                `instructions-${recipeIdentifier}`
                              }
                              toggle={() =>
                                setOpenSection(
                                  openSection ===
                                    `instructions-${recipeIdentifier}`
                                    ? null
                                    : `instructions-${recipeIdentifier}`
                                )
                              }
                            >
                              <div className="space-y-4">
                                <p className="text-gray-600 italic mb-4">Serves: {recipe.serves}</p>
                                {recipe.instructions?.length ? (
                                  recipe.instructions.map((step, i) => {
                                    const parts = step.split(":");
                                    if (parts.length >= 3) {
                                      const stepNumber = parts[0].trim();
                                      const title = parts[1].trim();
                                      const description = parts
                                        .slice(2)
                                        .join(":")
                                        .trim();
                                      return (
                                        <div
                                          key={i}
                                          className="text-gray-700 leading-relaxed"
                                        >
                                          <span className="font-bold text-black">
                                            {stepNumber}: {title}:
                                          </span>
                                          <p className="mt-1">{description}</p>
                                        </div>
                                      );
                                    }
                                    return (
                                      <p
                                        key={i}
                                        className="text-gray-700 leading-relaxed"
                                      >
                                        {step}
                                      </p>
                                    );
                                  })
                                ) : (
                                  <p className="text-gray-500">
                                    No instructions available
                                  </p>
                                )}
                              </div>
                            </AccordionSection>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {showDeleteModal && (
        <Modal
          title="Delete Meal Plan"
          message="Are you sure you want to delete this meal plan? This action cannot be undone."
          onConfirm={handleDeleteMealPlan}
          onCancel={() => setShowDeleteModal(false)}
          confirmText="Delete"
          cancelText="Cancel"
        />
      )}
    </div>
  );
};

export default MyMealPlansPage;
