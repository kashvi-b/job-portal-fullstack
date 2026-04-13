// ============================================================
// routes/authRoutes.js - Authentication Routes
//
// Routes = URL patterns that map to controller functions
// Route: URL pattern + HTTP method (GET, POST, PUT, DELETE)
// ============================================================

const express = require("express");
const router = express.Router();
const { signup, login, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// POST /api/auth/signup - Create new account
router.post("/signup", signup);

// POST /api/auth/login - Login
router.post("/login", login);

// GET /api/auth/me - Get current user (protected = must be logged in)
router.get("/me", protect, getMe);

module.exports = router;
