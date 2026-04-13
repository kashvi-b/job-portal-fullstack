// ============================================================
// middleware/authMiddleware.js - JWT Authentication Middleware
//
// HOW AUTHENTICATION WORKS:
// 1. User logs in → server creates a JWT token → sends to frontend
// 2. Frontend stores token in localStorage
// 3. Every protected API request includes token in the header:
//    Authorization: Bearer <token>
// 4. This middleware checks if the token is valid
// 5. If valid → allow request to continue
// 6. If invalid → return 401 Unauthorized error
//
// Think of JWT like a hotel key card:
// - Login = check-in, you get a key card (token)
// - Each room entry = API request with the key card
// - Key card expires after a set time
// ============================================================

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    let token;

    // Check if Authorization header exists and starts with "Bearer"
    // Headers look like: Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // Extract the token (remove "Bearer " prefix)
      token = req.headers.authorization.split(" ")[1];
    }

    // If no token found, user is not logged in
    if (!token) {
      return res.status(401).json({ message: "Not authorized. Please log in." });
    }

    // Verify the token using our secret key
    // If token is fake or expired, jwt.verify() throws an error
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user this token belongs to
    // decoded.userId is the ID we put in the token when user logged in
    const user = await User.findById(decoded.userId).select("-password");
    // .select("-password") means: get user but EXCLUDE the password field

    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    // Attach user info to the request object
    // Now any route after this middleware can access req.user
    req.user = user;

    // Call next() to move to the actual route handler
    next();
  } catch (error) {
    // This catches expired tokens, invalid tokens, etc.
    return res.status(401).json({ message: "Not authorized. Token invalid." });
  }
};

// Middleware to check if user is a recruiter
const recruiterOnly = (req, res, next) => {
  if (req.user && req.user.role === "recruiter") {
    next(); // User is a recruiter, continue
  } else {
    res.status(403).json({ message: "Access denied. Recruiters only." });
  }
};

// Middleware to check if user is a job seeker
const seekerOnly = (req, res, next) => {
  if (req.user && req.user.role === "seeker") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Job seekers only." });
  }
};

module.exports = { protect, recruiterOnly, seekerOnly };
