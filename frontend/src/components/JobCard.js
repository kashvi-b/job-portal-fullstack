// ============================================================
// src/components/JobCard.js
// Reusable card to display a single job in the listings
// ============================================================

import React from "react";
import { Link } from "react-router-dom";

const JobCard = ({ job }) => {
  // Format the date nicely (e.g., "Jan 15, 2024")
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div style={styles.card}>
      {/* Job Header */}
      <div style={styles.header}>
        <div>
          <h3 style={styles.title}>{job.title}</h3>
          <p style={styles.company}>🏢 {job.company}</p>
        </div>
        <span style={styles.typeBadge}>{job.jobType}</span>
      </div>

      {/* Job Meta Info */}
      <div style={styles.meta}>
        <span>📍 {job.location}</span>
        <span>💰 {job.salary}</span>
        <span>📅 {formatDate(job.createdAt)}</span>
      </div>

      {/* Short description preview */}
      <p style={styles.description}>
        {job.description.length > 150
          ? job.description.substring(0, 150) + "..."
          : job.description}
      </p>

      {/* Skills/Requirements tags */}
      {job.requirements && job.requirements.length > 0 && (
        <div style={styles.tags}>
          {job.requirements.slice(0, 4).map((req, index) => (
            <span key={index} style={styles.tag}>
              {req}
            </span>
          ))}
          {job.requirements.length > 4 && (
            <span style={styles.tag}>+{job.requirements.length - 4} more</span>
          )}
        </div>
      )}

      {/* View Details Button */}
      <Link to={`/jobs/${job._id}`} style={styles.viewBtn}>
        View Details →
      </Link>
    </div>
  );
};

const styles = {
  card: {
    background: "white",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    transition: "box-shadow 0.2s",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: {
    fontSize: "17px",
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: "4px",
  },
  company: {
    fontSize: "14px",
    color: "#2563eb",
    fontWeight: "500",
  },
  typeBadge: {
    background: "#eff6ff",
    color: "#1d4ed8",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "500",
    whiteSpace: "nowrap",
  },
  meta: {
    display: "flex",
    gap: "16px",
    fontSize: "13px",
    color: "#64748b",
    flexWrap: "wrap",
  },
  description: {
    fontSize: "14px",
    color: "#475569",
    lineHeight: "1.6",
  },
  tags: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  tag: {
    background: "#f1f5f9",
    color: "#475569",
    padding: "3px 10px",
    borderRadius: "4px",
    fontSize: "12px",
  },
  viewBtn: {
    alignSelf: "flex-start",
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "500",
    fontSize: "14px",
    marginTop: "4px",
  },
};

export default JobCard;
