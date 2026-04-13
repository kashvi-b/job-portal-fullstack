// ============================================================
// controllers/applicationController.js - Job Application Logic
//
// HOW A JOB APPLICATION WORKS:
// 1. Seeker finds a job they like
// 2. They click "Apply" and write a cover letter
// 3. Frontend sends POST /api/applications with job ID
// 4. We store the application in the database
// 5. Recruiter can see all applications for their jobs
// 6. Recruiter can accept or reject applications
// ============================================================

const Application = require("../models/Application");
const Job = require("../models/Job");

// ============================================================
// POST /api/applications
// Apply to a job (SEEKER ONLY)
// ============================================================

const applyToJob = async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;

    // Make sure the job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }

    // Make sure the job is still active
    if (!job.isActive) {
      return res.status(400).json({ message: "This job is no longer accepting applications." });
    }

    // Check if user already applied to this job
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user._id,
    });

    if (existingApplication) {
      return res.status(400).json({ message: "You already applied to this job." });
    }

    // Create the application
    const application = await Application.create({
      job: jobId,
      applicant: req.user._id, // The logged-in seeker
      coverLetter,
    });

    // Populate (fill in) the job and applicant details before sending response
    await application.populate("job", "title company location");

    res.status(201).json({
      message: "Application submitted successfully!",
      application,
    });
  } catch (error) {
    console.error("Apply error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// ============================================================
// GET /api/applications/my-applications
// Get all applications by the logged-in seeker
// ============================================================

const getMyApplications = async (req, res) => {
  try {
    // Find all applications where the applicant is the logged-in user
    const applications = await Application.find({ applicant: req.user._id })
      .populate("job", "title company location jobType salary") // Get job details
      .sort({ createdAt: -1 }); // Newest first

    res.json({ applications });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

// ============================================================
// GET /api/applications/job/:jobId
// Get all applications for a specific job (RECRUITER ONLY)
// ============================================================

const getApplicationsForJob = async (req, res) => {
  try {
    // Verify the recruiter owns this job
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied." });
    }

    // Get all applications for this job, with applicant profile info
    const applications = await Application.find({ job: req.params.jobId })
      .populate("applicant", "name email bio skills resumeLink resumeFile") // Get seeker details
      .populate("job", "title company")
      .sort({ createdAt: -1 });

    res.json({ applications, count: applications.length });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

// ============================================================
// PUT /api/applications/:id/status
// Update application status - Accept or Reject (RECRUITER ONLY)
// ============================================================

const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Validate the status value
    const validStatuses = ["Pending", "Reviewed", "Accepted", "Rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status." });
    }

    // Find the application and populate job info to check ownership
    const application = await Application.findById(req.params.id).populate("job");

    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    // Make sure the recruiter owns the job this application is for
    if (application.job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied." });
    }

    // Update the status
    application.status = status;
    await application.save();

    res.json({ message: `Application ${status}!`, application });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = {
  applyToJob,
  getMyApplications,
  getApplicationsForJob,
  updateApplicationStatus,
};
