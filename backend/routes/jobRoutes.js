// ============================================================
// routes/jobRoutes.js - Job Routes
// ============================================================

const express = require("express");
const router = express.Router();
const {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getMyPostedJobs,
} = require("../controllers/jobController");
const { protect, recruiterOnly } = require("../middleware/authMiddleware");

// GET /api/jobs - Get all jobs (public - no login needed)
router.get("/", getAllJobs);

// GET /api/jobs/recruiter/myjobs - Get recruiter's own jobs (MUST be before /:id)
router.get("/recruiter/myjobs", protect, recruiterOnly, getMyPostedJobs);

// GET /api/jobs/:id - Get a single job (public)
router.get("/:id", getJobById);

// POST /api/jobs - Post a new job (RECRUITER ONLY)
router.post("/", protect, recruiterOnly, createJob);

// PUT /api/jobs/:id - Update a job (RECRUITER ONLY)
router.put("/:id", protect, recruiterOnly, updateJob);

// DELETE /api/jobs/:id - Delete a job (RECRUITER ONLY)
router.delete("/:id", protect, recruiterOnly, deleteJob);

module.exports = router;
