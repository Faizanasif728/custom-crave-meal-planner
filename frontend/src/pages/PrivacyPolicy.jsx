import React from "react";
import { motion } from "framer-motion";
import { FaShieldAlt, FaUserLock, FaListUl, FaDatabase } from "react-icons/fa";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen text-[#333] py-16 px-6 bg-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <h1
            className="text-3xl md:text-4xl font-extrabold text-orange-500 mb-4"
            style={{
              fontFamily: `'Dancing Script', 'Pacifico', 'Great Vibes', cursive, 'Playfair Display', serif`,
            }}
          >
            🔒 Our Privacy Promise
          </h1>
          <div className="mt-3"></div>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            At{" "}
            <span className="font-semibold text-orange-500">Custom Crave</span>,
            your trust means everything to us. Here's how we protect your
            personal information while serving you the best personalized meal
            plans.
          </p>
        </div>

        {/* Section 1 */}
        <div className="bg-white rounded-xl shadow border border-orange-200 p-8 mb-10">
          <div className="flex items-center mb-4 text-orange-500 text-2xl font-bold">
            <FaListUl className="mr-3" /> 1. What We Collect
          </div>
          <p className="text-gray-700 leading-relaxed">
            We collect your name, email, age, gender, dietary preferences,
            activity level, health goals, saved meal plans, favorite
            ingredients, and optionally your profile image.
          </p>
        </div>

        {/* Section 2 */}
        <div className="bg-white rounded-xl shadow border border-orange-200 p-8 mb-10">
          <div className="flex items-center mb-4 text-orange-500 text-2xl font-bold">
            <FaDatabase className="mr-3" /> 2. How We Use Your Data
          </div>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>To calculate your personalized calorie needs.</li>
            <li>To generate dynamic meal plans and custom recipes.</li>
            <li>To store preferences and allow meal plan saving.</li>
            <li>To enhance your experience with tailored suggestions.</li>
          </ul>
        </div>

        {/* Section 3 */}
        <div className="bg-white rounded-xl shadow border border-orange-200 p-8 mb-10">
          <div className="flex items-center mb-4 text-orange-500 text-2xl font-bold">
            <FaShieldAlt className="mr-3" /> 3. How We Protect You
          </div>
          <p className="text-gray-700 leading-relaxed">
            Your data is encrypted and stored securely. We follow best practices
            to prevent unauthorized access, alteration, or disclosure.
            Authentication is managed through secure tokens and session
            validation.
          </p>
        </div>

        {/* Section 4 */}
        <div className="bg-white rounded-xl shadow border border-orange-200 p-8 mb-10">
          <div className="flex items-center mb-4 text-orange-500 text-2xl font-bold">
            <FaUserLock className="mr-3" /> 4. Your Rights & Choices
          </div>
          <p className="text-gray-700 leading-relaxed">
            You may view, update, or delete your profile at any time. You can
            also revoke access to saved plans or stop data collection by
            deactivating your account via the profile settings.
          </p>
        </div>

        {/* Section 5 */}
        <div className="bg-white rounded-xl shadow border border-orange-200 p-8">
          <div className="text-xl font-bold text-orange-500 mb-4">
            Need Help or Have Questions?
          </div>
          <p className="text-gray-700">
            We're happy to assist. Email us at{" "}
            <a
              href="mailto:info@customcrave.com"
              className="text-blue-500 hover:underline"
            >
              info@customcrave.com
            </a>{" "}
            or visit our Help section. We’re committed to privacy and
            transparency.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default PrivacyPolicy;
