const MealPlan = require("../models/MealPlan");
const Recipe = require("../models/Recipes");
const UserProfile = require("../models/UserProfile");
const User = require("../models/users"); // Ensure this is the correct path to your User model
const mongoose = require("mongoose");

const generateMealPlan = async (req, res) => {
  console.log("Received request to generate meal plan");

  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    const userId = req.user.id;
    console.log("Extracted userId from token:", userId);

    // Fetch user profile to get daily calories and weight goal
    const userProfile = await UserProfile.findOne({ userId });
    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    const { dietaryType, mealType, noOfDays } = req.body; // Removed weightGoal from req.body
    const { dailyCalories, weightGoal } = userProfile; // Fetch weightGoal from user profile

    if (!dailyCalories) {
      return res.status(400).json({
        message: "Daily calorie intake not set. Please update profile first.",
      });
    }

    if (!mealType || !Array.isArray(mealType) || mealType.length === 0) {
      return res.status(400).json({
        message:
          "Please select at least one meal type (Breakfast, Lunch, Dinner, Snack).",
      });
    }

    if (!noOfDays || noOfDays < 1) {
      return res
        .status(400)
        .json({ message: "Please specify a valid number of days." });
    }

    // ✅ Update dietaryType and mealType in the user's profile
    userProfile.dietaryType = dietaryType || userProfile.dietaryType;
    userProfile.mealType = mealType || userProfile.mealType;
    await userProfile.save();

    // ✅ Calorie distribution
    const distributionPercentages = {
      Breakfast: 0.25,
      Lunch: 0.3,
      Dinner: 0.3,
      Snack: 0.15,
    };

    let totalPercentage = mealType.reduce(
      (sum, type) => sum + (distributionPercentages[type] || 0),
      0
    );

    if (totalPercentage === 0) {
      return res.status(400).json({ message: "Invalid meal types selected." });
    }

    let calorieDistribution = {};
    mealType.forEach((type) => {
      calorieDistribution[type] = Math.round(
        dailyCalories * (distributionPercentages[type] / totalPercentage)
      );
    });

    let finalMealPlan = [];
    let usedRecipeIds = new Set();

    // ✅ Generate meals for the specified number of days
    for (let day = 1; day <= noOfDays; day++) {
      let dailyMealPlan = [];
      let totalCalories = 0;

      for (const type of mealType) {
        const calorieTarget = calorieDistribution[type];

        let recipes = await Recipe.find({
          dietaryType,
          weightGoal,
          mealType: type,
          calories: { $lte: calorieTarget },
          _id: { $nin: Array.from(usedRecipeIds) }
        });

        if (recipes.length === 0) {
          recipes = await Recipe.find({
            dietaryType,
            weightGoal,
            mealType: type,
            _id: { $nin: Array.from(usedRecipeIds) }
          }).limit(5);
        }

        if (recipes.length === 0) {
          console.log(`❌ No meals found for ${type}`);
          continue;
        }

        recipes = recipes.sort(() => 0.5 - Math.random());
        const selectedMeal = recipes[0];
        usedRecipeIds.add(selectedMeal._id);

        dailyMealPlan.push({
          mealType: selectedMeal.mealType,
          recipeId: selectedMeal._id,
          recipeName: selectedMeal.recipeName,
          mealImageURL: selectedMeal.mealImageURL,
          preparationTime: selectedMeal.preparationTime,
          calories: selectedMeal.calories,
          weightGoal: selectedMeal.weightGoal || "defaultWeightGoal",
          dietaryType: selectedMeal.dietaryType || "defaultDietaryType",
          ingredients: selectedMeal.ingredients,
          instructions: selectedMeal.instructions,
          nutrients: selectedMeal.nutrients || {},
          servings: 1,
          serves: selectedMeal.serves,
        });

        totalCalories += selectedMeal.calories;
      }

      // ✅ Adjust servings to reach dailyCalories
      if (totalCalories < dailyCalories && dailyMealPlan.length > 0) {
        let deficit = dailyCalories - totalCalories;
        let iteration = 0;
        const maxIterations = 10;
        const calorieThreshold = 50; // Maximum allowed deviation from target

        while (totalCalories < dailyCalories && iteration < maxIterations) {
          // Sort meals by their contribution to total calories (ascending)
          let mealsSorted = [...dailyMealPlan].sort((a, b) => {
            const aContribution = (a.calories * a.servings) / totalCalories;
            const bContribution = (b.calories * b.servings) / totalCalories;
            return aContribution - bContribution;
          });

          let addedServings = false;
          let remainingDeficit = deficit;

          // Distribute servings more evenly
          for (let meal of mealsSorted) {
            // Calculate proportional deficit for this meal based on its calorie content
            const mealProportion = meal.calories / totalCalories;
            const mealDeficit = Math.round(deficit * mealProportion);
            
            // Calculate extra servings needed for this meal
            let extraServings = Math.ceil(mealDeficit / meal.calories);
            
            // Limit extra servings to prevent overshooting
            extraServings = Math.min(extraServings, Math.ceil(remainingDeficit / meal.calories));

            if (extraServings > 0) {
              meal.servings += extraServings;
              const addedCalories = extraServings * meal.calories;
              totalCalories += addedCalories;
              remainingDeficit -= addedCalories;
              addedServings = true;

              // Check if we're within acceptable range
              if (Math.abs(totalCalories - dailyCalories) <= calorieThreshold) {
                console.log(`✅ Total calories reached! Final: ${totalCalories} kcal`);
                break;
              }
            }
          }

          // Update deficit for next iteration
          deficit = dailyCalories - totalCalories;
          
          // Break if we're close enough to target or no more servings were added
          if (Math.abs(deficit) <= calorieThreshold || !addedServings) {
            break;
          }
          
          iteration++;
        }
      }

      dailyMealPlan = dailyMealPlan.map((meal) => ({
        ...meal,
        totalCalories: meal.servings * meal.calories,
      }));

      finalMealPlan.push({
        day,
        totalCalories,
        recipes: dailyMealPlan,
      });
    }

    if (finalMealPlan.length === 0) {
      return res.status(404).json({ message: "No suitable meal plan found." });
    }

    // ✅ Save meal plan in MongoDB
    const newMealPlan = new MealPlan({
      userId,
      noOfDays,
      weightGoal, // Use weightGoal fetched from user profile
      dietaryType,
      mealType,
      mealPlans: finalMealPlan,
    });

    await newMealPlan.save();

    res.status(201).json({
      success: true,
      message: "Meal plan created",
      mealPlan: newMealPlan,
    });
  } catch (error) {
    console.error("Error generating meal plan:", error);
    res.status(500).json({
      success: false,
      message: "Error generating meal plan",
      error: error.message,
    });
  }
};

