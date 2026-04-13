// ============================================================
// models/User.js - User Database Schema
//
// A "schema" is like a blueprint that tells MongoDB
// what shape our data should be in.
// ============================================================

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // Library to hash passwords

const userSchema = new mongoose.Schema(
  {
    // Basic info
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true, // Remove extra whitespace
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // No two users can have the same email
      lowercase: true, // Always store as lowercase
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },

    // Role determines what the user can do
    // 'seeker' = can apply to jobs
    // 'recruiter' = can post jobs
    role: {
      type: String,
      enum: ["seeker", "recruiter"], // Only these two values are allowed
      required: true,
    },

    // Profile info for Job Seekers
    bio: { type: String, default: "" },
    skills: [String], // Array of skills like ["React", "Node.js"]
    resumeLink: { type: String, default: "" }, // URL to their resume
    resumeFile: { type: String, default: "" }, // Uploaded file path

    // Profile info for Recruiters
    companyName: { type: String, default: "" },
    companyDescription: { type: String, default: "" },
    companyWebsite: { type: String, default: "" },

    // Profile picture URL
    profilePicture: { type: String, default: "" },
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

// ============================================================
// PASSWORD HASHING
// Before saving a user, we hash their password
// Hashing = converting plain text to an unreadable format
// Even if the database is hacked, passwords are safe!
//
// "pre save" means: "before saving to database, do this"
// ============================================================

userSchema.pre("save", async function (next) {
  // Only hash if password was changed (not on other updates)
  if (!this.isModified("password")) return next();

  // bcrypt.hash(password, saltRounds)
  // saltRounds = 10 means it hashes 2^10 = 1024 times (very secure!)
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// ============================================================
// METHOD: comparePassword
// We add a custom method to the User model
// Used during login to check if the password is correct
// ============================================================

userSchema.methods.comparePassword = async function (candidatePassword) {
  // bcrypt.compare checks if candidatePassword matches the stored hash
  return await bcrypt.compare(candidatePassword, this.password);
};

// Create and export the User model
// mongoose.model("User", schema) creates a "Users" collection in MongoDB
module.exports = mongoose.model("User", userSchema);
