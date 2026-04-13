// ============================================================
// routes/applicationRoutes.js - Application Routes
// ============================================================

const express = require("express");
const router = express.Router();
const {
  applyToJob,
  getMyApplications,
  getApplicationsForJob,
  updateApplicationStatus,
} = require("../controllers/applicationController");
const { protect, recruiterOnly, seekerOnly } = require("../middleware/authMiddleware");

// POST /api/applications - Apply to a job (SEEKER ONLY)
router.post("/", protect, seekerOnly, applyToJob);

// GET /api/applications/my-applications - Seeker's applied jobs
router.get("/my-applications", protect, seekerOnly, getMyApplications);

// GET /api/applications/job/:jobId - Applications for a job (RECRUITER ONLY)
router.get("/job/:jobId", protect, recruiterOnly, getApplicationsForJob);

// PUT /api/applications/:id/status - Accept/Reject (RECRUITER ONLY)
router.put("/:id/status", protect, recruiterOnly, updateApplicationStatus);

module.exports = router;
