const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/authMiddleware");
const {
  getCustomMeal,
  refreshCustomMeal,
  deleteCustomMeal
} = require("../controllers/customCategory");
const {
  searchByCaloriesAndNutrient,
  refreshCustomMealByCaloriesAndNutrient,
  deleteCalorieNutrientMeal
} = require("../controllers/custom2");
const UserProfile = require("../models/UserProfile");

// POST /api/custom-category/ingredient-restriction
router.post("/ingredient-restriction", authenticateUser, getCustomMeal);

// POST /api/custom-category/refresh
router.post("/refresh-meal", authenticateUser, refreshCustomMeal);

// POST /api/custom-category/calorie-nutrient
router.post("/calorie-nutrient", authenticateUser, searchByCaloriesAndNutrient);

// POST /api/custom-category/refresh-calorie-nutrient
router.post("/refresh-meal-calorie-nutrient", authenticateUser, refreshCustomMealByCaloriesAndNutrient);

// DELETE /api/custom-category/ingredient-restriction/:mealId
router.delete("/ingredient-restriction/:mealId", authenticateUser, deleteCustomMeal);

// DELETE /api/custom-category/calorie-nutrient/:mealId
router.delete("/calorie-nutrient/:mealId", authenticateUser, deleteCalorieNutrientMeal);

module.exports = router;
