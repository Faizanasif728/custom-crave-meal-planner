const Recipes = require("../models/Recipes");
const UserProfile = require("../models/UserProfile");

// Controller: Search by calories + nutrient
const searchByCaloriesAndNutrient = async (req, res) => {
  try {
    const { calories, nutrient, save } = req.body;
    const userId = req.user?.id;

    if (!calories || !nutrient || !nutrient.type || !nutrient.value) {
      return res.status(400).json({
        message: "Calories and one nutrient (type + value) are required.",
      });
    }

    const allowedNutrients = [
      "protein",
      "carbs",
      "fats",
      "fiber",
      "sodium",
      "cholesterol",
    ];

    if (!allowedNutrients.includes(nutrient.type)) {
      return res.status(400).json({
        message: `Invalid nutrient type. Allowed: ${allowedNutrients.join(
          ", "
        )}`,
      });
    }

    const calorieTarget = parseInt(calories);
    const nutrientTarget = parseFloat(nutrient.value);

    if (isNaN(calorieTarget) || isNaN(nutrientTarget)) {
      return res
        .status(400)
        .json({ message: "Calories and nutrient must be numeric." });
    }

    const minCalories = calorieTarget - 50;
    const maxCalories = calorieTarget + 50;
    const minNutrient = nutrientTarget - 5;
    const maxNutrient = nutrientTarget + 5;

    const allMeals = await Recipes.find({});

    const filtered = allMeals.filter((meal) => {
      const kcal = Number(meal.calories);
      const nutrientVal = Number(meal.nutrients?.[nutrient.type]);

      return (
        !isNaN(kcal) &&
        !isNaN(nutrientVal) &&
        kcal >= minCalories &&
        kcal <= maxCalories &&
        nutrientVal >= minNutrient &&
        nutrientVal <= maxNutrient
      );
    });

    if (filtered.length === 0) {
      return res
        .status(404)
        .json({ message: "No meals found for given criteria." });
    }

    const shuffled = filtered.sort(() => Math.random() - 0.5);
    const bestMeal = shuffled[0];

    if (save === true && userId) {
      await saveMealToUserProfile(
        bestMeal,
        userId,
        calories,
        nutrient.type,
        nutrient.value
      );
    }

    return res.status(200).json(bestMeal);
  } catch (error) {
    console.error("🔥 Error in searchByCaloriesAndNutrient:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// Helper to Save Meal to UserProfile
async function saveMealToUserProfile(
  meal,
  userId,
  caloriesInput = null,
  nutrientType = "",
  nutrientValue = null
) {
  try {
    const userProfile = await UserProfile.findOne({ userId });
    if (!userProfile) return;

    const formattedMeal = {
      recipeName: meal.recipeName,
      ingredients: meal.ingredients.map(
        (item) => `${item.englishName} - ${item.quantity} - ${item.urduName}`
      ),
      preparationTime: meal.preparationTime,
      instructions: Array.isArray(meal.instructions)
        ? [...meal.instructions]
        : [meal.instructions],
      calories: Number(meal.calories),
      nutrients: meal.nutrients,
      mealImageURL: meal.mealImageURL || "",
      caloriesInput,
      nutrientType,
      nutrientValue,
      serves: meal.serves
    };

    userProfile.customMeals.push(formattedMeal);
    await userProfile.save();
  } catch (error) {
    console.error("❌ Error saving to user profile:", error.message);
  }
}

// Controller: Refresh by calories + nutrient
const refreshCustomMealByCaloriesAndNutrient = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User not logged in." });
    }

    const userProfile = await UserProfile.findOne({ userId });
    if (!userProfile || !userProfile.customMeals.length) {
      return res
        .status(404)
        .json({ message: "No previous meal found to refresh." });
    }

    const lastIndex = userProfile.customMeals.length - 1;
    const lastMeal = userProfile.customMeals[lastIndex];

    const { caloriesInput, nutrientType, nutrientValue } = lastMeal;

    if (!caloriesInput || !nutrientType || !nutrientValue) {
      return res
        .status(400)
        .json({ message: "Missing previous search criteria for refresh." });
    }

    const allowedNutrients = [
      "protein",
      "carbs",
      "fats",
      "fiber",
      "sodium",
      "cholesterol",
    ];

    if (!allowedNutrients.includes(nutrientType)) {
      return res.status(400).json({
        message: `Invalid nutrient type. Allowed: ${allowedNutrients.join(
          ", "
        )}`,
      });
    }

    const calorieTarget = parseInt(caloriesInput);
    const nutrientTarget = parseFloat(nutrientValue);

    const minCalories = calorieTarget - 50;
    const maxCalories = calorieTarget + 50;
    const minNutrient = nutrientTarget - 5;
    const maxNutrient = nutrientTarget + 5;

    const allMeals = await Recipes.find({});

    const filtered = allMeals.filter((meal) => {
      const kcal = Number(meal.calories);
      const nutrientVal = Number(meal.nutrients?.[nutrientType]);

      return (
        !isNaN(kcal) &&
        !isNaN(nutrientVal) &&
        kcal >= minCalories &&
        kcal <= maxCalories &&
        nutrientVal >= minNutrient &&
        nutrientVal <= maxNutrient
      );
    });

    if (filtered.length === 0) {
      return res
        .status(404)
        .json({ message: "No meals found for given criteria." });
    }

    const shuffled = filtered.sort(() => Math.random() - 0.5);
    const newMeal = shuffled[0];

    const newFormattedMeal = {
      recipeName: newMeal.recipeName,
      ingredients: newMeal.ingredients.map(
        (item) => `${item.englishName} - ${item.quantity} - ${item.urduName}`
      ),
      preparationTime: newMeal.preparationTime,
      instructions: Array.isArray(newMeal.instructions)
        ? [...newMeal.instructions]
        : [newMeal.instructions],
      calories: Number(newMeal.calories),
      nutrients: newMeal.nutrients,
      mealImageURL: newMeal.mealImageURL || "",
      caloriesInput,
      nutrientType,
      nutrientValue,
      serves: newMeal.serves
    };

    // ✅ Replace the last saved meal
    userProfile.customMeals[lastIndex] = newFormattedMeal;
    await userProfile.save();

    console.log(
      "✅ Meal refreshed successfully based on calories and nutrient!"
    );

    return res.status(200).json(newFormattedMeal);
  } catch (error) {
    console.error("🔥 Error in refreshCustomMealByCaloriesAndNutrient:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Delete calorie nutrient meal
const deleteCalorieNutrientMeal = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { mealId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: User not logged in." });
    }

    const userProfile = await UserProfile.findOne({ userId });
    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found." });
    }

    // Find the meal by its _id
    const mealIndex = userProfile.customMeals.findIndex(meal => 
      meal._id && meal._id.toString() === mealId && meal.caloriesInput
    );

    if (mealIndex === -1) {
      return res.status(404).json({ message: "Custom meal not found." });
    }

    userProfile.customMeals.splice(mealIndex, 1);
    await userProfile.save();

    res.status(200).json({ message: "Custom meal deleted successfully." });
  } catch (error) {
    console.error("Error deleting custom meal:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  searchByCaloriesAndNutrient,
  refreshCustomMealByCaloriesAndNutrient,
  deleteCalorieNutrientMeal
};
