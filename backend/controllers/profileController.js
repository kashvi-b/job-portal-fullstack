// ============================================================
// controllers/profileController.js - User Profile Logic
// ============================================================

const User = require("../models/User");

// ============================================================
// GET /api/profile
// Get logged-in user's profile
// ============================================================

const getProfile = async (req, res) => {
  try {
    // req.user._id comes from the JWT middleware
    const user = await User.findById(req.user._id).select("-password");
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

// ============================================================
// PUT /api/profile
// Update logged-in user's profile
// ============================================================

const updateProfile = async (req, res) => {
  try {
    // Fields a seeker can update
    const {
      name,
      bio,
      skills,
      resumeLink,
      // Recruiter-specific fields
      companyName,
      companyDescription,
      companyWebsite,
    } = req.body;

    // Build an object with only provided fields
    const updates = {};
    if (name) updates.name = name;
    if (bio !== undefined) updates.bio = bio;
    if (skills) updates.skills = skills;
    if (resumeLink !== undefined) updates.resumeLink = resumeLink;
    if (companyName !== undefined) updates.companyName = companyName;
    if (companyDescription !== undefined) updates.companyDescription = companyDescription;
    if (companyWebsite !== undefined) updates.companyWebsite = companyWebsite;

    // If a resume file was uploaded (via multer), save the path
    if (req.file) {
      updates.resumeFile = `/uploads/${req.file.filename}`;
    }

    // Update the user in the database
    // { new: true } returns the updated user, not the old one
    // { runValidators: true } runs schema validations on update
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select("-password");

    res.json({ message: "Profile updated!", user: updatedUser });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = { getProfile, updateProfile };
