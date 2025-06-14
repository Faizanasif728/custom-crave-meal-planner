import React from "react";
import { motion } from "framer-motion";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import { useNavigate } from "react-router-dom";
import ingredientsImage from "../../src/assets/ingredients.jpeg";
import mealPlanImage from "../../src/assets/mealplan.jpeg";
import nutritionImage from "../../src/assets/nutrition.jpeg";

const faqs = [
  {
    question: "How does the Custom Crave meal planner work?",
    answer:
      "Custom Crave uses advanced algorithms to generate personalized meal plans based on your preferences. First, you'll input your weight goals and dietary preferences. Then, our system calculates your daily calorie needs using the Mifflin-St Jeor Equation. Finally, we create a balanced meal plan that matches your requirements, ensuring all meals are Halal and suitable for users in Pakistan.",
  },
  {
    question: "Can I search meals by ingredients or nutrients?",
    answer:
      "Yes! Our Custom Meal Generator offers two powerful search options. You can search by main ingredient and specify your dietary restrictions to find suitable recipes. Alternatively, you can search by calories and specific nutrients like protein, carbs, or fats. This flexibility helps you find meals that perfectly match your nutritional goals and preferences.",
  },
  {
    question: "Are all meals Halal?",
    answer:
      "Absolutely. Every meal in our database is carefully curated to be 100% Halal. We understand the importance of Halal dietary requirements in Pakistan, so we ensure all ingredients and preparation methods comply with Halal standards. Our team regularly reviews and verifies each recipe to maintain this commitment.",
  },
  {
    question: "Can I save and revisit my meal plans later?",
    answer:
      "Yes! As a registered user, you have access to a personal dashboard where you can save all your meal plans. You can revisit your plans anytime, make modifications, or generate new ones. This feature helps you track your progress and maintain consistency in your dietary journey.",
  },
  {
    question: "What types of diets are supported?",
    answer:
      "We support a wide range of dietary preferences including Keto, Vegan, Mediterranean, Vegetarian, Non-Vegetarian, and Paleo. Each diet type is carefully curated with healthy options that maintain nutritional balance. Our system also allows for custom combinations of these diets to accommodate specific dietary needs and restrictions.",
  },
  {
    question: "How is my daily calorie need calculated?",
    answer:
      "We use the scientifically validated Mifflin-St Jeor Equation to calculate your Basal Metabolic Rate (BMR). This calculation considers your age, gender, weight, and height. Then, we adjust this number based on your activity level and weight goals (maintenance, loss, or gain) to determine your optimal daily calorie intake. This ensures your meal plan is perfectly tailored to your needs.",
  },
];

const HelpPage = () => {
  const navigate = useNavigate();

  const handleFeatureClick = (feature) => {
    switch (feature) {
      case "ingredients":
        navigate("/ingredients");
        break;
      case "meal-planner":
        navigate("/meal-planner");
        break;
      case "my-meal-plans":
        navigate("/my-meal-plans");
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#333] py-16 px-6">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-5xl font-extrabold text-orange-500 text-center mb-10"
          style={{
            fontFamily: "'Dancing Script', cursive",
            letterSpacing: "0.05em",
            lineHeight: "1.2",
            textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          Help & Support
        </h1>
        <p className="text-center text-lg text-gray-600 mb-16">
          Need help navigating Custom Crave? Browse our FAQs and get the answers
          to your questions.
        </p>

        {/* FAQs */}
        <div className="w-full max-w-4xl mx-auto">
          {faqs.map((faq, idx) => (
            <Disclosure key={idx}>
              {({ open }) => (
                <div>
                  <Disclosure.Button className="flex justify-between w-full px-6 py-4 mb-4 text-left text-lg font-semibold text-orange-500 bg-orange-100 rounded-lg hover:bg-orange-200 transition-all">
                    <div className="flex items-center">
                      <span className="font-bold mr-2">Question:</span> {faq.question}
                    </div>
                    <ChevronUpIcon
                      className={`${
                        open ? "rotate-180" : ""
                      } w-5 h-5 text-orange-500 transition-transform flex-shrink-0`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-6 pb-4 text-gray-700">
                    <p className="text-justify"><span className="font-bold">Answer:</span> {faq.answer}</p>
                  </Disclosure.Panel>
                </div>
              )}
            </Disclosure>
          ))}
        </div>

        {/* Features Section */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-orange-500 mb-6 text-center">
            Discover Our Key Features
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Buy Ingredients from stores", img: ingredientsImage, feature: "ingredients" },
              { title: "Nutrient-Powered Meal Plans", img: nutritionImage, feature: "meal-planner" },
              { title: "Save Personalized Plans", img: mealPlanImage, feature: "my-meal-plans" },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-orange-50 border border-orange-200 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
                onClick={() => handleFeatureClick(item.feature)}
              >
                <div className="w-full aspect-w-16 aspect-h-9 overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-lg font-bold text-orange-500">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-2">
                    Explore this feature inside our multi-step planner today!
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HelpPage;
