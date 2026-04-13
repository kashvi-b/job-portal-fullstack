// ============================================================
// src/pages/RecruiterDashboard.js
// ============================================================

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyPostedJobs, deleteJob } from "../services/api";
import { useAuth } from "../context/AuthContext";

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await getMyPostedJobs();
        setJobs(data.jobs);
      } catch (err) {
        console.error("Failed to load jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await deleteJob(jobId);
      setJobs(jobs.filter((j) => j._id !== jobId)); // Remove from UI
    } catch (err) {
      alert("Failed to delete job.");
    }
  };

  return (
    <div className="container" style={{ paddingTop: "20px" }}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Recruiter Dashboard</h1>
          <p style={styles.subtitle}>Welcome back, {user.name}</p>
        </div>
        <Link to="/post-job" className="btn btn-primary">
          + Post New Job
        </Link>
      </div>

      {/* Stats */}
      <div className="grid-2" style={{ marginBottom: "24px" }}>
        <div className="card" style={{ textAlign: "center" }}>
          <div style={styles.statNum}>{jobs.length}</div>
          <div style={styles.statLabel}>Jobs Posted</div>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <div style={{ ...styles.statNum, color: "#16a34a" }}>
            {jobs.filter((j) => j.isActive).length}
          </div>
          <div style={styles.statLabel}>Active Jobs</div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="card">
        <h2 style={styles.sectionTitle}>Your Job Postings</h2>

        {loading && <div className="spinner"><p>Loading...</p></div>}

        {!loading && jobs.length === 0 && (
          <div className="empty-state">
            <h3>No jobs posted yet</h3>
            <p>Start attracting candidates by posting your first job!</p>
            <Link to="/post-job" className="btn btn-primary" style={{ marginTop: "16px" }}>
              Post a Job
            </Link>
          </div>
        )}

        {!loading && jobs.map((job) => (
          <div key={job._id} style={styles.jobRow}>
            <div>
              <h3 style={styles.jobTitle}>{job.title}</h3>
              <p style={styles.jobMeta}>
                📍 {job.location} • {job.jobType} • Posted{" "}
                {new Date(job.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div style={styles.jobActions}>
              {/* View Applications for this job */}
              <Link
                to={`/applications/${job._id}`}
                className="btn btn-outline btn-sm"
              >
                View Applications
              </Link>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDelete(job._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "24px",
    flexWrap: "wrap",
    gap: "16px",
  },
  title: { fontSize: "24px", fontWeight: "700" },
  subtitle: { color: "#64748b", fontSize: "14px", marginTop: "4px" },
  statNum: { fontSize: "32px", fontWeight: "700", color: "#2563eb", marginBottom: "6px" },
  statLabel: { fontSize: "13px", color: "#64748b" },
  sectionTitle: { fontSize: "18px", fontWeight: "600", marginBottom: "20px" },
  jobRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 0",
    borderBottom: "1px solid #f1f5f9",
    flexWrap: "wrap",
    gap: "12px",
  },
  jobTitle: { fontSize: "16px", fontWeight: "600", marginBottom: "4px" },
  jobMeta: { fontSize: "13px", color: "#64748b" },
  jobActions: { display: "flex", gap: "8px" },
};

export default RecruiterDashboard;
