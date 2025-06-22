require("dotenv").config(); // Ensure environment variables are loaded
const path = require("path");
const User = require("../models/users");
const UserProfile = require("../models/UserProfile"); // Import UserProfile model
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const calculateCalories = require("../utils/calorieCalculator");
const streamifier = require("streamifier");
const cloudinary = require("cloudinary").v2;
const admin = require("firebase-admin"); // ✅ Import firebase-admin

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Email & Password validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Username validation regex - no email-like patterns
const usernameRegex = /^(?!.*@)[a-zA-Z0-9_]{3,20}$/;

// 🔹 Register User
exports.createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters, include uppercase, lowercase, number, and special character.",
      });
    }

    // Check if already registered
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or Email already taken" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      isGoogleUser: false,
    });

    // Create user profile
    await UserProfile.create({ userId: user._id });

    // 🔽 Set JWT cookie for authentication
    const token = jwt.sign({ _id: user._id }, process.env.SECRET, {
      expiresIn: "15d",
    });
    const isProd = process.env.NODE_ENV === "production";
    const cookieOptions = {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "None" : "Lax",
      path: "/",
      maxAge: 15 * 24 * 60 * 60 * 1000,
      // Don't set domain for cross-origin cookies - let browser handle it
      ...(isProd && process.env.COOKIE_DOMAIN ? { domain: process.env.COOKIE_DOMAIN } : {})
    };
    if (isProd) {
      console.log("🍪 [PROD] Setting cookie (manual signup):", cookieOptions);
      console.log("🍪 [PROD] Token:", token);
      console.log("🍪 [PROD] COOKIE_DOMAIN:", process.env.COOKIE_DOMAIN);
    }
    res.cookie("auth", token, cookieOptions);
    if (isProd) {
      console.log("🍪 [PROD] res.cookie called for auth. Checking res.getHeaders()...");
      console.log("🍪 [PROD] Response headers after setting cookie:", res.getHeaders());
    }

    res.status(201).json({
      success: true,
      message: "Registration successful!",
      user: { username: user.username, email: user.email },
    });
  } catch (error) {
    console.error("Error in createUser:", error);
    res.status(500).json({ message: "Error creating user" });
  }
};

// Get user calorie needs
exports.getUserCalories = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Unauthorized. User not authenticated." });
    }

    let userProfile = await UserProfile.findOne({ userId: req.user._id });
    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    const { age, weight, height, activityLevel, weightGoal, gender } = req.body;

    // Prepare update object
    const updateFields = {};
    if (age !== undefined) updateFields.age = age;
    if (weight !== undefined) updateFields.weight = weight;
    if (height !== undefined) updateFields.height = height;
    if (activityLevel !== undefined) updateFields.activityLevel = activityLevel;
    if (gender !== undefined) updateFields.gender = gender;

    // Map frontend weightGoal values to schema-compatible values
    const weightGoalMap = {
      weight_loss: "Weight Loss",
      weight_gain: "Weight Gain",
    };

    // Validate and map weightGoal
    if (weightGoal) {
      if (weightGoalMap[weightGoal]) {
        updateFields.weightGoal = weightGoalMap[weightGoal];
      } else {
        return res.status(400).json({ message: "Invalid weightGoal value" });
      }
    }

    // Calculate daily calorie needs with updated values
    const dailyCalories = calculateCalories(
      updateFields.gender || userProfile.gender,
      updateFields.age || userProfile.age,
      updateFields.weight || userProfile.weight,
      updateFields.height || userProfile.height,
      updateFields.activityLevel || userProfile.activityLevel,
      updateFields.weightGoal || userProfile.weightGoal
    );

    updateFields.dailyCalories = dailyCalories;

    // Update the user profile in the database
    userProfile = await UserProfile.findByIdAndUpdate(
      userProfile._id,
      { $set: updateFields },
      { new: true } // Return the updated document
    );

    res.status(200).json({
      message: "Profile updated successfully",
      updatedProfile: userProfile,
      dailyCalories: dailyCalories,
    });
  } catch (error) {
    console.error("Error updating profile and calculating calories:", error);
    res.status(500).json({
      message: "Error processing request",
      error: error.message,
    });
  }
};

