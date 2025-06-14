const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema(
  {
    recipeName: { type: String, required: true },
    instructions: { type: [String], required: true },
    calories: { type: Number, required: true },
    nutrients: { type: Object, required: true },
    ingredients: [
      {
        englishName: { type: String, required: true },
        quantity: { type: String, required: true },
        urduName: { type: String, required: false },
      },
    ],
    preparationTime: { type: Number, required: true },
    mealType: { type: String, required: true },
    dietaryType: { type: String, required: true },
    weightGoal: { type: String, required: true },
    mealImageURL: { type: String, required: true },
    serves: { type: Number, required: true },
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
  { timestamps: true }
);

module.exports = mongoose.model("Recipe", RecipeSchema);
