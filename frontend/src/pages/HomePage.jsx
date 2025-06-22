import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api";
import { toast } from "react-toastify";
import Slider from "react-slick";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import khanImage from "../../src/assets/khan.jpg";
import aliImage from "../../src/assets/Ali.jpg";
import ayeshaImage from "../../src/assets/ayesha.jpg";
import fatimaImage from "../../src/assets/fatima.jpg";
import sarahImage from "../../src/assets/sarah.jpg";
// import "../pages/CSS/shared.css";
import "../pages/CSS/home.css";

// Video paths array (public/videos/1.mp4 ... 12.mp4)
const videoPaths = Array.from({ length: 13 }, (_, i) => `/videos/${i + 1}.mp4`);

// Custom Arrows
const NextArrow = ({ onClick }) => (
  <div
    className="absolute right-[-30px] top-1/2 transform -translate-y-1/2 z-10 cursor-pointer text-orange-500 hover:text-orange-600"
    onClick={onClick}
  >
    <FaArrowRight size={22} />
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div
    className="absolute left-[-30px] top-1/2 transform -translate-y-1/2 z-10 cursor-pointer text-orange-500 hover:text-orange-600"
    onClick={onClick}
  >
    <FaArrowLeft size={22} />
  </div>
);

const Home = () => {
  // Video state
  const [videoIndex, setVideoIndex] = useState(() =>
    Math.floor(Math.random() * videoPaths.length)
  );

  // Change video on click anywhere
  const handleGlobalClick = useCallback(() => {
    setVideoIndex((prev) => {
      let next;
      do {
        next = Math.floor(Math.random() * videoPaths.length);
      } while (next === prev && videoPaths.length > 1);
      return next;
    });
  }, []);

  useEffect(() => {
    window.addEventListener("click", handleGlobalClick);
    return () => window.removeEventListener("click", handleGlobalClick);
  }, [handleGlobalClick]);

  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem("feedbackFormData");
    return savedData
      ? JSON.parse(savedData)
      : {
          username: "",
          email: "",
          feedback: "",
        };
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // State for dynamic feedbacks
  const [userFeedbacks, setUserFeedbacks] = useState([]);

  // Fetch dynamic feedbacks on mount
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await api.get("/feedback/all");
        setUserFeedbacks(
          Array.isArray(res.data.feedbacks)
            ? res.data.feedbacks.sort(
                (a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)
              )
            : []
        );
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchFeedbacks();
  }, []);

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
    const newFormData = {
      ...formData,
      [name]: value,
    };
    setFormData(newFormData);
    localStorage.setItem("feedbackFormData", JSON.stringify(newFormData));
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
        const emptyFormData = {
          username: "",
          email: "",
          feedback: "",
        };
        setFormData(emptyFormData);
        localStorage.setItem("feedbackFormData", JSON.stringify(emptyFormData));
        // Add new feedback to userFeedbacks state
        setUserFeedbacks((prev) => [
          ...prev,
          {
            username: formData.username,
            email: formData.email,
            message: formData.feedback,
            profileImage: "/assets/default-profile.png",
            submittedAt: new Date(),
          },
        ]);
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

  const carouselSettings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4500,
    arrows: true,
    swipe: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  const dummyFeedbacks = [
    {
      username: "Sarah Ahmed",
      email: "sarahahmed12@email.com",
      message:
        "Custom Crave has transformed my meal planning! The personalized recipes are delicious and perfectly aligned with my health goals. I've never felt better!",
      profileImage: sarahImage,
      submittedAt: new Date("2024-03-15"),
    },
    {
      username: "Mohammad Khan",
      email: "mohammadkhan77@gmail.com",
      message:
        "As a busy professional, this app has been a game-changer. The meal suggestions are spot-on, and I love how it considers my dietary preferences. Highly recommended!",
      profileImage: khanImage,
      submittedAt: new Date("2024-03-14"),
    },
    {
      username: "Fatima Zahra",
      email: "fatimazahra11@email.com",
      message:
        "The variety of recipes is amazing! I've discovered so many new healthy dishes that my whole family enjoys. The nutrition tracking feature is incredibly helpful.",
      profileImage: fatimaImage,
      submittedAt: new Date("2024-03-13"),
    },
    {
      username: "Ali Hassan",
      email: "alihassan22@email.com",
      message:
        "I've tried many meal planning apps, but Custom Crave stands out. The interface is intuitive, and the recipes are both healthy and delicious. A must-have for health-conscious individuals!",
      profileImage: aliImage,
      submittedAt: new Date("2024-03-12"),
    },
    {
      username: "Ayesha Malik",
      email: "ayeshamalik45@email.com",
      message:
        "The personalized meal plans have helped me achieve my fitness goals while enjoying my food. The app's attention to detail and user-friendly design make it a pleasure to use daily.",
      profileImage: ayeshaImage,
      submittedAt: new Date("2024-03-11"),
    },
  ];

  const FeedbackCard = ({ feedback }) => (
    <div className="group bg-white rounded-2xl p-6 border border-orange-200 text-center flex flex-col justify-between min-h-[320px] h-full">
      <div>
        <img
          src={feedback.profileImage}
          alt={feedback.username}
          className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
        />
        <h3 className="text-xl font-bold text-orange-500">
          {feedback.username}
        </h3>
        <p className="text-sm text-gray-500 mb-2">{feedback.email}</p>
        <p className="text-gray-700 italic mt-3 leading-relaxed line-clamp-3">
          "{feedback.message}"
        </p>
      </div>
      <p className="text-xs text-gray-400 mt-4">
        {feedback.submittedAt
          ? new Date(feedback.submittedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : ""}
      </p>
    </div>
  );

  const [videoColors, setVideoColors] = useState({
    isDark: true,
    textColor: 'text-white',
    glowColor: 'shadow-[0_0_15px_rgba(255,255,255,0.5)]',
    borderColor: 'border-white/30',
    hoverColor: 'hover:text-orange-400',
    buttonGlow: 'hover:shadow-[0_0_20px_rgba(255,165,0,0.6)]',
    textGlow: 'drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]'
  });

  // Function to analyze video colors
  const analyzeVideoColors = useCallback((videoElement) => {
    if (!videoElement) return;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    // Get image data from multiple points for better analysis
    const points = [
      { x: canvas.width * 0.25, y: canvas.height * 0.25 },
      { x: canvas.width * 0.75, y: canvas.height * 0.25 },
      { x: canvas.width * 0.5, y: canvas.height * 0.5 },
      { x: canvas.width * 0.25, y: canvas.height * 0.75 },
      { x: canvas.width * 0.75, y: canvas.height * 0.75 }
    ];

    let totalBrightness = 0;
    let totalSaturation = 0;

    points.forEach(point => {
      const imageData = context.getImageData(point.x - 25, point.y - 25, 50, 50).data;
      
      for (let i = 0; i < imageData.length; i += 4) {
        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];
        
        // Calculate brightness
        const brightness = (r + g + b) / 3;
        totalBrightness += brightness;

        // Calculate saturation
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const saturation = max === 0 ? 0 : (max - min) / max;
        totalSaturation += saturation;
      }
    });

    const averageBrightness = totalBrightness / (points.length * 2500);
    const averageSaturation = totalSaturation / (points.length * 2500);
    const isDark = averageBrightness < 128;

    // Set colors based on analysis
    setVideoColors({
      isDark,
      textColor: isDark ? 'text-white' : 'text-gray-900',
      glowColor: isDark 
        ? 'shadow-[0_0_15px_rgba(255,255,255,0.5)]' 
        : 'shadow-[0_0_15px_rgba(0,0,0,0.5)]',
      borderColor: isDark ? 'border-white/30' : 'border-gray-900/30',
      hoverColor: isDark ? 'hover:text-orange-400' : 'hover:text-orange-600',
      buttonGlow: isDark 
        ? 'hover:shadow-[0_0_20px_rgba(255,165,0,0.6)]' 
        : 'hover:shadow-[0_0_20px_rgba(255,165,0,0.8)]',
      textGlow: isDark 
        ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' 
        : 'drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]'
    });
  }, []);

  // Update video analysis when video changes
  useEffect(() => {
    const videoElement = document.querySelector('video');
    if (videoElement) {
      videoElement.addEventListener('loadeddata', () => analyzeVideoColors(videoElement));
      analyzeVideoColors(videoElement);
    }
  }, [videoIndex, analyzeVideoColors]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header>
        <Navbar videoColors={videoColors} />
      </header>

      {/* Main Content with Wavy Background */}
      <div className="relative min-h-screen">
        {/* Wavy Video Overlay */}
        <div className="box1">
          <video
            key={videoIndex}
            src={videoPaths[videoIndex]}
            autoPlay
            muted
            loop
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover z-0"
            style={{
              transition: "opacity 0.5s",
            }}
          />
        </div>

        {/* Centered Content */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-center space-y-8">
          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/meal-planner"
                className={`inline-block text-xl sm:text-2xl font-bold ${videoColors.textColor} ${videoColors.textGlow} bg-white/10 hover:bg-orange-500 focus:ring-4 focus:ring-white/30 focus:outline-none rounded-full px-10 py-4 ${videoColors.glowColor} backdrop-blur-sm transition-all duration-300 ${videoColors.borderColor} ${videoColors.buttonGlow}`}
              >
                Get Started
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Feedback Form Section */}
      <section className="py-16 bg-white">
        <div className="w-full max-w-md mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h2 
              className="text-3xl sm:text-4xl font-bold text-orange-500 mb-2"
              style={{
                fontFamily: "'Dancing Script', cursive",
                letterSpacing: "0.05em",
                lineHeight: "1.2",
                textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              Share Your Thoughts
            </h2>
            <p className="text-gray-700">
              We'd love to hear your feedback and suggestions.
            </p>
          </motion.div>

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
                  <label
                    htmlFor="email"
                    className="font-semibold text-gray-800"
                  >
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
      </section>

      {/* Reviews Section */}
      <div className="w-full px-6 py-16">
        <div className="max-w-7xl mx-auto space-y-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 
              className="text-5xl font-extrabold text-orange-500 mb-4"
              style={{
                fontFamily: "'Dancing Script', cursive",
                letterSpacing: "0.05em",
                lineHeight: "1.2",
                textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              What Our Users Say
            </h2>
          </motion.div>

          <div className="relative px-10">
            <Slider {...carouselSettings}>
              {[...dummyFeedbacks, ...userFeedbacks].map((feedback, index) => (
                <div key={index} className="px-4 h-full">
                  <FeedbackCard feedback={feedback} />
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#fff3e6] text-gray-700">
        <Footer />
      </footer>
    </div>
  );
};

export default Home;