// 🔹 Get User Profile (Requires Authentication)
exports.getUserProfile = async (req, res) => {
  try {
    console.log("🔵 Getting user profile for user ID:", req.user._id);
    
    const user = await User.findById(req.user._id).select("-password");
    const userProfile = await UserProfile.findOne({ userId: req.user._id });

    console.log("🔵 User lookup result:", user ? "User found" : "User not found");
    console.log("🔵 User profile lookup result:", userProfile ? "Profile found" : "Profile not found");

    if (!user || !userProfile) {
      console.log("❌ User or profile not found");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("🔵 Profile image from database:", userProfile.profileImage);
    console.log("📤 Sending user profile response...");

    res.status(200).json({
      user: {
        username: user.username,
        email: user.email,
        profileImage: userProfile.profileImage, // Include profileImage
      },
    });
  } catch (error) {
    console.error("❌ Error fetching user profile:", error);
    console.error("❌ Error stack:", error.stack);
    res.status(500).json({ message: "Error fetching user profile" });
  }
};

// 🔹 Update User Profile (Authenticated)
exports.updateUserProfile = async (req, res) => {
  try {
    const { newUsername, newEmail, oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update username if provided
    if (newUsername) {
      if (!usernameRegex.test(newUsername)) {
        return res.status(400).json({
          message:
            "Username must be 3-20 characters, can only contain letters, numbers, and underscores, and cannot contain @ symbol",
        });
      }
      if (newUsername !== user.username) {
        const existingUsername = await User.findOne({ username: newUsername });
        if (existingUsername) {
          return res.status(400).json({ message: "Username is already taken" });
        }
        user.username = newUsername;
      }
    }

    // Update email if provided
    if (newEmail) {
      if (!emailRegex.test(newEmail)) {
        return res.status(400).json({ message: "Invalid email format" });
      }
      if (newEmail !== user.email) {
        const existingEmail = await User.findOne({ email: newEmail });
        if (existingEmail) {
          return res.status(400).json({ message: "Email is already taken" });
        }
        user.email = newEmail;
      }
    }

    // Update password if provided
    if (newPassword) {
      if (!oldPassword) {
        return res
          .status(400)
          .json({ message: "Old password is required to update password" });
      }
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Incorrect old password" });
      }
      if (oldPassword === newPassword) {
        return res.status(400).json({
          message: "New password must be different from old password",
        });
      }
      if (!passwordRegex.test(newPassword)) {
        return res.status(400).json({
          message:
            "Password must be at least 8 characters, include uppercase, lowercase, number, and special character.",
        });
      }
      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: { username: user.username, email: user.email },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Error updating profile" });
  }
};

// 🔹 Delete User (Authenticated)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the associated user profile
    const userProfile = await UserProfile.findOneAndDelete({
      userId: req.user._id,
    });
    if (!userProfile) {
      console.warn(
        "User profile not found for deletion, proceeding with user deletion."
      );
    }

    // Delete the user
    await User.deleteOne({ _id: req.user._id });

    // Clear the authentication cookie
    const isProd = process.env.NODE_ENV === "production";
    const clearCookieOptions = {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "None" : "Lax",
      path: "/",
      // Don't set domain for cross-origin cookies - let browser handle it
      ...(isProd && process.env.COOKIE_DOMAIN ? { domain: process.env.COOKIE_DOMAIN } : {})
    };
    res.clearCookie("auth", clearCookieOptions);
    res
      .status(200)
      .json({ message: "User and associated profile deleted successfully" });
  } catch (error) {
    console.error("Error deleting user and profile:", error);
    res.status(500).json({ message: "Error deleting user and profile" });
  }
};

// 🔹 Upload Profile Image
exports.uploadProfileImage = async (req, res) => {
  try {
    const userId = req.user._id;

    // Check if a file is uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Validate file type
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      return res.status(400).json({ message: "Invalid file type" });
    }

    // Upload the file to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "profile_images" },
      async (error, result) => {
        if (error) {
          console.error("❌ Cloudinary Upload Error:", error);
          return res.status(500).json({ message: "Error uploading image" });
        }

        try {
          // Update the profile image URL in the UserProfile model
          const userProfile = await UserProfile.findOneAndUpdate(
            { userId },
            { profileImage: result.secure_url },
            { new: true }
          );

          if (!userProfile) {
            return res.status(404).json({ message: "User profile not found" });
          }

          // Respond with the updated profile image URL
          res.status(200).json({
            message: "Profile image uploaded successfully",
            profileImage: userProfile.profileImage,
          });
        } catch (dbError) {
          console.error("❌ Database Update Error:", dbError);
          res
            .status(500)
            .json({ message: "Error updating profile image in database" });
        }
      }
    );

    // Pipe the file buffer to the Cloudinary upload stream
    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  } catch (error) {
    console.error("❌ Error uploading profile image:", error);
    res.status(500).json({ message: "Error uploading profile image" });
  }
};

