// ============================================================
// controllers/authController.js - Authentication Logic
//
// Controllers = where the actual business logic lives
// Routes just call these controller functions
// Keeping them separate = cleaner code!
// ============================================================

const User = require("../models/User");
const jwt = require("jsonwebtoken");

// ============================================================
// Helper function: Create a JWT Token
//
// jwt.sign(payload, secret, options)
// - payload = data we want to store in the token (user's ID)
// - secret = our secret key to sign the token
// - options = extra settings like expiry time
// ============================================================

const createToken = (userId) => {
  return jwt.sign(
    { userId }, // Data stored in token
    process.env.JWT_SECRET, // Secret key from .env
    { expiresIn: "7d" } // Token expires in 7 days
  );
};

// ============================================================
// POST /api/auth/signup
// Creates a new user account
// ============================================================

const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate that required fields are present
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered." });
    }

    // Create new user (password will be hashed automatically by the model's pre-save hook)
    const user = await User.create({ name, email, password, role });

    // Create a JWT token for the new user
    const token = createToken(user._id);

    // Send back the token and user info (never send password!)
    res.status(201).json({
      message: "Account created successfully!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

// ============================================================
// POST /api/auth/login
// Checks credentials and returns a JWT token
// ============================================================

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Check if password is correct using the method we defined in User model
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Create a JWT token
    const token = createToken(user._id);

    // Send token and user info back to frontend
    res.json({
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

// ============================================================
// GET /api/auth/me
// Returns the currently logged-in user's info
// (Protected route - requires valid JWT token)
// ============================================================

const getMe = async (req, res) => {
  try {
    // req.user is set by our authMiddleware
    const user = await User.findById(req.user._id).select("-password");
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = { signup, login, getMe };
