// ============================================================
// routes/profileRoutes.js - Profile Routes
// Includes file upload for resume using multer
// ============================================================

const express = require("express");
const router = express.Router();
const multer = require("multer"); // Middleware for file uploads
const path = require("path");
const fs = require("fs");
const { getProfile, updateProfile } = require("../controllers/profileController");
const { protect } = require("../middleware/authMiddleware");

// Make sure the uploads folder exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Configure multer for storing uploaded files
const storage = multer.diskStorage({
  // Where to save files
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save in uploads/ folder
  },
  // What to name the files
  filename: (req, file, cb) => {
    // Name: userID-timestamp.extension (e.g., "abc123-1234567890.pdf")
    const uniqueName = `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// Only allow PDF and Word document uploads
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Only PDF and Word documents are allowed"), false); // Reject
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
});

// GET /api/profile - Get current user's profile
router.get("/", protect, getProfile);

// PUT /api/profile - Update profile (with optional resume upload)
// upload.single("resume") = handle single file with field name "resume"
router.put("/", protect, upload.single("resume"), updateProfile);

module.exports = router;