exports.deleteProfileImage = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log("User ID:", userId);

    // Find the user profile
    const userProfile = await UserProfile.findOne({ userId });
    console.log("User Profile:", userProfile);

    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    // Check if the current profile image is not the default placeholder
    if (
      userProfile.profileImage &&
      !userProfile.profileImage.includes("placeholder.com")
    ) {
      console.log("Profile Image URL:", userProfile.profileImage);

      // Extract the public ID of the image from the Cloudinary URL
      const publicId = userProfile.profileImage.split("/").pop().split(".")[0];
      console.log("Extracted Public ID:", publicId);

      // Delete the image from Cloudinary
      try {
        const result = await cloudinary.uploader.destroy(
          `profile_images/${publicId}`
        );
        console.log("Cloudinary Deletion Result:", result);
      } catch (cloudinaryError) {
        console.error(
          "❌ Error deleting image from Cloudinary:",
          cloudinaryError
        );
        return res
          .status(500)
          .json({ message: "Error deleting image from Cloudinary" });
      }
    }

    // Reset the profile image to the default placeholder
    userProfile.profileImage = "https://via.placeholder.com/150";
    await userProfile.save();
    console.log("Profile image reset to default placeholder");

    res.status(200).json({ message: "Profile image deleted successfully" });
  } catch (error) {
    console.error("Error deleting profile image:", error);
    res.status(500).json({ message: "Error deleting profile image" });
  }
};

