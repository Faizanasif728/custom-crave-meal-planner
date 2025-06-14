import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// MAIN
import Layout from "./layouts/Layout";
import MobileNavProvider from "./components/MobileNavProvider";

// NAVBAR PAGES:
import Home from "./pages/HomePage";
import About from "./pages/AboutPage";
import Contact from "./pages/ContactPage";
import Ingredients from "./pages/IngredientsPage";
import MealPlanner from "./pages/MealPlannerPage";

import Signup from "./pages/SignupPage";
import Login from "./pages/LoginPage";

import useAuthStore from "./store/authStore";

// GENERATE MEAL PLAN PAGES:
import SetupAccountPage from "./pages/SetupAccountPage";
import YourDietPage from "./pages/YourDietPage";
import CaloriesApplicationPage from "./pages/CaloriesApplicationPage";
import CaloriesResultPage from "./pages/CaloriesResultPage";
import DietaryTypePage from "./pages/DietaryTypePage";
import MealTypePage from "./pages/MealTypePage";
import NumberOfDaysPage from "./pages/NumberOfDaysPage";
import MealPlanResultPage from "./pages/MealPlanResultPage";

// CUSTOM PAGES:
import CustomMainPage from "./pages/custom/CustomMainPage";
import CustomTypeSelectorPage from "./pages/custom/CustomTypeSelectorPage";
import IngredientRestrictionPage from "./pages/custom/IngredientRestrictionPage";
import IngredientRestrictionResultPage from "./pages/custom/IngredientRestrictionResultPage";
import CalorieNutrientPage from "./pages/custom/CalorieNutrientPage";
import CalorieNutrientResultPage from "./pages/custom/CalorieNutrientResultPage";

// USER PAGES:
import CustomRecipesPage from "./pages/CustomRecipesPage";
import DietNutritionPage from "./pages/DietNutritionPage";
import MealsSchedulePage from "./pages/MealsSchedulePage";
import PhysicalStats from "./pages/PhysicalStats";
import HelpPage from "./pages/HelpPage";
import UpdateProfilePage from "./pages/UpdateUserProfilePage";
import MyMealPlansPage from "./pages/MyMealPlansPage";

// CHATBOT:
import Chatbot from "./pages/ChatbotPage";
import ChatbotHistoryPage from "./pages/ChatbotHistoryPage";

// FOOTER PAGES:
import HowItWorksPage from "./pages/MorePages/HowItWorksPage";
import ReviewsPage from "./pages/MorePages/ReviewsPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfUse from "./pages/TermsOfUse";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}

function App() {
  const fetchUser = useAuthStore((state) => state.fetchUser);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-crave-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <ScrollToTop />
      <MobileNavProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <Layout>
                  <About />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/contact"
            element={
              <ProtectedRoute>
                <Layout>
                  <Contact />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/ingredients"
            element={
              <ProtectedRoute>
                <Layout>
                  <Ingredients />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/meal-planner"
            element={
              <ProtectedRoute>
                <MealPlanner />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-meal-plans"
            element={
              <ProtectedRoute>
                <Layout>
                  <MyMealPlansPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/privacy"
            element={
              <ProtectedRoute>
                <Layout>
                  <PrivacyPolicy />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/terms"
            element={
              <ProtectedRoute>
                <Layout>
                  <TermsOfUse />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/setup-account"
            element={
              <ProtectedRoute>
                <Layout>
                  <SetupAccountPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/your-diet"
            element={
              <ProtectedRoute>
                <Layout>
                  <YourDietPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/calories-application"
            element={
              <ProtectedRoute>
                <Layout>
                  <CaloriesApplicationPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/calories-result"
            element={
              <ProtectedRoute>
                <Layout>
                  <CaloriesResultPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dietary-type"
            element={
              <ProtectedRoute>
                <Layout>
                  <DietaryTypePage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/meal-type"
            element={
              <ProtectedRoute>
                <Layout>
                  <MealTypePage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/number-of-days"
            element={
              <ProtectedRoute>
                <Layout>
                  <NumberOfDaysPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/meal-plan-result"
            element={
              <ProtectedRoute>
                <Layout>
                  <MealPlanResultPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/custom-category"
            element={
              <ProtectedRoute>
                <CustomMainPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/custom-category/options"
            element={
              <ProtectedRoute>
                <Layout>
                  <CustomTypeSelectorPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/custom-category/ingredient-restriction"
            element={
              <ProtectedRoute>
                <Layout>
                  <IngredientRestrictionPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/custom-category/ingredient-restriction-result"
            element={
              <ProtectedRoute>
                <Layout>
                  <IngredientRestrictionResultPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/custom-category/calorie-nutrient"
            element={
              <ProtectedRoute>
                <Layout>
                  <CalorieNutrientPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/custom-category/calorie-nutrient-result"
            element={
              <ProtectedRoute>
                <Layout>
                  <CalorieNutrientResultPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/custom-recipes"
            element={
              <ProtectedRoute>
                <Layout>
                  <CustomRecipesPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/diet-nutrition"
            element={
              <ProtectedRoute>
                <Layout>
                  <DietNutritionPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/meals-schedule"
            element={
              <ProtectedRoute>
                <Layout>
                  <MealsSchedulePage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/physical-stats"
            element={
              <ProtectedRoute>
                <Layout>
                  <PhysicalStats />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/help"
            element={
              <ProtectedRoute>
                <Layout>
                  <HelpPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/how-it-works"
            element={
              <ProtectedRoute>
                <Layout>
                  <HowItWorksPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reviews"
            element={
              <ProtectedRoute>
                <Layout>
                  <ReviewsPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/chatbot"
            element={
              <ProtectedRoute>
                <Chatbot />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chatbot/history"
            element={
              <ProtectedRoute>
                <Layout>
                  <ChatbotHistoryPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/update-profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <UpdateProfilePage />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Redirect root to signup */}
          <Route path="*" element={<Navigate to="/signup" replace />} />
        </Routes>
        <ToastContainer position="top-center" autoClose={3000} />
      </MobileNavProvider>
    </Router>
  );
}

export default App;
