import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Layout = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div className={`min-h-screen flex flex-col ${!isHomePage ? 'bg-crave-background' : ''} text-crave-text`}>
      {/* Navbar */}
      <header>
        <Navbar />
      </header>

      {/* Page Content */}
      <main className="flex-grow pt-24 pb-24 md:pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white border-t border-gray-700">
        <Footer />
      </footer>
    </div>
  );
};

export default Layout;