exports.getUserCustomMeals = async (req, res) => {
  try {
    const userProfile = await UserProfile.findOne(
      { userId: req.user._id },
      { customMeals: 1 } // Fetch only the customMeals field
    );

    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    res.status(200).json(userProfile.customMeals); // Return only customMeals
  } catch (error) {
    console.error("Error fetching custom meals:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getPhysicalStats = async (req, res) => {
  try {
    // Find user profile and exclude profileImage and customMeals fields
    const userProfile = await UserProfile.findOne(
      { userId: req.user._id },
      {
        profileImage: 0, // Exclude profile image
        customMeals: 0, // Exclude custom meals
        _id: 0, // Exclude MongoDB _id
        userId: 0, // Exclude userId
      }
    );

    if (!userProfile) {
      return res.status(404).json({
        success: false,
        message: "User profile not found",
      });
    }

    res.status(200).json({
      success: true,
      userProfile,
    });
  } catch (error) {
    console.error("Error fetching physical stats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching physical stats",
    });
  }
};
exports.getDietaryType = async (req, res) => {
  try {
    const userProfile = await UserProfile.findOne(
      { userId: req.user._id },
      { dietaryType: 1, _id: 0 } // Fetch only the dietaryType field
    );

    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    res.status(200).json({ dietaryType: userProfile.dietaryType });
  } catch (error) {
    console.error("Error fetching dietary type:", error);
    res.status(500).json({ message: "Error fetching dietary type" });
  }
};

exports.updateDietaryType = async (req, res) => {
  try {
    const { dietaryType } = req.body;

    if (!dietaryType) {
      return res.status(400).json({ message: "Dietary type is required" });
    }

    // Validate dietary type
    const validDietaryTypes = [
      "Keto",
      "Vegan",
      "Vegetarian",
      "Non-Vegetarian",
      "Mediterranean",
      "Desi",
      "not_specified",
    ];

    if (!validDietaryTypes.includes(dietaryType)) {
      return res.status(400).json({
        message: `Invalid dietary type. Must be one of: ${validDietaryTypes.join(
          ", "
        )}`,
      });
    }

    const userProfile = await UserProfile.findOne({ userId: req.user._id });

    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    userProfile.dietaryType = dietaryType;
    await userProfile.save();

    res.status(200).json({
      success: true,
      message: "Dietary type updated successfully",
      dietaryType: userProfile.dietaryType,
    });
  } catch (error) {
    console.error("Error updating dietary type:", error);
    res.status(500).json({ message: "Error updating dietary type" });
  }
};

exports.getMealType = async (req, res) => {
  try {
    const userProfile = await UserProfile.findOne(
      { userId: req.user._id },
      { mealType: 1, _id: 0 } // Fetch only the mealType field
    );

    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    res.status(200).json({ mealType: userProfile.mealType });
  } catch (error) {
    console.error("Error fetching meal type:", error);
    res.status(500).json({ message: "Error fetching meal type" });
  }
};

// ✅ Google Signup Controller
exports.googleSignup = async (req, res) => {
  try {
    console.log("🔵 Starting Google Signup process...");
    const { tokenId } = req.body;

    console.log("🔵 Token ID received:", tokenId ? "Present" : "Missing");

    const decodedToken = await admin.auth().verifyIdToken(tokenId);
    const { email, name, picture } = decodedToken;

    console.log("🔵 Google Token Decoded Successfully:");
    console.log("  - Email:", email);
    console.log("  - Name:", name);
    console.log("  - Picture URL:", picture);
    console.log("  - Picture URL Type:", typeof picture);
    console.log("  - Picture URL Length:", picture ? picture.length : 0);

    let user = await User.findOne({ email });
    console.log("🔵 Existing user check:", user ? "User found" : "No existing user");

    if (user) {
      console.log("❌ User already exists with email:", email);
      // ➡️ If user already exists, return an error
      return res.status(400).json({
        success: false,
        message: "This email is already registered. Please login instead.",
      });
    }

    console.log("✅ Proceeding with new user creation...");

    // ➡️ Create new user
    const randomPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    const newUser = new User({
      email,
      username: name,
      password: hashedPassword,
      isGoogleUser: true,
      isEmailVerified: true,
    });
    await newUser.save();
    console.log("✅ New user created with ID:", newUser._id);

    // ➡️ Create user profile with Google picture if available
    const profileImageUrl = picture || "https://via.placeholder.com/150";
    console.log("🔵 Setting profile image URL:", profileImageUrl);

    const userProfile = new UserProfile({
      userId: newUser._id,
      age: null,
      gender: "not_specified",
      height: null,
      weight: null,
      activityLevel: "not_specified",
      weightGoal: "not_specified",
      profileImage: profileImageUrl, // Use Google picture if available, otherwise default
    });
    await userProfile.save();
    console.log("✅ User profile created with profile image:", userProfile.profileImage);

    const token = jwt.sign({ _id: newUser._id }, process.env.SECRET, {
      expiresIn: "15d",
    });
    const isProd = process.env.NODE_ENV === "production";
    const cookieOptions = {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "None" : "Lax",
      path: "/",
      maxAge: 15 * 24 * 60 * 60 * 1000,
      // Don't set domain for cross-origin cookies - let browser handle it
      ...(isProd && process.env.COOKIE_DOMAIN ? { domain: process.env.COOKIE_DOMAIN } : {})
    };
    if (isProd) {
      console.log("🍪 [PROD] Setting cookie (Google signup):", cookieOptions);
      console.log("🍪 [PROD] Token:", token);
      console.log("🍪 [PROD] COOKIE_DOMAIN:", process.env.COOKIE_DOMAIN);
    }
    res.cookie("auth", token, cookieOptions);
    if (isProd) {
      console.log("🍪 [PROD] res.cookie called for auth. Checking res.getHeaders()...");
      console.log("🍪 [PROD] Response headers after setting cookie:", res.getHeaders());
    }
    console.log("✅ Auth cookie set");

    console.log("🎉 Google Signup completed successfully!");
    console.log("📤 Sending response with user data...");

    res.status(201).json({
      success: true,
      message: "Signup with Google successful",
      user: {
        username: newUser.username,
        email: newUser.email,
        profileImage: profileImageUrl, // Send the actual profile image URL
      },
    });
  } catch (error) {
    console.error("❌ Error during Google signup:", error);
    console.error("❌ Error stack:", error.stack);
    res.status(500).json({ success: false, message: "Google signup failed" });
  }
};
