require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected Successfully");
  } catch (err) {
    console.error("MongoDB Connection Error:", err.message);
    // Don't exit the process in production
    if (process.env.NODE_ENV !== "production") {
      process.exit(1);
    }
    throw err; // Re-throw the error to be handled by the application
  }
};

module.exports = connectDB;
