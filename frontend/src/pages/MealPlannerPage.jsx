import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./CSS/shared.css";
import "./CSS/pages.css";

const fadeInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
};
const fadeInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
};
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const MealPlanner = () => {
  // Animated title logic
  const title = "How & Why We Personalize Your Meal Plan";
  const titleRef = useRef(null);
  const isInView = useInView(titleRef, { once: true, margin: "-100px" });

  const renderAnimatedTitle = () => (
    <span ref={titleRef} style={{ display: "inline-block" }}>
      {title.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{
            delay: isInView ? 0.04 * i : 0,
            duration: 0.35,
            type: "spring",
            stiffness: 80,
          }}
          style={{ display: "inline-block" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header>
        <Navbar />
      </header>

      {/* Main Content with Wavy Background */}
      <div className="relative flex-1 min-h-screen">
        {/* Wavy Background */}
        <div className="box"></div>
        {/* Centered Content */}
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
          {/* Animated Heading */}
          <motion.h1
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-extrabold text-orange-500 text-center drop-shadow-sm"
            style={{
              fontFamily: `'Dancing Script', 'Pacifico', 'Great Vibes', cursive, 'Playfair Display', serif`,
            }}
          >
            Plan Your Meals
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
            className="mt-4 text-lg md:text-xl text-gray-700 text-center max-w-2xl"
            style={{ textAlign: "justify" }}
          >
            Create your personalized meal plan in seconds!
          </motion.p>

          {/* Continue Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <motion.div
              whileHover={{
                scale: 1.08,
                boxShadow: "0 8px 32px rgba(255,140,0,0.15)",
              }}
              whileTap={{ scale: 0.97 }}
            >
              <Link
                to="/setup-account"
                className="inline-block text-lg sm:text-xl font-bold text-white bg-orange-500 hover:bg-orange-600 focus:ring-4 focus:ring-orange-300 focus:outline-none rounded-full px-8 py-3 shadow-md transition-transform"
              >
                Continue
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Explanation Section */}
      <section className="max-w-5xl mx-auto px-6 py-14 space-y-14 relative z-20">
        <motion.h2
          initial={false}
          animate={false}
          className="text-3xl md:text-4xl font-extrabold text-orange-500 text-center drop-shadow-sm"
          style={{
            fontFamily: `'Dancing Script', 'Pacifico', 'Great Vibes', cursive, 'Playfair Display', serif`,
          }}
        >
          {renderAnimatedTitle()}
        </motion.h2>
        <div className="mt-3"></div>
        <div className="grid md:grid-cols-2 gap-12">
          {/* Left Column */}
          <motion.div
            variants={fadeInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-10"
          >
            {/* Calorie Calculation */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex items-start gap-4"
            >
              <motion.span
                initial={{ rotate: -20, scale: 0.8 }}
                whileInView={{ rotate: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-orange-100 rounded-full p-3 mt-1"
              >
                <svg
                  className="w-7 h-7 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </motion.span>
              <div>
                <h3 className="text-2xl font-bold text-orange-400 mb-1">
                  How We Calculate Calories
                </h3>
                <p
                  className="text-gray-700 text-lg"
                  style={{ textAlign: "justify" }}
                >
                  We use your age, weight, height, gender, activity level, and
                  health goal to estimate your daily calorie needs using the{" "}
                  <span className="font-semibold text-orange-500">
                    Mifflin-St Jeor Equation
                  </span>
                  . This ensures your meal plan is scientifically tailored for
                  you.
                </p>
                <ul
                  className="list-disc list-inside text-gray-600 mt-2 space-y-1"
                  style={{ textAlign: "justify" }}
                >
                  <motion.li
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                  >
                    Prevents under- or overeating
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7 }}
                  >
                    Supports healthy weight management
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 }}
                  >
                    Optimizes energy for your lifestyle
                  </motion.li>
                </ul>
              </div>
            </motion.div>
            {/* Why Calculate Calories */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex items-start gap-4"
            >
              <motion.span
                initial={{ rotate: -10, scale: 0.8 }}
                whileInView={{ rotate: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-orange-100 rounded-full p-3 mt-1"
              >
                <svg
                  className="w-7 h-7 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </motion.span>
              <div>
                <h3 className="text-2xl font-bold text-orange-400 mb-1">
                  Why Calorie Calculation Matters
                </h3>
                <p
                  className="text-gray-700 text-lg"
                  style={{ textAlign: "justify" }}
                >
                  Calculating calories helps you make informed food choices,
                  achieve your health goals, and maintain balanced nutrition. It
                  empowers you to:
                </p>
                <ul
                  className="list-disc list-inside text-gray-600 mt-2 space-y-1"
                  style={{ textAlign: "justify" }}
                >
                  <motion.li
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                  >
                    Reach your target weight
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7 }}
                  >
                    Improve energy and focus
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 }}
                  >
                    Build healthy, sustainable habits
                  </motion.li>
                </ul>
              </div>
            </motion.div>
            {/* Dietary Preferences */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex items-start gap-4"
            >
              <motion.span
                initial={{ rotate: -5, scale: 0.8 }}
                whileInView={{ rotate: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-orange-100 rounded-full p-3 mt-1"
              >
                <svg
                  className="w-7 h-7 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 12l2 2 4-4" />
                </svg>
              </motion.span>
              <div>
                <h3 className="text-2xl font-bold text-orange-400 mb-1">
                  Why We Ask Dietary Preferences
                </h3>
                <p
                  className="text-gray-700 text-lg"
                  style={{ textAlign: "justify" }}
                >
                  Your dietary type (e.g., Vegetarian, Keto, Desi) ensures your
                  plan respects your culture, beliefs, and health needs—making
                  it enjoyable and easy to follow.
                </p>
              </div>
            </motion.div>
          </motion.div>
          {/* Right Column */}
          <motion.div
            variants={fadeInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-10"
          >
            {/* Meal Type */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex items-start gap-4"
            >
              <motion.span
                initial={{ rotate: 20, scale: 0.8 }}
                whileInView={{ rotate: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-orange-100 rounded-full p-3 mt-1"
              >
                <svg
                  className="w-7 h-7 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 12l2 2 4-4" />
                </svg>
              </motion.span>
              <div>
                <h3 className="text-2xl font-bold text-orange-400 mb-1">
                  Why Choose Meal Types?
                </h3>
                <p
                  className="text-gray-700 text-lg"
                  style={{ textAlign: "justify" }}
                >
                  Select which meals you want to include (Breakfast, Lunch,
                  Dinner, Snacks). This lets us create a plan that fits your
                  daily routine and eating habits—no wasted meals!
                </p>
              </div>
            </motion.div>
            {/* Number of Days */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex items-start gap-4"
            >
              <motion.span
                initial={{ rotate: 10, scale: 0.8 }}
                whileInView={{ rotate: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-orange-100 rounded-full p-3 mt-1"
              >
                <svg
                  className="w-7 h-7 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 7V3M16 7V3M4 11h16M4 19h16M4 15h16" />
                </svg>
              </motion.span>
              <div>
                <h3 className="text-2xl font-bold text-orange-400 mb-1">
                  Why Pick Number of Days?
                </h3>
                <p
                  className="text-gray-700 text-lg"
                  style={{ textAlign: "justify" }}
                >
                  Choose how many days you want your plan to cover. This gives
                  you flexibility—plan for a week, a few days, or just one day
                  at a time!
                </p>
              </div>
            </motion.div>
            {/* Conclusion */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex items-start gap-4"
            >
              <motion.span
                initial={{ rotate: 10, scale: 0.8 }}
                whileInView={{ rotate: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-orange-100 rounded-full p-3 mt-1"
              >
                <svg
                  className="w-7 h-7 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 20l9-5-9-5-9 5 9 5z" />
                  <path d="M12 12V4" />
                </svg>
              </motion.span>
              <div>
                <h3 className="text-2xl font-bold text-orange-400 mb-1">
                  Your Personalized Meal Plan
                </h3>
                <p
                  className="text-gray-700 text-lg"
                  style={{ textAlign: "justify" }}
                >
                  Based on your answers,{" "}
                  <span className="font-semibold text-orange-500">
                    Custom Crave
                  </span>{" "}
                  instantly generates a meal plan that's nutritionally balanced,
                  culturally relevant, and tailored to your goals. Enjoy
                  delicious recipes, clear nutrition info, and a plan you'll
                  love to follow!
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#fff3e6] text-gray-700">
        <Footer />
      </footer>
    </div>
  );
};

export default MealPlanner;
