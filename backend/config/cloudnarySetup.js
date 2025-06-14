require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const folderPath = "C:\\Users\\fasif\\Downloads\\images";

const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];

const uploadSequentially = async () => {
  const files = fs.readdirSync(folderPath);

  let successCount = 0;
  let failureCount = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const ext = path.extname(file).toLowerCase();

    if (!allowedExtensions.includes(ext)) {
      console.warn(`⚠️ Skipping unsupported file: ${file}`);
      continue;
    }

    const filePath = path.join(folderPath, file);

    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: "recipe_uploads",
      });
      console.log(`✅ [${i + 1}] ${file} uploaded: ${result.secure_url}`);
      successCount++;
    } catch (error) {
      console.error(`❌ Error uploading ${file}:`, error.message || error);
      failureCount++;
    }
  }

  console.log(`\n--- Upload Summary ---`);
  console.log(`✅ Uploaded: ${successCount}`);
  console.log(`❌ Failed: ${failureCount}`);
};
// Single File Upload Function
const uploadSingleFile = async (
  fileBuffer,
  cloudinaryFolder = "profile_images"
) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: cloudinaryFolder },
      (error, result) => {
        if (error) {
          console.error("❌ Cloudinary Upload Error:", error);
          return reject(error);
        }
        console.log(`✅ File uploaded: ${result.secure_url}`);
        resolve(result.secure_url);
      }
    );

    // Convert buffer to readable stream and pipe it to Cloudinary
    const streamifier = require("streamifier");
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

module.exports = {
  uploadSequentially,
  uploadSingleFile,
};
