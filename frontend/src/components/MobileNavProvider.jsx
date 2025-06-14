import React from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaHome, FaCalendarAlt, FaUtensils, FaStore } from "react-icons/fa";

const MobileNavProvider = ({ children }) => {
  const location = useLocation();
  
  // List of paths where mobile nav should be hidden
  const hideNavPaths = ["/login", "/signup"];
  const shouldHideNav = hideNavPaths.includes(location.pathname);

  const navItems = [
    { icon: <FaHome size={24} />, path: "/", label: "Home" },
    { icon: <FaCalendarAlt size={24} />, path: "/meal-planner", label: "Planner" },
    { icon: <FaUtensils size={24} />, path: "/custom-category", label: "Custom" },
    { icon: <FaStore size={24} />, path: "/ingredients", label: "Store" },
  ];

  return (
    <>
      {children}
      {!shouldHideNav && (
        <nav className="md:hidden fixed bottom-0 left-0 w-full bg-gray-800 border-t border-gray-700 shadow-lg z-[100]">
          <div className="flex justify-around items-center h-16 px-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ${
                  location.pathname === item.path
                    ? "text-orange-500"
                    : "text-white hover:text-orange-400"
                }`}
              >
                {item.icon}
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      )}
    </>
  );
};

export default MobileNavProvider; 