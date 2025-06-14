const Recipes = require("../models/Recipes");
const UserProfile = require("../models/UserProfile");

const getCustomMeal = async (req, res) => {
  try {
    const { ingredient, restrictions, save } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User not logged in." });
    }

    if (!ingredient || typeof ingredient !== "string") {
      return res.status(400).json({ message: "Ingredient is required." });
    }

    if (
      !restrictions ||
      !Array.isArray(restrictions) ||
      restrictions.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "At least one dietary restriction is required." });
    }

    const cleaned = ingredient.trim().toLowerCase().replace(/\s+/g, "");

    const allMeals = await Recipes.find({
      restrictions: { $all: restrictions },
    });

    const filteredMeals = allMeals.filter((meal) =>
      meal.ingredients.some((i) =>
        i.englishName.replace(/\s+/g, "").toLowerCase().includes(cleaned)
      )
    );

    if (filteredMeals.length === 0) {
      return res.status(404).json({
        message: "No meal found for the provided ingredient and restrictions.",
      });
    }

    const shuffled = filteredMeals.sort(() => Math.random() - 0.5);
    const bestMeal = shuffled[0];

    if (save === true) {
      await saveMealToUserProfile(
        bestMeal,
        userId,
        ingredient,
        restrictions,
        false
      );
    }

    return res.status(200).json(bestMeal);
  } catch (error) {
    console.error("🔥 ERROR in getCustomMeal:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// ✅ Updated saveMealToUserProfile
async function saveMealToUserProfile(
  meal,
  userId,
  ingredient = "",
  restrictions = [],
  isFallback = false
) {
  try {
    const userProfile = await UserProfile.findOne({ userId });
    if (!userProfile) {
      console.log("❌ UserProfile not found");
      return;
    }

    const ingredients = isFallback
      ? meal.ingredients.map(
          (item) =>
            `${item["English name"]} - ${item.quantity} - ${item["Urdu name"]}`
        )
      : meal.ingredients.map(
          (item) => `${item.englishName} - ${item.quantity} - ${item.urduName}`
        );

    // Preserve the original instructions array structure
    const instructions = Array.isArray(meal.instructions) 
      ? [...meal.instructions]  // Create a new array to avoid reference issues
      : [meal.instructions];    // If it's a string, make it a single-item array

    // Create a new meal document to get timestamps
    const newMeal = {
      recipeName: meal.recipeName,
      ingredients,
      preparationTime: meal.preparationTime,
      instructions,  // Keep as array of strings
      calories: parseInt(meal.calories),
      nutrients: meal.nutrients,
      mealImageURL: isFallback
        ? "https://yourdomain.com/static/custom-meal.jpg"
        : meal.mealImageURL || "",
      ingredient,
      restrictions,
      serves: meal.serves,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    userProfile.customMeals.push(newMeal);
    await userProfile.save();
    console.log("✅ Meal saved:", newMeal.recipeName);
  } catch (error) {
    console.error("❌ Error saving meal:", error.message);
  }
}

// ✅ FINAL updated refreshCustomMeal
const refreshCustomMeal = async (req, res) => {
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

    const { ingredient, restrictions } = lastMeal;

    if (!ingredient || !restrictions || restrictions.length === 0) {
      return res.status(400).json({
        message: "Invalid data in last saved meal. Cannot refresh.",
      });
    }

    const cleanedIngredient = ingredient
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "");

    const allMeals = await Recipes.find({
      restrictions: { $all: restrictions },
    });

    const filteredMeals = allMeals.filter((meal) =>
      meal.ingredients.some((i) =>
        i.englishName
          .replace(/\s+/g, "")
          .toLowerCase()
          .includes(cleanedIngredient)
      )
    );

    if (filteredMeals.length === 0) {
      return res.status(404).json({
        message: "No meal found for the provided ingredient and restrictions.",
      });
    }

    const shuffled = filteredMeals.sort(() => Math.random() - 0.5);
    const newMeal = shuffled[0];

    const newFormattedMeal = {
      recipeName: newMeal.recipeName,
      ingredients: newMeal.ingredients.map(
        (item) => `${item.englishName} - ${item.quantity} - ${item.urduName}`
      ),
      preparationTime: newMeal.preparationTime,
      instructions: Array.isArray(newMeal.instructions) 
        ? [...newMeal.instructions]  // Keep as array of strings
        : [newMeal.instructions],    // If string, make it single-item array
      calories: parseInt(newMeal.calories),
      nutrients: newMeal.nutrients,
      mealImageURL: newMeal.mealImageURL || "",
      ingredient,
      restrictions,
      serves: newMeal.serves,
    };

    // ✅ Instead of pushing, REPLACE the last meal
    userProfile.customMeals[lastIndex] = newFormattedMeal;
    await userProfile.save();

    console.log("✅ Meal refreshed successfully:", newFormattedMeal.recipeName);

    return res.status(200).json(newFormattedMeal);
  } catch (error) {
    console.error("🔥 ERROR in refreshCustomMeal:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
// Delete ingredient restriction meal
const deleteCustomMeal = async (req, res) => {
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
      meal._id && meal._id.toString() === mealId && meal.ingredient
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
  getCustomMeal,
  refreshCustomMeal,
  deleteCustomMeal
};
