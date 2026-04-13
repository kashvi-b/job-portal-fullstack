// ============================================================
// server.js - The main entry point of our backend
// This is where we start our Express server
// ============================================================

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // Load environment variables from .env file

const app = express();

// ============================================================
// MIDDLEWARE SETUP
// Middleware = functions that run on every request
// ============================================================

// Allow React frontend to talk to this backend (Cross-Origin Resource Sharing)
app.use(cors());

// Parse incoming JSON requests (so we can read req.body)
app.use(express.json());

// Serve uploaded files (like resumes) as static files
app.use("/uploads", express.static("uploads"));

// ============================================================
// ROUTES SETUP
// We split routes into separate files to keep code organized
// ============================================================

const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const profileRoutes = require("./routes/profileRoutes");

app.use("/api/auth", authRoutes);         // /api/auth/login, /api/auth/signup
app.use("/api/jobs", jobRoutes);           // /api/jobs, /api/jobs/:id
app.use("/api/applications", applicationRoutes); // /api/applications
app.use("/api/profile", profileRoutes);   // /api/profile

// Simple health check route - visit this to confirm server is running
app.get("/", (req, res) => {
  res.json({ message: "Job Portal API is running! 🚀" });
});

// ============================================================
// DATABASE CONNECTION
// We connect to MongoDB using Mongoose (an ODM library)
// ODM = Object Document Mapper (like an ORM but for MongoDB)
// ============================================================

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB successfully!");
    // Only start the server after DB connects
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1); // Exit if we can't connect to DB
  });
