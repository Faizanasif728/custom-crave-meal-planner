const mongoose = require("mongoose");

// Custom Meal Subschema
const customMealSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  recipeName: String,
  ingredients: [String], // "English - Quantity - Urdu"
  preparationTime: Number,
  instructions: { type: [String], required: true },
  calories: Number,
  nutrients: {
    protein: Number,
    carbs: Number,
    fats: Number,
    fiber: Number,
    sodium: Number,
    cholesterol: Number,
  },
  mealImageURL: String,
  ingredient: String, // ✅ original preferred ingredient
  restrictions: [String], // ✅ original dietary restrictions
  caloriesInput: Number, // ✅ for calorie-nutrient based custom meal
  nutrientType: String, // ✅ nutrient type like "protein", "carbs" etc
  nutrientValue: Number, // ✅ nutrient value entered by user
  serves: { type: Number, required: true },
}, { timestamps: true }); // Add timestamps to track createdAt and updatedAt

const UserProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "not_specified"],
    default: "not_specified",
  },
  age: { type: Number, default: 0 },
  height: { type: Number, default: 0 },
  weight: { type: Number, default: 0 },
  activityLevel: {
    type: String,
    enum: [
      "sedentary",
      "light",
      "moderate",
      "active",
      "very_active",
      "not_specified",
    ],
    default: "not_specified",
  },
  weightGoal: {
    type: String,
    enum: ["Weight Gain", "Weight Loss", "not_specified"],
    default: "not_specified",
  },
  dailyCalories: { type: Number, default: 0 },
  profileImage: {
    type: String,
    default: "https://via.placeholder.com/150",
    validate: {
      validator: function (v) {
        return /^(https?:\/\/[^\s]+)$/.test(v);
      },
      message: (props) => `${props.value} is not a valid URL!`,
    },
  },
  dietaryType: {
    type: String,
    enum: [
      "Keto",
      "Vegan",
      "Vegetarian",
      "Non-Vegetarian",
      "Mediterranean",
      "Desi",
      "not_specified",
    ],
    default: "not_specified",
  },
  mealType: {
    type: [String],
    enum: ["Breakfast", "Lunch", "Dinner", "Snack"],
    default: [],
  },
  customMeals: [customMealSchema], // ✅ Custom meals updated
});
module.exports = mongoose.model("UserProfile", UserProfileSchema);
