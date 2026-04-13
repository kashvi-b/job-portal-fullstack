// ============================================================
// models/Job.js - Job Database Schema
//
// This stores all job postings created by recruiters
// ============================================================

const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    // Job title like "Frontend Developer", "Data Analyst"
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },

    // Detailed job description
    description: {
      type: String,
      required: [true, "Job description is required"],
    },

    // Required skills for the job
    requirements: [String], // e.g. ["React", "2 years experience"]

    // Job location - can be "Remote", "New York", etc.
    location: {
      type: String,
      required: true,
    },

    // Salary range (optional)
    salary: {
      type: String,
      default: "Not disclosed",
    },

    // Job type
    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Internship", "Contract", "Remote"],
      default: "Full-time",
    },

    // Company name (copied from recruiter's profile for easy display)
    company: {
      type: String,
      required: true,
    },

    // Reference to the recruiter who posted this job
    // This creates a relationship: Job → User (recruiter)
    postedBy: {
      type: mongoose.Schema.Types.ObjectId, // MongoDB ID of the recruiter
      ref: "User", // Points to the User model
      required: true,
    },

    // Is this job still accepting applications?
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model("Job", jobSchema);
