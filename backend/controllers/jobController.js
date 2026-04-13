// ============================================================
// controllers/jobController.js - Job Management Logic
// ============================================================

const Job = require("../models/Job");

// ============================================================
// GET /api/jobs
// Get all active jobs (with search and filter support)
// This is a PUBLIC route - no login required
// ============================================================

const getAllJobs = async (req, res) => {
  try {
    // Get search params from URL query string
    // Example: /api/jobs?search=developer&location=remote&type=Full-time
    const { search, location, type } = req.query;

    // Build a filter object for MongoDB
    let filter = { isActive: true }; // Only show active jobs

    // If search term provided, search in title and description
    // $regex = MongoDB's "contains" search (like SQL LIKE)
    // $options: "i" = case insensitive
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
      ];
    }

    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    if (type) {
      filter.jobType = type;
    }

    // Find jobs matching the filter
    // .populate("postedBy", "name email") means: instead of just storing the ID,
    // fetch the actual recruiter data (name and email fields only)
    const jobs = await Job.find(filter)
      .populate("postedBy", "name companyName")
      .sort({ createdAt: -1 }); // Newest jobs first

    res.json({ jobs, count: jobs.length });
  } catch (error) {
    console.error("Get jobs error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// ============================================================
// GET /api/jobs/:id
// Get a single job by ID
// ============================================================

const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "postedBy",
      "name email companyName companyDescription"
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }

    res.json({ job });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

// ============================================================
// POST /api/jobs
// Create a new job (RECRUITER ONLY)
// ============================================================

const createJob = async (req, res) => {
  try {
    const { title, description, requirements, location, salary, jobType } =
      req.body;

    // req.user is set by the protect middleware (the logged-in recruiter)
    const job = await Job.create({
      title,
      description,
      requirements: requirements || [],
      location,
      salary,
      jobType,
      company: req.user.companyName || req.user.name, // Use company name if set
      postedBy: req.user._id, // Link this job to the recruiter
    });

    res.status(201).json({ message: "Job posted successfully!", job });
  } catch (error) {
    console.error("Create job error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// ============================================================
// PUT /api/jobs/:id
// Update a job (RECRUITER ONLY - must be the owner)
// ============================================================

const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }

    // Check if the logged-in recruiter owns this job
    // .toString() converts MongoDB ObjectId to a regular string for comparison
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only edit your own jobs." });
    }

    // Update the job with new data
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Return the updated document, not the old one
    );

    res.json({ message: "Job updated!", job: updatedJob });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

// ============================================================
// DELETE /api/jobs/:id
// Delete a job (RECRUITER ONLY - must be the owner)
// ============================================================

const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only delete your own jobs." });
    }

    await Job.findByIdAndDelete(req.params.id);

    res.json({ message: "Job deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

// ============================================================
// GET /api/jobs/recruiter/myjobs
// Get all jobs posted by the logged-in recruiter
// ============================================================

const getMyPostedJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }).sort({
      createdAt: -1,
    });

    res.json({ jobs });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getMyPostedJobs,
};
