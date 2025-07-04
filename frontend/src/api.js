import axios from "axios";

const baseURL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_API_URL_PRODUCTION
    : import.meta.env.VITE_API_URL_LOCAL;

if (import.meta.env.MODE === "production") {
  console.log("🟠 [PROD] Using backend URL:", baseURL);
}

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add interceptor to attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add a function to regenerate the meal plan
export const regenerateMealPlan = (data) => {
  return api.post("/mealplan/regenerate", data);
};

export default api;
