// ============================================================
// models/Application.js - Job Application Schema
//
// This stores when a seeker applies to a job.
// It links a User (seeker) to a Job.
// ============================================================

const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    // Which job is this application for?
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job", // Points to Job model
      required: true,
    },

    // Who applied? (the job seeker)
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Points to User model
      required: true,
    },

    // Cover letter / message from the applicant
    coverLetter: {
      type: String,
      default: "",
    },

    // Application status - recruiter can change this
    status: {
      type: String,
      enum: ["Pending", "Reviewed", "Accepted", "Rejected"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent a user from applying to the same job twice
// This creates a "compound index" - unique combination of job + applicant
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
