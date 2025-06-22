import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api";
import { toast } from "react-toastify";
import useAuthStore from "../store/authStore";
import { auth, provider, signInWithPopup } from "../config/firebaseConfig";
import { FcGoogle } from "react-icons/fc";
import { FiUser } from "react-icons/fi";
import { HiExternalLink } from "react-icons/hi";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [agree, setAgree] = useState(false);
  const [manualLoading, setManualLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const fetchUser = useAuthStore((state) => state.fetchUser);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agree) {
      toast.error("You must agree to the Terms of Service.");
      return;
    }

    setManualLoading(true);
    setGoogleLoading(false);

    try {
      const { data } = await api.post("/users/create-user", formData, {
        withCredentials: true,
      });
      if (import.meta.env.MODE === "production") {
        console.log("🟠 [PROD] Manual signup response:", data);
        console.log("🟠 [PROD] Document.cookie after signup:", document.cookie);
      }
      if (data?.success) {
        toast.success("Registration successful!");
        setFormData({ username: "", email: "", password: "" });
        if (data.user) {
          useAuthStore.getState().setUser(data.user);
        } else {
          await fetchUser();
        }
        if (import.meta.env.MODE === "production") {
          console.log("🟠 [PROD] Redirecting to home after manual signup");
        }
        navigate("/");
      } else {
        toast.error(data?.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Signup failed. Please try again."
      );
    } finally {
      setManualLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    if (import.meta.env.MODE === "production") {
      console.log("🟠 [PROD] Starting Google signup process...");
    }
    setGoogleLoading(true);
    setManualLoading(false);

    try {
      if (import.meta.env.MODE === "production") {
        console.log("🟠 [PROD] Calling Firebase signInWithPopup...");
      }
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const tokenId = await user.getIdToken();

      if (import.meta.env.MODE === "production") {
        console.log("🟠 [PROD] Firebase user data:", {
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        });
      }

      if (import.meta.env.MODE === "production") {
        console.log("🟠 [PROD] Calling backend google-signup API...");
      }
      const { data } = await api.post(
        "/users/google-signup",
        { tokenId },
        { withCredentials: true }
      );
      if (import.meta.env.MODE === "production") {
        console.log("🟠 [PROD] Backend response:", data);
        console.log("🟠 [PROD] Document.cookie after Google signup:", document.cookie);
      }
      if (data?.success) {
        if (data.user) {
          useAuthStore.getState().setUser(data.user);
        }
        await fetchUser();
        if (import.meta.env.MODE === "production") {
          console.log("🟠 [PROD] Redirecting to home after Google signup");
        }
        toast.success(data.message || "Google signup successful!");
        navigate("/");
      } else {
        toast.error(data?.message || "Google signup failed.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Google signup failed. Please try again."
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-crave-background text-crave-text px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-transparent"
      >
        {/* Header */}
        <div className="mb-6 pl-6">
          <h2 className="text-4xl font-extrabold text-orange-500 mb-1">
            Register
          </h2>
          <p className="text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-orange-400 hover:text-yellow-400 font-semibold"
            >
              Login
            </Link>
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-transparent p-6 pt-0 border border-white/10 rounded-xl"
        >
          <div>
            <label className="block text-sm font-semibold mb-1 text-crave-text">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="junaid123"
              required
              className="w-full px-4 py-3 bg-white text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-crave-text">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-3 bg-white text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-crave-text">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 bg-white text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <p className="mt-1 text-sm text-gray-500">
              At least 8 characters, one uppercase, one number, and a symbol.
            </p>
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="agree"
              checked={agree}
              onChange={() => setAgree(!agree)}
              className={`w-4 h-4 bg-white border-gray-300 rounded focus:ring-2 ${
                agree
                  ? "text-orange-500 focus:ring-orange-500"
                  : "text-gray-500"
              }`}
            />
            <label
              htmlFor="agree"
              className="text-sm font-medium text-crave-text flex items-center gap-1"
            >
              Agree to{" "}
              <a
                href="/terms"
                className="text-blue-500 underline inline-flex items-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms of Service <HiExternalLink size={20} />
              </a>
            </label>
          </div>

          {/* Manual Submit Button */}
          <motion.button
            type="submit"
            disabled={manualLoading}
            whileHover={{
              scale: manualLoading ? 1 : 1.05,
              boxShadow: manualLoading
                ? "none"
                : "0px 0px 12px rgba(255, 165, 0, 0.4)",
            }}
            whileTap={{ scale: 0.97 }}
            className={`w-full py-3 rounded-full font-semibold text-lg flex items-center justify-center gap-2 transition-all duration-300 ${
              manualLoading
                ? "bg-gray-500 text-white cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600 text-white"
            }`}
          >
            <FiUser size={18} />
            {manualLoading ? "Signing up..." : "Create Account"}
          </motion.button>
        </form>

        {/* Divider */}
        <div className="flex items-center justify-center my-4 px-6">
          <span className="border-b border-gray-300 w-1/5"></span>
          <span className="text-xs text-gray-400 uppercase px-2">or</span>
          <span className="border-b border-gray-300 w-1/5"></span>
        </div>

        {/* Google Signup Button */}
        <div className="px-6">
          <button
            onClick={handleGoogleSignup}
            disabled={googleLoading}
            className={`w-full py-3 rounded-full font-semibold text-lg shadow-sm border border-gray-300 bg-white text-gray-700 flex items-center justify-center gap-3 transition duration-300 ${
              googleLoading
                ? "cursor-not-allowed opacity-70"
                : "hover:bg-gray-100"
            }`}
          >
            <FcGoogle size={22} />
            {googleLoading ? "Processing..." : "Sign Up with Google"}
          </button>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-500">
          @2025 Custom Crave Inc.
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
