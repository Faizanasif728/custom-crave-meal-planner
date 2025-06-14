const express = require("express");
const { authenticateUser } = require("../middleware/authMiddleware");
const {
  generateMealPlan,
  getAllMealPlans,
  deleteMealPlan,
  regenerateMealPlan, // Import the regenerateMealPlan controller
} = require("../controllers/mealplanController");
const router = express.Router();

router.post("/generate", authenticateUser, generateMealPlan);

router.get("/all", authenticateUser, getAllMealPlans); // Add route to fetch meal plans
router.delete("/:mealPlanId", authenticateUser, deleteMealPlan); // Add route to delete a meal plan

// Add route to regenerate a meal plan
router.post("/regenerate", authenticateUser, regenerateMealPlan);

module.exports = router;
