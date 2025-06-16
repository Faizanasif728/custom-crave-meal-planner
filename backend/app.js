require("dotenv").config(); // Load environment variables
const createError = require("http-errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const connectDB = require("./config/DBconnection");

// Import Routes
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const mealplanRoutes = require("./routes/mealplanRoutes");
const recipeRoutes = require("./routes/recipeRoutes");
const customRoutes = require("./routes/customRoutes");
const groqRoutes = require("./routes/groqRoutes"); // ✅ Chatbot Route

const app = express();

// Connect to MongoDB
connectDB();

// Handle Uncaught Exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

// Handle Unhandled Promise Rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Promise Rejection:", reason);
});
const allowedOrigins = [
  "http://localhost:5173",
  "https://custom-crave-meal-planner.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log("CORS request from:", origin);
    console.log("Allowed origins:", allowedOrigins);
    // Allow requests with no origin (like server-to-server or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  exposedHeaders: ["set-cookie"],
  optionsSuccessStatus: 200,
  preflightContinue: false,
  maxAge: 86400,
  sameSite: "none",
  secure: true
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Use Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/mealplan", mealplanRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/custom", customRoutes);
app.use("/api/groq", groqRoutes); // ✅ Mounted Chatbot Endpoint

// Root route for health check or welcome message
app.get("/", (req, res) => {
  res.send("Custom Crave Backend is running!");
});

// Test route to check environment and server status
app.get("/api/test-server", (req, res) => {
  res.json({
    status: "Server is running",
    nodeEnv: process.env.NODE_ENV,
    cookieDomain: process.env.COOKIE_DOMAIN,
    frontendUrl: process.env.PRODUCTION_FRONTEND_URL,
    corsOrigins: allowedOrigins,
    timestamp: new Date().toISOString()
  });
});

// Test route to check environment variables
app.get("/api/test-env", (req, res) => {
  res.json({
    nodeEnv: process.env.NODE_ENV,
    cookieDomain: process.env.COOKIE_DOMAIN,
    frontendUrl: process.env.PRODUCTION_FRONTEND_URL,
    // Don't send sensitive data like SECRET or MONGODB_URI
  });
});

// 404 Handler
app.use((req, res, next) => {
  next(createError(404, "Resource not found"));
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message || err);

  const statusCode = err.status || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

module.exports = app;
