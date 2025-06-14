import React from "react";
import { motion } from "framer-motion";
import {
  FaGavel,
  FaClipboardCheck,
  FaShieldAlt,
  FaSyncAlt,
} from "react-icons/fa";

const TermsOfUse = () => {
  return (
    <div className="min-h-screen text-[#333] bg-white py-16 px-6">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
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
            📜 Terms of Use
          </h1>
          <div className="mt-3"></div>
          <p className="text-lg text-gray-700">
            Please read these terms carefully before using{" "}
            <span className="text-orange-500 font-bold">Custom Crave</span>.
          </p>
        </div>

        {/* Section 1 */}
        <div className="bg-white border border-orange-200 rounded-xl shadow-lg p-8 mb-10">
          <div className="flex items-center mb-4 text-orange-500 text-2xl font-bold">
            <FaClipboardCheck className="mr-3" /> 1. Acceptance of Terms
          </div>
          <p className="text-gray-700 leading-relaxed">
            By accessing and using our platform, you agree to these Terms of
            Use. If you do not agree with any part of the terms, please refrain
            from using the service.
          </p>
        </div>

        {/* Section 2 */}
        <div className="bg-white border border-orange-200 rounded-xl shadow-lg p-8 mb-10">
          <div className="flex items-center mb-4 text-orange-500 text-2xl font-bold">
            <FaGavel className="mr-3" /> 2. Use of Services
          </div>
          <p className="text-gray-700 leading-relaxed">
            Our platform is designed for personal wellness use only. Commercial
            use, redistribution, scraping, or duplication of content is strictly
            prohibited unless granted permission.
          </p>
        </div>

        {/* Section 3 */}
        <div className="bg-white border border-orange-200 rounded-xl shadow-lg p-8 mb-10">
          <div className="flex items-center mb-4 text-orange-500 text-2xl font-bold">
            <FaShieldAlt className="mr-3" /> 3. Intellectual Property
          </div>
          <p className="text-gray-700 leading-relaxed">
            All platform content, including recipes, nutritional data, images,
            code, and interface designs, belong to Custom Crave. Unauthorized
            usage or distribution is not allowed.
          </p>
        </div>

        {/* Section 4 */}
        <div className="bg-white border border-orange-200 rounded-xl shadow-lg p-8 mb-10">
          <div className="flex items-center mb-4 text-orange-500 text-2xl font-bold">
            <FaSyncAlt className="mr-3" /> 4. Changes to Terms
          </div>
          <p className="text-gray-700 leading-relaxed">
            We may modify these Terms at any time. Continued use after changes
            are published means you agree to the updated terms. We'll notify
            users for major policy updates.
          </p>
        </div>

        {/* Section 5 */}
        <div className="bg-white border border-orange-200 rounded-xl shadow-lg p-8">
          <h3 className="text-xl font-bold text-orange-500 mb-2">
            Need More Info?
          </h3>
          <p className="text-gray-700">
            For any questions regarding these terms or your use of the Custom
            Crave platform, contact us at{" "}
            <a
              href="mailto:info@customcrave.com"
              className="text-blue-500 hover:underline"
            >
              info@customcrave.com
            </a>
            . We’re here to help!
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default TermsOfUse;
