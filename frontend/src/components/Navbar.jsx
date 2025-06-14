import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { toast } from "react-toastify";
import useAuthStore from "../store/authStore";
import { FiLogOut } from "react-icons/fi";

import {
  FaUtensils,
  FaSave,
  FaAppleAlt,
  FaClock,
  FaChartBar,
  FaUserAlt,
  FaQuestionCircle,
  FaRobot,
} from "react-icons/fa";

const Navbar = ({
  videoColors = {
    isDark: true,
    textColor: "text-white",
    glowColor: "shadow-[0_0_15px_rgba(255,255,255,0.5)]",
    borderColor: "border-white/30",
    hoverColor: "hover:text-orange-400",
    buttonGlow: "hover:shadow-[0_0_20px_rgba(255,165,0,0.6)]",
    textGlow: "drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]",
  },
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const sidebarRef = useRef(null);
  const {
    user,
    profileImage,
    uploadProfileImage,
    logout,
    setUser,
    setProfileImage,
    deleteProfileImage,
  } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine if we're on specific pages
  const isHomePage = location.pathname === "/";
  const isTransparentNavPage = ["/meal-planner", "/custom-category"].includes(
    location.pathname
  );

  // Get appropriate styles based on the page
  const getStyles = () => {
    if (isHomePage) {
      return {
        textColor: videoColors.textColor,
        glowColor: videoColors.glowColor,
        borderColor: videoColors.borderColor,
        hoverColor: videoColors.hoverColor,
        buttonGlow: videoColors.buttonGlow,
        textGlow: videoColors.textGlow,
        navBg: "bg-transparent",
      };
    }
    if (isTransparentNavPage) {
      return {
        textColor: "text-orange-500",
        navTextColor: "text-gray-800",
        glowColor: "",
        borderColor: "border-gray-200",
        hoverColor: "hover:text-orange-500",
        buttonGlow: "",
        textGlow: "",
        navBg: "bg-transparent",
      };
    }
    return {
      textColor: "text-orange-500",
      navTextColor: "text-gray-800",
      glowColor: "",
      borderColor: "border-gray-200",
      hoverColor: "hover:text-orange-500",
      buttonGlow: "",
      textGlow: "",
      navBg: "bg-white shadow-md",
    };
  };

  const styles = getStyles();

  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 0) {
        // Only show navbar when at the top of the page
        setIsVisible(true);
      } else {
        // Hide navbar when scrolling down or up (but not at top)
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Close sidebar when route changes
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        isSidebarOpen
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      toast.success("Logged out successfully! See you soon!");
      navigate("/login");
    } catch (error) {
      toast.error("Failed to log out. Please try again.");
    }
  };

  const handleImageUpload = async (event) => {
    if (!user) {
      toast.error("Please log in to update your profile picture");
      navigate("/login");
      return;
    }

    const file = event.target.files[0];
    if (
      !file ||
      !file.type.startsWith("image/") ||
      file.size > 5 * 1024 * 1024
    ) {
      toast.error(
        "Please upload a valid image file (JPEG/PNG/WEBP) under 5MB."
      );
      return;
    }

    setIsUploading(true);
    try {
      await uploadProfileImage(file);
      toast.success("Profile picture updated successfully!");
    } catch (error) {
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Planner", to: "/meal-planner" },
    { label: "Custom", to: "/custom-category" },
    { label: "Store", to: "/ingredients" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
    { label: "Chatbot", to: "/chatbot" },
  ];

  // Conditionally add the Admin link
  if (user?.role === "admin" || user?.role === "superadmin") {
    navLinks.push({ label: "Admin", to: "/admin" });
  }

  const sidebarLinks = [
    { to: "/custom-recipes", label: "Custom Recipes", icon: <FaUtensils /> },
    { to: "/my-meal-plans", label: "Saved Plans", icon: <FaSave /> },
    { to: "/diet-nutrition", label: "Dietary Type", icon: <FaAppleAlt /> },
    { to: "/meals-schedule", label: "Meal Type", icon: <FaClock /> },
    { to: "/physical-stats", label: "Physical Stats", icon: <FaChartBar /> },
    { to: "/update-profile", label: "Account", icon: <FaUserAlt /> },
    { to: "/chatbot", label: "Chatbot", icon: <FaRobot /> },
    { to: "/help", label: "Help", icon: <FaQuestionCircle /> },
  ];

  // Conditionally add the Admin link
  if (user?.role === "admin" || user?.role === "superadmin") {
    sidebarLinks.push({ to: "/admin", label: "Admin", icon: <FaUserAlt /> });
  }

  return (
    <>
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 ${
          styles.navBg
        } ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/assets/logo.png"
              alt="Custom Crave Logo"
              className="h-12 w-12 rounded-full object-cover shadow-md"
            />
            <span
              className={`text-3xl font-extrabold tracking-wide font-playfair ${styles.textColor} ${styles.textGlow} hover:text-orange-500 transition-colors duration-300`}
            >
              CustomCrave
            </span>
          </Link>

          {/* Navigation Links */}
          <ul className="hidden md:flex space-x-8 items-center">
            {navLinks.map(({ label, to }) => (
              <li key={label} className="group relative">
                <Link
                  to={to}
                  className={`${
                    isHomePage ? styles.textColor : styles.navTextColor
                  } text-lg font-medium transition duration-300 ${
                    styles.hoverColor
                  }`}
                >
                  {label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-400 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Right Auth/Sidebar */}
          {user ? (
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`${styles.textColor} ${styles.textGlow} ${styles.hoverColor} transition`}
            >
              <Menu className="w-7 h-7" />
            </button>
          ) : (
            <div className="flex flex-row items-center gap-3 sm:gap-4">
              <Link
                to="/login"
                className={`inline-block text-sm sm:text-base font-bold ${
                  isHomePage
                    ? `${styles.textColor} ${styles.textGlow} bg-white/10 hover:bg-orange-500`
                    : "bg-orange-500 hover:bg-orange-600 text-white"
                } focus:ring-4 focus:ring-white/30 focus:outline-none rounded-full px-4 sm:px-8 py-2 sm:py-2.5 ${
                  styles.glowColor
                } backdrop-blur-sm transition-all duration-300 ${
                  styles.borderColor
                } ${styles.buttonGlow}`}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className={`inline-block text-sm sm:text-base font-bold ${
                  isHomePage
                    ? `${styles.textColor} ${styles.textGlow} bg-white/10 hover:bg-orange-500`
                    : "bg-orange-500 hover:bg-orange-600 text-white"
                } focus:ring-4 focus:ring-white/30 focus:outline-none rounded-full px-4 sm:px-8 py-2 sm:py-2.5 ${
                  styles.glowColor
                } backdrop-blur-sm transition-all duration-300 ${
                  styles.borderColor
                } ${styles.buttonGlow}`}
              >
                Signup
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Sidebar */}
      {user && (
        // <>
        //   {console.log("Sidebar profileImage:", profileImage)}
        //   {console.log("Sidebar user:", user)}
          <div
            ref={sidebarRef}
            className={`fixed top-0 right-0 h-full w-[320px] bg-gray-100 text-white z-[60] shadow-lg transform transition-transform duration-300 ease-in-out ${
              isSidebarOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex flex-col justify-between h-full p-6">
              {/* Close */}
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="absolute top-4 right-4 text-gray-600 hover:text-black transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Profile */}
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <label
                    htmlFor="profileImageUpload"
                    className="cursor-pointer group"
                  >
                    <div className="relative">
                      {profileImage ? (
                        <div className="relative group">
                          <img
                            src={profileImage}
                            alt="Profile"
                            className={`w-14 h-14 rounded-full object-cover border-2 border-white shadow-md transition-all duration-300 ${
                              isUploading
                                ? "opacity-50 grayscale"
                                : "group-hover:opacity-80"
                            }`}
                          />
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-orange-500 flex items-center justify-center border-2 border-white shadow-md">
                          <span className="text-2xl font-bold text-white">
                            {user?.username?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      {isUploading && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      id="profileImageUpload"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      accept="image/jpeg,image/png,image/webp"
                    />
                  </label>
                  <div>
                    <p className="text-lg font-bold text-black">
                      {user?.username}
                    </p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>

                <hr className="border-gray-300 my-4" />

                {/* Sidebar Links */}
                <ul className="space-y-4">
                  {sidebarLinks.map(({ to, label, icon }) => (
                    <li key={to}>
                      <Link
                        to={to}
                        className="flex items-center space-x-3 text-black hover:text-orange-500 transition-colors duration-200"
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        <span className="text-lg">{icon}</span>
                        <span>{label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <hr className="border-gray-300 my-4" />

              {/* Logout */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center space-x-2 text-red-600 font-semibold hover:text-red-700 transition-colors duration-200"
              >
                <FiLogOut className="text-lg" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
          // </>
      )}

      {/* Logout Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all duration-300 ease-in-out">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Confirm Logout
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to log out of your account?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  setIsModalOpen(false);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
