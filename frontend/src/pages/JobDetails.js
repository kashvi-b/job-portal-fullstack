// ============================================================
// src/pages/JobDetails.js
// Shows full job details + apply button for seekers
//
// HOW A JOB APPLICATION WORKS (Step by Step):
// 1. Seeker opens job details page
// 2. Clicks "Apply Now"
// 3. Writes a cover letter
// 4. Clicks submit
// 5. Frontend calls POST /api/applications with job ID + cover letter
// 6. Backend saves Application in MongoDB
// 7. Recruiter can now see this application
// ============================================================

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getJobById, applyToJob } from "../services/api";
import { useAuth } from "../context/AuthContext";

const JobDetails = () => {
  const { id } = useParams(); // Get job ID from URL (/jobs/:id)
  const navigate = useNavigate();
  const { isLoggedIn, isSeeker } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Apply modal state
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState("");

  // Fetch job details when component loads
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await getJobById(id);
        setJob(data.job);
      } catch (err) {
        setError("Job not found or an error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]); // Re-run if ID changes

  // Handle job application submission
  const handleApply = async (e) => {
    e.preventDefault();
    setApplyError("");
    setApplying(true);

    try {
      await applyToJob({ jobId: id, coverLetter });
      setApplySuccess(true);
      setShowApplyForm(false);
    } catch (err) {
      setApplyError(
        err.response?.data?.message || "Application failed. Please try again."
      );
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="spinner"><p>Loading job details...</p></div>;
  if (error) return <div className="container"><div className="alert alert-error">{error}</div></div>;
  if (!job) return null;

  return (
    <div className="container" style={{ paddingTop: "20px", maxWidth: "800px" }}>
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        style={styles.backBtn}
      >
        ← Back to Jobs
      </button>

      {/* Job Header Card */}
      <div className="card" style={{ marginBottom: "20px" }}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.jobTitle}>{job.title}</h1>
            <p style={styles.company}>🏢 {job.company}</p>
          </div>
          <span style={styles.typeBadge}>{job.jobType}</span>
        </div>

        <div style={styles.meta}>
          <span>📍 {job.location}</span>
          <span>💰 {job.salary}</span>
          <span>📅 Posted {new Date(job.createdAt).toLocaleDateString()}</span>
        </div>

        {/* Apply Button */}
        {applySuccess ? (
          <div className="alert alert-success" style={{ marginTop: "16px" }}>
            ✅ Application submitted successfully! You can track it in your dashboard.
          </div>
        ) : (
          <div style={{ marginTop: "20px" }}>
            {isLoggedIn && isSeeker ? (
              <button
                className="btn btn-primary"
                style={{ padding: "12px 28px" }}
                onClick={() => setShowApplyForm(!showApplyForm)}
              >
                {showApplyForm ? "Cancel" : "Apply Now"}
              </button>
            ) : !isLoggedIn ? (
              <button
                className="btn btn-primary"
                onClick={() => navigate("/login")}
              >
                Login to Apply
              </button>
            ) : null}
          </div>
        )}

        {/* Apply Form (shown when Apply Now is clicked) */}
        {showApplyForm && (
          <div style={styles.applyForm}>
            <h3 style={{ marginBottom: "16px" }}>Submit Your Application</h3>
            {applyError && <div className="alert alert-error">{applyError}</div>}
            <form onSubmit={handleApply}>
              <div className="form-group">
                <label>Cover Letter (Tell them why you're a great fit!)</label>
                <textarea
                  placeholder="Write a brief cover letter..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={5}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-success"
                disabled={applying}
              >
                {applying ? "Submitting..." : "Submit Application"}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Job Description */}
      <div className="card" style={{ marginBottom: "20px" }}>
        <h2 style={styles.sectionTitle}>Job Description</h2>
        <p style={styles.description}>{job.description}</p>
      </div>

      {/* Requirements */}
      {job.requirements && job.requirements.length > 0 && (
        <div className="card" style={{ marginBottom: "20px" }}>
          <h2 style={styles.sectionTitle}>Requirements</h2>
          <ul style={styles.list}>
            {job.requirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </div>
      )}

      {/* About the Company */}
      {job.postedBy && (
        <div className="card">
          <h2 style={styles.sectionTitle}>About the Company</h2>
          <p style={{ fontWeight: "500", marginBottom: "8px" }}>
            {job.postedBy.companyName || job.postedBy.name}
          </p>
          {job.postedBy.companyDescription && (
            <p style={styles.description}>{job.postedBy.companyDescription}</p>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  backBtn: {
    background: "none",
    border: "none",
    color: "#2563eb",
    cursor: "pointer",
    fontSize: "14px",
    marginBottom: "16px",
    padding: "0",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "16px",
  },
  jobTitle: { fontSize: "26px", fontWeight: "700", marginBottom: "6px" },
  company: { fontSize: "16px", color: "#2563eb", fontWeight: "500" },
  typeBadge: {
    background: "#eff6ff",
    color: "#1d4ed8",
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "500",
  },
  meta: {
    display: "flex",
    gap: "20px",
    color: "#64748b",
    fontSize: "14px",
    flexWrap: "wrap",
  },
  applyForm: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "20px",
    marginTop: "20px",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "16px",
    color: "#0f172a",
  },
  description: { color: "#475569", lineHeight: "1.7", fontSize: "14px" },
  list: {
    paddingLeft: "20px",
    color: "#475569",
    lineHeight: "2",
    fontSize: "14px",
  },
};

export default JobDetails;
