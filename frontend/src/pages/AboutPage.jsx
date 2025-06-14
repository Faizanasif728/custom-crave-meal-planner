import React from "react";
import { motion } from "framer-motion";
import { FaLeaf, FaUtensils, FaHeartbeat, FaUsers } from "react-icons/fa";
import introductionImage from "../assets/introduction.jpeg";
import missionImage from "../assets/mission.jpeg";

const features = [
  {
    icon: <FaLeaf className="text-orange-500 text-3xl" />,
    title: "Eco-Friendly",
    description:
      "We prioritize sustainability by promoting eco-conscious meals and reducing food waste.",
  },
  {
    icon: <FaUtensils className="text-orange-500 text-3xl" />,
    title: "Personalized Meals",
    description:
      "Meal plans tailored to your dietary lifestyle and health goals using smart tech.",
  },
  {
    icon: <FaHeartbeat className="text-orange-500 text-3xl" />,
    title: "Health-Focused",
    description:
      "Balanced nutrition with macros in mind, promoting wellness across Pakistan.",
  },
  {
    icon: <FaUsers className="text-orange-500 text-3xl" />,
    title: "Community Support",
    description:
      "You're not alone—join others striving for mindful, healthy eating habits.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen px-6 py-16 bg-white text-gray-900">
      {/* Page Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-4xl md:text-5xl font-extrabold text-orange-500 text-center drop-shadow-sm"
        style={{
          fontFamily: `'Dancing Script', 'Pacifico', 'Great Vibes', cursive, 'Playfair Display', serif`,
        }}
      >
        About
      </motion.h1>
      <div className="mt-3"></div>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-center text-lg text-gray-600 max-w-3xl mx-auto mb-20"
      >
        Discover how we're transforming meal planning in Pakistan with
        personalization, cultural relevance, and healthy AI-driven choices.
      </motion.p>

      {/* Introduction Section - Slide in from left */}
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col md:flex-row items-center justify-between gap-10 mb-24 max-w-6xl mx-auto"
      >
        <motion.div
          className="w-full md:w-1/2 lg:w-2/5"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <img
            src={introductionImage}
            alt="Introduction"
            className="w-full h-auto rounded-lg shadow-md object-cover"
            style={{ maxHeight: "400px" }}
          />
        </motion.div>
        <div className="w-full md:w-1/2 lg:w-3/5 space-y-4">
          <h2 className="text-3xl font-bold text-orange-500">
            Our Introduction
          </h2>
          <div className="text-gray-700 text-lg leading-relaxed text-justify space-y-4">
            <p>
              Custom Crave is your intelligent meal planner, engineered
              specifically for the cultural and nutritional needs of Pakistan.
              We understand that achieving health goals isn't just about
              numbers—it's about sustaining habits and making meaningful
              lifestyle changes that last.
            </p>
            <p>
              Our innovative platform seamlessly integrates traditional
              ingredients, modern nutritional science, and advanced AI
              technology to recommend meals that are not only nutritious and
              aligned with your goals but also practical and easy to prepare.
              Whether you're managing weight, pursuing specific fitness
              objectives, or simply striving for better eating habits—we
              personalize every aspect of your journey.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Why Choose Us - Fade in and scale up */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-20"
      >
        <h2 className="text-3xl font-bold text-orange-500 mb-10">
          Why Choose Us
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {features.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-100 p-6 rounded-xl shadow-md hover:shadow-lg transition"
            >
              <div className="flex justify-center mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Mission Section - Slide in from right */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col md:flex-row-reverse items-center justify-between gap-10 max-w-6xl mx-auto"
      >
        <motion.div
          className="w-full md:w-1/2 lg:w-2/5"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <img
            src={missionImage}
            alt="Our Mission"
            className="w-full h-auto rounded-lg shadow-md object-cover"
            style={{ maxHeight: "400px" }}
          />
        </motion.div>
        <div className="w-full md:w-1/2 lg:w-3/5 space-y-4">
          <h2 className="text-3xl font-bold text-orange-500">Our Mission</h2>
          <div className="text-gray-700 text-lg leading-relaxed text-justify space-y-4">
            <p>
              We are committed to empowering every household in Pakistan with
              the essential tools and knowledge needed to embrace a healthier
              lifestyle. Recognizing that nutrition is not a one-size-fits-all
              solution, we provide you with complete control over your dietary
              choices, meal planning strategies, and progress tracking
              mechanisms.
            </p>
            <p>
              Custom Crave represents the perfect fusion of simplicity and
              precision—offering not just meal suggestions but a comprehensive
              approach to living well through informed daily food choices. Our
              platform is designed to make healthy eating accessible, enjoyable,
              and sustainable for everyone. Your health and well-being are at
              the heart of our mission, and we're dedicated to supporting you
              every step of the way on your journey to better nutrition.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default About;
