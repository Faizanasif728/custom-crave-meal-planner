import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api";
import { toast } from "react-toastify";
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from "react-icons/fa";

const Contact = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    feedback: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.feedback.trim()) {
      newErrors.feedback = "Message is required";
    } else if (formData.feedback.length > 300) {
      newErrors.feedback = "Message must be less than 300 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await api.post("/feedback/submit", {
        username: formData.username,
        email: formData.email,
        message: formData.feedback,
      });
      if (response.status === 201) {
        setIsSubmitted(true);
        toast.success("Feedback submitted successfully!");
        setFormData({
          username: "",
          email: "",
          feedback: "",
        });
        setTimeout(() => setIsSubmitted(false), 3000);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to submit feedback. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const socialLinks = [
    { icon: <FaGithub />, url: "https://github.com", label: "GitHub" },
    { icon: <FaLinkedin />, url: "https://linkedin.com", label: "LinkedIn" },
    { icon: <FaTwitter />, url: "https://twitter.com", label: "Twitter" },
    { icon: <FaEnvelope />, url: "mailto:contact@example.com", label: "Email" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center px-4 py-12 text-black"
    >
      <div className="w-full max-w-md">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1
            className="text-4xl md:text-5xl font-extrabold text-orange-500 text-center drop-shadow-sm"
            style={{
              fontFamily: `'Dancing Script', 'Pacifico', 'Great Vibes', cursive, 'Playfair Display', serif`,
            }}
          >
            Contact Us
          </h1>
          <div className="mt-3"></div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-gray-700 mb-4"
          >
            Got suggestions or questions? We'd love to hear from you.
          </motion.p>

          {/* Social Links */}
          <div className="flex justify-center space-x-4 mb-6">
            {socialLinks.map((link, index) => (
              <motion.a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="text-gray-600 hover:text-orange-500 transition-colors duration-300"
                aria-label={link.label}
              >
                {link.icon}
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Feedback Form */}
        <AnimatePresence>
          {!isSubmitted ? (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.4 }}
              onSubmit={handleSubmit}
              className="space-y-6"
              autoComplete="off"
            >
              {/* Username */}
              <div className="space-y-1">
                <label
                  htmlFor="username"
                  className="font-semibold text-gray-800"
                >
                  Username <span className="text-orange-500">*</span>
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={`w-full bg-white text-black rounded-lg border ${
                    errors.username ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-orange-500 px-4 py-2`}
                  aria-invalid={!!errors.username}
                  aria-describedby={
                    errors.username ? "username-error" : undefined
                  }
                />
                {errors.username && (
                  <p id="username-error" className="text-red-500 text-sm">
                    {errors.username}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label htmlFor="email" className="font-semibold text-gray-800">
                  Email <span className="text-orange-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  className={`w-full bg-white text-black rounded-lg border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-orange-500 px-4 py-2`}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="text-red-500 text-sm">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Message */}
              <div className="space-y-1">
                <label
                  htmlFor="feedback"
                  className="font-semibold text-gray-800"
                >
                  Message <span className="text-orange-500">*</span>
                </label>
                <textarea
                  id="feedback"
                  name="feedback"
                  value={formData.feedback}
                  onChange={handleChange}
                  placeholder="Write your message here (max 3 lines)..."
                  rows={3}
                  maxLength={300}
                  className={`w-full bg-white text-black rounded-lg border ${
                    errors.feedback ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-orange-500 px-4 py-2 resize-none`}
                  aria-invalid={!!errors.feedback}
                  aria-describedby={
                    errors.feedback ? "feedback-error" : undefined
                  }
                />
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    Max 3 lines / 300 characters.
                  </p>
                  <p className="text-sm text-gray-500">
                    {formData.feedback.length}/300
                  </p>
                </div>
                {errors.feedback && (
                  <p id="feedback-error" className="text-red-500 text-sm">
                    {errors.feedback}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{
                  scale: loading ? 1 : 1.05,
                  boxShadow: loading
                    ? "none"
                    : "0px 0px 10px rgba(255,165,0,0.4)",
                }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3 rounded-full text-lg font-semibold transition-all duration-300 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-orange-500 hover:bg-orange-600 text-white"
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  "Submit Feedback"
                )}
              </motion.button>
            </motion.form>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <svg
                  className="w-8 h-8 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </motion.div>
              <h2 className="text-2xl font-bold text-green-600 mb-2">
                Thank You!
              </h2>
              <p className="text-gray-600">
                Your feedback has been submitted successfully.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Contact;
