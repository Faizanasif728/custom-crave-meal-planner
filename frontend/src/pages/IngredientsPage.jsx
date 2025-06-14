import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaExternalLinkAlt,
  FaStore,
  FaSearch,
  FaShoppingCart,
  FaStar,
} from "react-icons/fa";
import carrefourLogo from "../../src/assets/carrefour1.png";
import fatahLogo from "../../src/assets/fatah.png";
import darazLogo from "../../src/assets/daraz.jpg";
import imtiazLogo from "../../src/assets/imtiaz.png";
import metroLogo from "../../src/assets/metro.jpg";
import naheedLogo from "../../src/assets/naheed.jpg";

// Store configurations with enhanced information
const storeConfigs = {
  daraz: {
    name: "Daraz Grocery",
    logo: darazLogo,
    searchEndpoint:
      "https://www.daraz.pk/catalog/?spm=a2a0e.tm80360391.search.d_go&q=grocery",
    description:
      "Pakistan's largest online marketplace with extensive grocery selection",
    rating: 4.5,
    deliveryTime: "2-3 days",
    minOrder: "Rs. 500",
    categories: ["Fresh Produce", "Pantry Items", "Snacks", "Beverages"],
  },
  carrefour: {
    name: "Carrefour Pakistan",
    logo: carrefourLogo,
    searchEndpoint: "https://www.carrefour.pk/mafpak/en/n/c/clp_FPAK1700000",
    description: "International supermarket chain with quality groceries",
    rating: 4.7,
    deliveryTime: "1-2 days",
    minOrder: "Rs. 1000",
    categories: ["Fresh Food", "International Products", "Household Items"],
  },
  naheed: {
    name: "Naheed.pk",
    logo: naheedLogo,
    searchEndpoint: "https://www.naheed.pk/groceries-pets",
    description: "Your one-stop shop for all grocery needs",
    rating: 4.3,
    deliveryTime: "1-3 days",
    minOrder: "Rs. 800",
    categories: ["Local Products", "Imported Items", "Daily Essentials"],
  },
  metro: {
    name: "Metro Online",
    logo: metroLogo,
    searchEndpoint: "https://www.metro-online.pk/search/grocery?searchText=grocery&url=&isSearched=true",
    description: "Wholesale grocery shopping made easy",
    rating: 4.4,
    deliveryTime: "2-4 days",
    minOrder: "Rs. 1500",
    categories: ["Bulk Items", "Restaurant Supplies", "Fresh Produce"],
  },
  imtiaz: {
    name: "Imtiaz Super Market",
    logo: imtiazLogo,
    searchEndpoint: "https://imtiaz.com.pk/",
    description: "Premium grocery shopping experience",
    rating: 4.6,
    deliveryTime: "1-2 days",
    minOrder: "Rs. 1000",
    categories: ["Fresh Food", "Household Items", "Personal Care"],
  },
  alfatah: {
    name: "Al-Fatah",
    logo: fatahLogo,
    searchEndpoint: "https://alfatah.pk/pages/grocery-foods",
    description: "Your trusted local grocery store",
    rating: 4.2,
    deliveryTime: "1-3 days",
    minOrder: "Rs. 700",
    categories: ["Local Products", "Fresh Food", "Daily Essentials"],
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
};

const Ingredients = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const handleStoreClick = (storeName) => {
    setLoading(true);
    try {
      const store = storeConfigs[storeName];
      if (store.searchEndpoint) {
        window.open(store.searchEndpoint, "_blank");
      }
    } catch (err) {
      setError(`Failed to open ${storeName}. Please try again later.`);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredStores = Object.entries(storeConfigs).filter(([key, store]) => {
    const matchesSearch =
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || store.categories.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const allCategories = [
    "all",
    ...new Set(
      Object.values(storeConfigs).flatMap((store) => store.categories)
    ),
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">{error}</p>
          <p className="mt-2">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-black px-4 sm:px-6 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto">
        {/* Title and Search */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <motion.h1
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-4xl md:text-5xl font-extrabold text-orange-500 text-center drop-shadow-sm"
            style={{
              fontFamily: `'Dancing Script', 'Pacifico', 'Great Vibes', cursive, 'Playfair Display', serif`,
            }}
          >
            Grocery Stores
          </motion.h1>
          <div className="mt-3"></div>
          <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto mb-8">
            Shop for fresh ingredients from Pakistan's leading grocery stores
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative">
            <input
              type="text"
              placeholder="Search stores..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {allCategories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  if (category === "all") {
                    setSearchQuery("");
                  }
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Store Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredStores.map(([key, store]) => (
            <motion.div
              key={key}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="group relative bg-white rounded-xl overflow-hidden border border-gray-200 transition-all duration-300 hover:border-orange-400 cursor-pointer"
              onClick={() => handleStoreClick(key)}
            >
              <div className="h-52 w-full bg-white overflow-hidden rounded-t-xl">
                <img
                  src={store.logo}
                  alt={`${store.name} logo`}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-orange-500 transition-colors">
                    {store.name}
                  </h3>
                  <div className="flex items-center text-yellow-500">
                    <FaStar className="mr-1" />
                    <span className="text-sm font-medium">{store.rating}</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  {store.description}
                </p>

                {/* Store Details */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-sm">
                    <span className="text-gray-500">Delivery:</span>
                    <span className="ml-2 font-medium">
                      {store.deliveryTime}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Min Order:</span>
                    <span className="ml-2 font-medium">{store.minOrder}</span>
                  </div>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {store.categories.map((category) => (
                    <span
                      key={category}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                    >
                      {category}
                    </span>
                  ))}
                </div>

                <div className="flex items-center text-orange-500 group-hover:text-orange-600 transition-colors">
                  <span className="text-sm font-medium">Visit Store</span>
                  <FaExternalLinkAlt className="ml-2 text-xs" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Ingredients;
