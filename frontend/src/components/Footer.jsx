import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#fff3e6] text-gray-700 px-6 pt-16 pb-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start text-center md:text-left gap-12">
        {/* Branding */}
        <div className="md:w-1/3 space-y-3 flex flex-col items-center md:items-start">
          <div className="flex items-center gap-3">
            <img
              src="/assets/logo.png"
              alt="Custom Crave Logo"
              className="h-12 w-12 rounded-full object-cover shadow-md"
            />
            <div className="flex flex-col">
              <span className="text-3xl font-extrabold tracking-tight text-orange-500 font-playfair">
                CustomCrave
              </span>
              <span
                className="text-2xl sm:text-3xl text-orange-400"
                style={{
                  fontFamily: "'Dancing Script', cursive",
                  letterSpacing: "0.05em",
                  lineHeight: "1.2",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.08)",
                }}
              >
                Meal Planner
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed max-w-xs">
            Your personalized meal planner tailored to healthy habits in
            Pakistan.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="grid grid-cols-2 gap-8 md:gap-20 text-sm">
          <div className="space-y-2">
            <h3 className="font-semibold text-orange-500 mb-3">Company</h3>
            <Link
              to="/about"
              className="block text-gray-600 hover:text-orange-500 transition"
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className="block text-gray-600 hover:text-orange-500 transition"
            >
              Contact
            </Link>
            <Link
              to="/how-it-works"
              className="block text-gray-600 hover:text-orange-500 transition"
            >
              How it Works
            </Link>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-orange-500 mb-3">Legal</h3>
            <Link
              to="/privacy"
              className="block text-gray-600 hover:text-orange-500 transition"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="block text-gray-600 hover:text-orange-500 transition"
            >
              Terms of Use
            </Link>
            <Link
              to="/reviews"
              className="block text-gray-600 hover:text-orange-500 transition"
            >
              Reviews
            </Link>
          </div>
        </div>

        {/* Social & Contact */}
        <div className="space-y-4 text-center md:text-right">
          <h3 className="font-semibold text-orange-500 mb-3">
            Connect With Us
          </h3>
          <div className="flex justify-center md:justify-end space-x-5">
            <a
              href="#"
              className="text-gray-500 hover:text-orange-500 transition"
              aria-label="Facebook"
            >
              <FaFacebook className="text-2xl" />
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-orange-500 transition"
              aria-label="Instagram"
            >
              <FaInstagram className="text-2xl" />
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-orange-500 transition"
              aria-label="Twitter"
            >
              <FaTwitter className="text-2xl" />
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-orange-500 transition"
              aria-label="WhatsApp"
            >
              <FaWhatsapp className="text-2xl" />
            </a>
          </div>
          <a
            href="mailto:info@customcrave.com"
            className="text-gray-600 hover:text-orange-500 transition"
          >
            info@customcrave.com
          </a>
        </div>
      </div>

      {/* Bottom Strip */}
      <div className="mt-10 pt-6 text-center text-xs text-gray-500">
        <p>© 2025 Custom Crave. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
