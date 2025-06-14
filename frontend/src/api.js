import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add a function to regenerate the meal plan
export const regenerateMealPlan = (data) => {
  return api.post("/mealplan/regenerate", data);
};

export default api;
