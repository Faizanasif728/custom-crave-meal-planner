const mongoose = require("mongoose");

const MealPlanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    noOfDays: {
      type: Number,
      required: true,
      min: 1,
      max: 7,
    },

    weightGoal: {
      type: String,
      required: true,
      enum: ["Weight Loss", "Weight Gain"],
    },

    mealType: {
      type: [String],
      required: true,
      enum: ["Breakfast", "Lunch", "Dinner", "Snack"],
    },

    dietaryType: {
      type: String,
      required: true,
      enum: [
        "Keto",
        "Vegan",
        "Vegetarian",
        "Non-Vegetarian",
        "Mediterranean",
        "Desi",
      ],
    },

    mealPlans: [
      {
        day: { type: Number, required: true },
        totalCalories: { type: Number, required: true, default: 0 },
        recipes: [
          {
            recipeId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Recipe",
              required: true,
            },
            instructions: { type: [String], required: true },
            nutrients: { type: Object, required: true },
            ingredients: [
              {
                englishName: { type: String, required: true },
                quantity: { type: String, required: true },
                urduName: { type: String, required: false },
              },
            ],
            recipeName: { type: String, required: true },
            mealImageURL: { type: String, required: true },
            preparationTime: { type: Number, required: false },
            calories: { type: Number, required: false },
            mealType: { type: String, required: true },
            servings: { type: Number, required: true, default: 1 },
            serves: { type: Number, required: true },
            dietaryType: { type: String, required: true },
            weightGoal: { type: String, required: true },
            restrictions: {
              type: [String],
              enum: [
                "Gluten-Free",
                "Nut-Free",
                "Egg-Free",
                "Lactose-Free",
                "Low-Sodium",
                "Low-Carb",
                "Low-Sugar",
                "Low-Cholesterol",
                "Dairy-Free",
              ],
              required: false,
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("MealPlan", MealPlanSchema);