const getAllMealPlans = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch meal plans for logged-in user
    const mealPlans = await MealPlan.find({ userId })
      .populate({
        path: "mealPlans.recipes.recipeId",
        model: "Recipe", // Ensure this matches your Mongoose model name
      })
      .select("mealPlans noOfDays mealType weightGoal dietaryType createdAt");

    if (!mealPlans || mealPlans.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No meal plans found. Please generate a meal plan first.",
      });
    }

    res.status(200).json({
      success: true,
      mealPlans,
    });
  } catch (error) {
    console.error("Error fetching meal plans:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching meal plans",
      error: error.message,
    });
  }
};

const deleteMealPlan = async (req, res) => {
  try {
    const userId = req.user.id; // Get the authenticated user's ID
    const { mealPlanId } = req.params; // Get the meal plan ID from the request parameters

    // Check if the meal plan exists and belongs to the user
    const mealPlan = await MealPlan.findOne({ _id: mealPlanId, userId });
    if (!mealPlan) {
      return res.status(404).json({
        success: false,
        message: "Meal plan not found or does not belong to the user",
      });
    }

    // Delete the meal plan
    await MealPlan.deleteOne({ _id: mealPlanId });

    res.status(200).json({
      success: true,
      message: "Meal plan deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting meal plan:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting meal plan",
      error: error.message,
    });
  }
};

