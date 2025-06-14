import React from "react";
import { Link } from "react-router-dom";
import { FaChartLine, FaCheckCircle, FaUtensils } from "react-icons/fa";

const HowItWorksPage = () => {
  return (
    <div className="min-h-screen text-[#333] bg-white px-6 py-16">
      <div className="max-w-7xl mx-auto space-y-20">
        {/* Title */}
        <div className="text-center space-y-4">
          <h1
            className="text-3xl md:text-4xl font-extrabold text-orange-500 drop-shadow-sm"
            style={{
              fontFamily: `'Dancing Script', 'Pacifico', 'Great Vibes', cursive, 'Playfair Display', serif`,
            }}
          >
            How We Automate Your Meal Planning
          </h1>
          <div className="mt-3"></div>
          <p className="text-xl text-gray-600 italic">
            (And put you in control of your diet!)
          </p>
          <div className="w-24 h-1 bg-orange-500 mx-auto rounded-full" />
        </div>

        {/* Benefits List */}
        <ul className="list-disc list-inside space-y-4 text-lg text-gray-700 max-w-4xl mx-auto">
          <li>Turn meal planning into an effortless magical experience</li>
          <li>Access a personalized library of healthy, delicious recipes</li>
          <li>Get auto-generated plans tailored to your goals and diet</li>
          <li>Save time on grocery shopping with smart ingredient lists</li>
          <li>No manual tracking — we calculate it all for you</li>
        </ul>

        {/* Stats Section */}
        <div className="text-center space-y-8">
          <h2 className="text-4xl font-bold text-orange-500">
            People Love Custom Crave
          </h2>
          <div className="grid sm:grid-cols-3 gap-10">
            {[
              [
                <FaCheckCircle className="text-5xl text-green-500 mb-3" />,
                "Happy Planners",
              ],
              [
                <FaUtensils className="text-5xl text-orange-400 mb-3" />,
                "Meals Generated",
              ],
              [
                <FaChartLine className="text-5xl text-blue-400 mb-3" />,
                "Calories Tracked",
              ],
            ].map(([icon, label], i) => (
              <div
                key={i}
                className="bg-white border border-orange-200 p-6 rounded-xl shadow-md flex flex-col items-center"
              >
                {icon}
                <p className="text-lg font-medium text-gray-700">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Did You Know Box */}
        <div className="bg-white border border-orange-200 rounded-xl p-8 shadow-xl max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-orange-500 mb-4">
            DID YOU KNOW?
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            We have a database of over{" "}
            <span className="text-orange-500 font-bold">1500 recipes</span> and{" "}
            <span className="text-orange-500 font-bold">10,000 foods</span>!
            Custom Crave lets you instantly search and view detailed nutrition
            info for everything. It’s like a smart label for every meal — and no
            tracking needed 😊
          </p>
        </div>

        {/* 5-Step Guide */}
        <div className="space-y-8">
          <h2 className="text-4xl font-bold text-orange-500 text-center">
            Get Started In 5 Easy Steps
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              [
                "1. Calculate",
                "Tell us your age, weight, height, activity level & goal. We'll calculate your daily calories.",
              ],
              [
                "2. Create",
                "Pick your preferences and days. We’ll auto-generate a meal plan instantly.",
              ],
              [
                "3. Collect",
                "Don’t like a meal? Swap it. Then shop ingredients online from Daraz, Carrefour, or Metro.",
              ],
              [
                "4. Cook",
                "Enjoy guided cooking with simple, easy-to-follow steps for every recipe.",
              ],
              [
                "5. Conquer!",
                "Track your progress, repeat meals you love, and hit your health targets.",
              ],
            ].map(([title, desc], i) => (
              <div
                key={i}
                className="bg-white border border-orange-200 p-6 rounded-xl hover:shadow-xl hover:ring-2 hover:ring-orange-300 transition duration-300"
              >
                <h3 className="text-xl font-bold text-orange-500 mb-2">
                  {title}
                </h3>
                <p className="text-gray-700">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Motivation Block */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-4xl font-extrabold text-orange-500">
            Everything You Need To Stay On Track
          </h2>
          <p className="text-lg text-gray-600">
            Planning increases your chance of success. Let Custom Crave generate
            your meals so you stay focused and stress-free.
          </p>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link
            to="/signup"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-10 rounded-full shadow-md transition duration-300"
          >
            Start A Free Account →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksPage;
