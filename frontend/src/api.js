import axios from "axios";

const baseURL =
  import.meta.env.MODE === "production"
    ? "https://custom-crave-meal-planner-backend.vercel.app"
    : import.meta.env.VITE_API_URL_LOCAL;

if (import.meta.env.MODE === "production") {
  console.log("🟠 [PROD] Using backend URL:", baseURL);
}

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add a function to regenerate the meal plan
export const regenerateMealPlan = (data) => {
  return api.post("/mealplan/regenerate", data);
};

export default api;
