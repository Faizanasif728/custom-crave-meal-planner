import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "../api";
import { toast } from "react-toastify";
import useAuthStore from "../store/authStore";
import { auth, provider, signInWithPopup } from "../config/firebaseConfig";
import { FcGoogle } from "react-icons/fc";
import { FiLogIn, FiEye, FiEyeOff } from "react-icons/fi";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [manualLoading, setManualLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const fetchUser = useAuthStore((state) => state.fetchUser);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setManualLoading(true);
    setGoogleLoading(false);

    try {
      const { data } = await axios.post(
        "/auth/login",
        {
          ...formData,
          rememberMe,
        },
        {
          withCredentials: true,
        }
      );

      if (data?.success) {
        toast.success("Login successful!");
        setUser(data.user);
        await fetchUser();
        setFormData({ email: "", password: "" });
        navigate("/");
      } else {
        toast.error(data?.message || "Invalid login credentials.");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setManualLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setManualLoading(false);

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const tokenId = await user.getIdToken();

      const { data } = await axios.post(
        "/auth/google-login",
        { tokenId, rememberMe },
        { withCredentials: true }
      );

      if (data?.success) {
        toast.success(data.message || "Google authentication successful!");
        await fetchUser();
        navigate("/");
      } else {
        toast.error(data?.message || "Google authentication failed.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "No account found. Please sign up with Google first."
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
        {/* Heading */}
        <div className="mb-6 pl-6">
          <h2 className="text-4xl font-extrabold text-orange-500 mb-1">
            Welcome Back
          </h2>
          <p className="text-sm text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-orange-400 hover:text-yellow-400 font-semibold"
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-transparent p-6 pt-0 border border-white/10 rounded-xl"
          autoComplete="off"
        >
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-crave-text">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="off"
              className="w-full px-4 py-3 bg-white text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-crave-text">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
                className="w-full px-4 py-3 bg-white text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <FiEyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <FiEye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember-me"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-orange-500 focus:ring-orange-400 border-gray-300 rounded"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-400"
            >
              Remember me
            </label>
          </div>

          {/* Submit Button */}
          <motion.button
            disabled={manualLoading}
            whileHover={{
              scale: manualLoading ? 1 : 1.05,
              boxShadow: manualLoading
                ? "none"
                : "0px 0px 12px rgba(255, 165, 0, 0.4)",
            }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className={`w-full py-3 rounded-full flex justify-center items-center gap-2 text-white font-semibold text-lg transition-all duration-300 ${
              manualLoading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600"
            }`}
          >
            <FiLogIn size={20} />
            {manualLoading ? "Logging in..." : "Login"}
          </motion.button>
        </form>

        {/* Divider */}
        <div className="flex items-center justify-center my-6">
          <span className="border-b border-gray-300 w-1/5"></span>
          <span className="text-xs text-gray-400 uppercase px-3">OR</span>
          <span className="border-b border-gray-300 w-1/5"></span>
        </div>

        {/* Google Login Button */}
        <div className="px-6">
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className={`w-full py-3 rounded-full font-semibold text-lg shadow-sm border border-gray-300 bg-white text-gray-700 flex items-center justify-center gap-3 transition duration-300 ${
              googleLoading
                ? "cursor-not-allowed opacity-70"
                : "hover:bg-gray-100"
            }`}
          >
            <FcGoogle size={22} />
            {googleLoading ? "Processing..." : "Login with Google"}
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

export default Login;
