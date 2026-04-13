// ============================================================
// src/pages/Applications.js
// Recruiter views all applications for a specific job
// and can accept or reject candidates
// ============================================================

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getApplicationsForJob, updateApplicationStatus } from "../services/api";

const Applications = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobTitle, setJobTitle] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const { data } = await getApplicationsForJob(jobId);
        setApplications(data.applications);
        if (data.applications.length > 0) {
          setJobTitle(data.applications[0].job.title);
        }
      } catch (err) {
        console.error("Failed to load applications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [jobId]);

  // Update application status (Accept/Reject)
  const handleStatusUpdate = async (applicationId, newStatus) => {
    setUpdatingId(applicationId);
    try {
      await updateApplicationStatus(applicationId, newStatus);

      // Update the status in our local state without re-fetching
      setApplications(
        applications.map((app) =>
          app._id === applicationId ? { ...app, status: newStatus } : app
        )
      );
    } catch (err) {
      alert("Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      Pending: "badge badge-pending",
      Reviewed: "badge badge-reviewed",
      Accepted: "badge badge-accepted",
      Rejected: "badge badge-rejected",
    };
    return map[status] || "badge badge-pending";
  };

  return (
    <div className="container" style={{ paddingTop: "20px" }}>
      <button onClick={() => navigate(-1)} style={styles.backBtn}>
        ← Back to Dashboard
      </button>

      <h1 className="page-title">
        Applications {jobTitle && `for "${jobTitle}"`}
      </h1>

      {loading && <div className="spinner"><p>Loading applications...</p></div>}

      {!loading && applications.length === 0 && (
        <div className="empty-state">
          <h3>No applications yet</h3>
          <p>Share your job posting to attract candidates!</p>
        </div>
      )}

      {!loading && applications.map((app) => (
        <div key={app._id} className="card" style={{ marginBottom: "16px" }}>
          <div style={styles.appHeader}>
            <div>
              <h3 style={styles.applicantName}>{app.applicant.name}</h3>
              <p style={styles.applicantEmail}>✉️ {app.applicant.email}</p>
            </div>
            <div style={styles.statusSection}>
              <span className={getStatusBadge(app.status)}>{app.status}</span>
              <span style={styles.appliedDate}>
                Applied {new Date(app.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Applicant Skills */}
          {app.applicant.skills && app.applicant.skills.length > 0 && (
            <div style={styles.skills}>
              <strong style={{ fontSize: "13px" }}>Skills: </strong>
              {app.applicant.skills.map((skill, i) => (
                <span key={i} style={styles.skillTag}>{skill}</span>
              ))}
            </div>
          )}

          {/* Bio */}
          {app.applicant.bio && (
            <p style={styles.bio}>{app.applicant.bio}</p>
          )}

          {/* Resume Link */}
          {app.applicant.resumeLink && (
            <a
              href={app.applicant.resumeLink}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.resumeLink}
            >
              📄 View Resume
            </a>
          )}

          {/* Cover Letter */}
          {app.coverLetter && (
            <div style={styles.coverLetter}>
              <strong style={{ fontSize: "13px", display: "block", marginBottom: "6px" }}>
                Cover Letter:
              </strong>
              <p style={{ fontSize: "14px", color: "#475569", lineHeight: "1.6" }}>
                {app.coverLetter}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div style={styles.actions}>
            <button
              className="btn btn-success btn-sm"
              onClick={() => handleStatusUpdate(app._id, "Accepted")}
              disabled={app.status === "Accepted" || updatingId === app._id}
            >
              ✓ Accept
            </button>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => handleStatusUpdate(app._id, "Rejected")}
              disabled={app.status === "Rejected" || updatingId === app._id}
            >
              ✗ Reject
            </button>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => handleStatusUpdate(app._id, "Reviewed")}
              disabled={updatingId === app._id}
            >
              Mark Reviewed
            </button>
          </div>
        </div>
      ))}
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
  appHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "12px",
    flexWrap: "wrap",
    gap: "12px",
  },
  applicantName: { fontSize: "17px", fontWeight: "600", marginBottom: "4px" },
  applicantEmail: { fontSize: "13px", color: "#64748b" },
  statusSection: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" },
  appliedDate: { fontSize: "12px", color: "#94a3b8" },
  skills: { marginBottom: "10px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "6px" },
  skillTag: {
    background: "#f1f5f9",
    color: "#475569",
    padding: "2px 10px",
    borderRadius: "4px",
    fontSize: "12px",
  },
  bio: { fontSize: "14px", color: "#475569", marginBottom: "10px" },
  resumeLink: { color: "#2563eb", textDecoration: "none", fontSize: "14px", display: "block", marginBottom: "10px" },
  coverLetter: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    padding: "12px",
    marginBottom: "14px",
  },
  actions: { display: "flex", gap: "8px", flexWrap: "wrap" },
};

export default Applications;
