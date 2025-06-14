import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../CSS/shared.css";
import "../CSS/pages.css";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.7, ease: "easeOut" },
  }),
};

const CustomMainPage = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate("/custom-category/options");
  };

  // Animated title logic
  const title = "Two Powerful Ways to Create Your Custom Meal";
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
            delay: isInView ? 0.03 * i : 0,
            duration: 0.4,
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
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-extrabold text-orange-500 text-center drop-shadow-sm"
            style={{
              fontFamily: `'Dancing Script', 'Pacifico', 'Great Vibes', cursive, 'Playfair Display', serif`,
            }}
          >
            Create Custom Meal
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
            className="mt-4 text-lg md:text-xl text-gray-700 text-center max-w-2xl"
            style={{ textAlign: "justify" }}
          >
            Generate a unique meal suggestion based on your own preferences.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <motion.button
              whileHover={{
                scale: 1.08,
                boxShadow: "0 8px 32px rgba(255,140,0,0.15)",
              }}
              whileTap={{ scale: 0.97 }}
              onClick={handleContinue}
              className="inline-block text-lg sm:text-xl font-bold text-white bg-orange-500 hover:bg-orange-600 focus:ring-4 focus:ring-orange-300 focus:outline-none rounded-full px-8 py-3 shadow-md transition-transform"
            >
              Continue
            </motion.button>
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
          {/* First Category */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
            className="space-y-10"
          >
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
                  <path d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20zm0 0v8l6 3" />
                </svg>
              </motion.span>
              <div>
                <h3 className="text-2xl font-bold text-orange-400 mb-1">
                  1. By Ingredient or Dietary Restriction
                </h3>
                <p
                  className="text-gray-700 text-lg"
                  style={{ textAlign: "justify" }}
                >
                  Choose your favorite or main ingredient, or select one or more
                  dietary restrictions (like low-carbs, egg-free, gluten-free,
                  etc.). We'll craft meal suggestions that revolve around what
                  you love or need, ensuring every meal is both enjoyable and
                  suitable for your lifestyle.
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
                    Discover new recipes based on your favorite foods
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7 }}
                  >
                    Stay true to your dietary needs and preferences
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 }}
                  >
                    Never get bored—explore creative meal ideas
                  </motion.li>
                </ul>
              </div>
            </motion.div>
          </motion.div>
          {/* Second Category */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={2}
            className="space-y-10"
          >
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
                  <path d="M12 8v4l3 3" />
                </svg>
              </motion.span>
              <div>
                <h3 className="text-2xl font-bold text-orange-400 mb-1">
                  2. By Targeted Calories & Nutrients
                </h3>
                <p
                  className="text-gray-700 text-lg"
                  style={{ textAlign: "justify" }}
                >
                  Set your target calories, select specific nutrient types (like
                  protein, carbs, fats, fiber, or sodium), and define their
                  values in grams or milligrams. We'll generate meal options
                  that precisely match your nutritional goals—perfect for
                  fitness, health, or medical needs.
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
                    Meet your daily calorie and nutrient targets
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7 }}
                  >
                    Customize for weight gain/loss, or balanced health
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 }}
                  >
                    Take control of your nutrition, down to the detail
                  </motion.li>
                </ul>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Why & How Section */}
        <div className="mt-12 space-y-10">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex items-start gap-4"
          >
            <motion.span
              initial={{ rotate: -10, scale: 0.8 }}
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
                <path d="M13 16h-1v-4h-1m1-4h.01" />
                <circle cx="12" cy="12" r="10" />
              </svg>
            </motion.span>
            <div>
              <h3 className="text-2xl font-bold text-orange-400 mb-1">
                Why Do We Offer These Customizations?
              </h3>
              <p
                className="text-gray-700 text-lg"
                style={{ textAlign: "justify" }}
              >
                Everyone's food journey is unique. By letting you choose either
                your favorite ingredients or your exact nutrition targets, we
                make meal planning fun, flexible, and truly personal. This
                approach helps you stay engaged, discover new foods, and stick
                to your goals—because your meals should fit your life, not the
                other way around.
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex items-start gap-4"
          >
            <motion.span
              initial={{ rotate: 10, scale: 0.8 }}
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
                <path d="M12 20l9-5-9-5-9 5 9 5z" />
                <path d="M12 12V4" />
              </svg>
            </motion.span>
            <div>
              <h3 className="text-2xl font-bold text-orange-400 mb-1">
                How Does This Help You?
              </h3>
              <p
                className="text-gray-700 text-lg"
                style={{ textAlign: "justify" }}
              >
                Our smart meal generator uses your selections to instantly
                create meal ideas you'll actually want to eat. Whether you're
                exploring new ingredients, managing allergies, or tracking
                macros, you'll always have options that match your needs. This
                keeps meal planning exciting and helps you build healthy habits
                that last.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Conclusion */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-12 text-center"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-orange-500 mb-4 font-playfair">
            Start Your Custom Meal Journey!
          </h3>
          <p
            className="text-gray-800 text-lg max-w-2xl mx-auto"
            style={{ textAlign: "justify" }}
          >
            With{" "}
            <span className="font-semibold text-orange-500">Custom Crave</span>,
            you're in control. Choose your path, set your preferences, and let
            us inspire you with meals that are as unique as you are. The more
            you explore, the more you'll love planning—and eating—your next
            meal!
          </p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-[#fff3e6] text-gray-700">
        <Footer />
      </footer>
    </div>
  );
};

export default CustomMainPage;