const regenerateMealPlan = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    const userId = req.user.id;

    // Fetch the user's last saved meal plan
    const lastMealPlan = await MealPlan.findOne({ userId }).sort({
      createdAt: -1,
    });
    if (!lastMealPlan) {
      return res.status(404).json({
        message: "No previous meal plan found. Please generate one first.",
      });
    }

    const {
      weightGoal,
      dietaryType,
      mealType,
      noOfDays,
      mealPlans: previousMealPlans,
    } = lastMealPlan;
    const { dailyCalories } = await UserProfile.findOne({ userId });

    if (!dailyCalories) {
      return res.status(400).json({
        message: "Daily calorie intake not set. Please update profile first.",
      });
    }

    // Calorie distribution logic
    const distributionPercentages = {
      Breakfast: 0.25,
      Lunch: 0.3,
      Dinner: 0.3,
      Snack: 0.15,
    };

    let totalPercentage = mealType.reduce(
      (sum, type) => sum + (distributionPercentages[type] || 0),
      0
    );

    if (totalPercentage === 0) {
      return res.status(400).json({ message: "Invalid meal types selected." });
    }

    let calorieDistribution = {};
    mealType.forEach((type) => {
      calorieDistribution[type] = Math.round(
        dailyCalories * (distributionPercentages[type] / totalPercentage)
      );
    });

    let finalMealPlan = [];
    let usedRecipeIds = new Set();

    // Generate meals for the specified number of days
    for (let day = 1; day <= noOfDays; day++) {
      let dailyMealPlan = [];
      let totalCalories = 0;

      for (const type of mealType) {
        const calorieTarget = calorieDistribution[type];

        // Exclude previously selected recipes and used recipes
        const previousRecipeIds = previousMealPlans
          .flatMap((plan) => plan.recipes)
          .map((recipe) => recipe.recipeId);

        let recipes = await Recipe.find({
          dietaryType,
          weightGoal,
          mealType: type,
          calories: { $lte: calorieTarget },
          _id: { $nin: [...previousRecipeIds, ...Array.from(usedRecipeIds)] }
        });

        if (recipes.length === 0) {
          recipes = await Recipe.find({
            dietaryType,
            weightGoal,
            mealType: type,
            _id: { $nin: [...previousRecipeIds, ...Array.from(usedRecipeIds)] }
          }).limit(5);
        }

        if (recipes.length === 0) {
          console.log(`❌ No meals found for ${type}`);
          continue;
        }

        recipes = recipes.sort(() => 0.5 - Math.random());
        const selectedMeal = recipes[0];
        usedRecipeIds.add(selectedMeal._id);

        dailyMealPlan.push({
          mealType: selectedMeal.mealType,
          recipeId: selectedMeal._id,
          recipeName: selectedMeal.recipeName,
          mealImageURL: selectedMeal.mealImageURL,
          preparationTime: selectedMeal.preparationTime,
          calories: selectedMeal.calories,
          weightGoal: selectedMeal.weightGoal || "defaultWeightGoal",
          dietaryType: selectedMeal.dietaryType || "defaultDietaryType",
          ingredients: selectedMeal.ingredients,
          instructions: selectedMeal.instructions,
          nutrients: selectedMeal.nutrients || {},
          servings: 1,
          serves: selectedMeal.serves,
        });

        totalCalories += selectedMeal.calories;
      }

      // ✅ Adjust servings to reach dailyCalories
      if (totalCalories < dailyCalories && dailyMealPlan.length > 0) {
        let deficit = dailyCalories - totalCalories;
        let iteration = 0;
        const maxIterations = 10;
        const calorieThreshold = 50; // Maximum allowed deviation from target

        while (totalCalories < dailyCalories && iteration < maxIterations) {
          // Sort meals by their contribution to total calories (ascending)
          let mealsSorted = [...dailyMealPlan].sort((a, b) => {
            const aContribution = (a.calories * a.servings) / totalCalories;
            const bContribution = (b.calories * b.servings) / totalCalories;
            return aContribution - bContribution;
          });

          let addedServings = false;
          let remainingDeficit = deficit;

          // Distribute servings more evenly
          for (let meal of mealsSorted) {
            // Calculate proportional deficit for this meal based on its calorie content
            const mealProportion = meal.calories / totalCalories;
            const mealDeficit = Math.round(deficit * mealProportion);
            
            // Calculate extra servings needed for this meal
            let extraServings = Math.ceil(mealDeficit / meal.calories);
            
            // Limit extra servings to prevent overshooting
            extraServings = Math.min(extraServings, Math.ceil(remainingDeficit / meal.calories));

            if (extraServings > 0) {
              meal.servings += extraServings;
              const addedCalories = extraServings * meal.calories;
              totalCalories += addedCalories;
              remainingDeficit -= addedCalories;
              addedServings = true;

              // Check if we're within acceptable range
              if (Math.abs(totalCalories - dailyCalories) <= calorieThreshold) {
                console.log(`✅ Total calories reached! Final: ${totalCalories} kcal`);
                break;
              }
            }
          }

          // Update deficit for next iteration
          deficit = dailyCalories - totalCalories;
          
          // Break if we're close enough to target or no more servings were added
          if (Math.abs(deficit) <= calorieThreshold || !addedServings) {
            break;
          }
          
          iteration++;
        }
      }

      dailyMealPlan = dailyMealPlan.map((meal) => ({
        ...meal,
        totalCalories: meal.servings * meal.calories,
      }));

      finalMealPlan.push({
        day,
        totalCalories,
        recipes: dailyMealPlan,
      });
    }

    if (finalMealPlan.length === 0) {
      return res.status(404).json({ message: "No suitable meal plan found." });
    }

    // Update the existing meal plan document
    const updatedMealPlan = await MealPlan.findByIdAndUpdate(
      lastMealPlan._id,
      {
        $set: {
          mealPlans: finalMealPlan,
          updatedAt: new Date()
        }
      },
      { new: true }
    ).populate({
      path: "mealPlans.recipes.recipeId",
      model: "Recipe",
    });

    res.status(200).json({
      success: true,
      message: "Meal plan regenerated successfully",
      mealPlan: {
        mealPlans: updatedMealPlan.mealPlans,
        noOfDays: updatedMealPlan.noOfDays,
        weightGoal: updatedMealPlan.weightGoal,
        dietaryType: updatedMealPlan.dietaryType,
        mealType: updatedMealPlan.mealType,
      },
    });
  } catch (error) {
    console.error("Error regenerating meal plan:", error);
    res.status(500).json({
      success: false,
      message: "Error regenerating meal plan",
      error: error.message,
    });
  }
};

module.exports = {
  generateMealPlan,
  getAllMealPlans,
  deleteMealPlan,
  regenerateMealPlan,
};
