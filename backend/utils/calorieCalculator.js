const calculateCalories = (
  gender,
  age,
  weight,
  height,
  activityLevel,
  weightGoal
) => {
  console.log("✅ calculateCalories called");

  // Ensure required fields are provided
  if (!age || !weight || !height) {
    throw new Error(
      "Age, weight, and height are required for calorie calculation."
    );
  }

  let bmr;

  // Calculate BMR using Mifflin-St Jeor Equation
  if (gender === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  console.log("BMR:", bmr);

  // Activity level multipliers
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };

  const multiplier = activityMultipliers[activityLevel] || 1.2;
  console.log("Activity Level Multiplier:", multiplier);

  // Adjust for activity level
  let dailyCalories = bmr * multiplier;
  console.log("Calories before goal adjustment:", dailyCalories);

  // Adjust for goal
  if (weightGoal === "Weight Loss") {
    dailyCalories -= 500;
    console.log("Applying weight loss adjustment: -500");
  } else if (weightGoal === "Weight Gain") {
    dailyCalories += 500;
    console.log("Applying weight gain adjustment: +500");
  }

  const finalCalories = Math.round(dailyCalories);
  console.log("Final Calories:", finalCalories);

  return finalCalories;
};

module.exports = calculateCalories;
