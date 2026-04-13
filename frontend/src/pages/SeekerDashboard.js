// ============================================================
// src/pages/SeekerDashboard.js
// Job Seeker's dashboard - shows all their applications
// ============================================================

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyApplications } from "../services/api";
import { useAuth } from "../context/AuthContext";

const SeekerDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const { data } = await getMyApplications();
        setApplications(data.applications);
      } catch (err) {
        console.error("Failed to load applications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Map status to badge class
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
      {/* Welcome Header */}
      <div style={styles.welcomeCard}>
        <div>
          <h1 style={styles.welcomeTitle}>Welcome back, {user.name}! 👋</h1>
          <p style={styles.welcomeSubtitle}>
            Track your job applications here
          </p>
        </div>
        <div style={styles.headerActions}>
          <Link to="/jobs" className="btn btn-primary btn-sm">
            Browse Jobs
          </Link>
          <Link to="/profile" className="btn btn-outline btn-sm">
            Edit Profile
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid-3" style={{ marginBottom: "24px" }}>
        <div className="card" style={{ textAlign: "center" }}>
          <div style={styles.statNum}>{applications.length}</div>
          <div style={styles.statLabel}>Total Applied</div>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <div style={{ ...styles.statNum, color: "#16a34a" }}>
            {applications.filter((a) => a.status === "Accepted").length}
          </div>
          <div style={styles.statLabel}>Accepted</div>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <div style={{ ...styles.statNum, color: "#d97706" }}>
            {applications.filter((a) => a.status === "Pending").length}
          </div>
          <div style={styles.statLabel}>Pending</div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="card">
        <h2 style={styles.sectionTitle}>My Applications</h2>

        {loading && <div className="spinner"><p>Loading applications...</p></div>}

        {!loading && applications.length === 0 && (
          <div className="empty-state">
            <h3>No applications yet</h3>
            <p>Start applying to jobs that match your skills!</p>
            <Link to="/jobs" className="btn btn-primary" style={{ marginTop: "16px" }}>
              Browse Jobs
            </Link>
          </div>
        )}

        {!loading && applications.length > 0 && (
          <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>Job Title</th>
                  <th style={styles.th}>Company</th>
                  <th style={styles.th}>Location</th>
                  <th style={styles.th}>Applied On</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id} style={styles.tableRow}>
                    <td style={styles.td}>
                      <Link
                        to={`/jobs/${app.job._id}`}
                        style={{ color: "#2563eb", textDecoration: "none", fontWeight: "500" }}
                      >
                        {app.job.title}
                      </Link>
                    </td>
                    <td style={styles.td}>{app.job.company}</td>
                    <td style={styles.td}>{app.job.location}</td>
                    <td style={styles.td}>
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td style={styles.td}>
                      <span className={getStatusBadge(app.status)}>
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  welcomeCard: {
    background: "white",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    padding: "24px",
    marginBottom: "24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "16px",
  },
  welcomeTitle: { fontSize: "22px", fontWeight: "700", marginBottom: "4px" },
  welcomeSubtitle: { color: "#64748b", fontSize: "14px" },
  headerActions: { display: "flex", gap: "10px" },
  statNum: { fontSize: "32px", fontWeight: "700", color: "#2563eb", marginBottom: "6px" },
  statLabel: { fontSize: "13px", color: "#64748b" },
  sectionTitle: { fontSize: "18px", fontWeight: "600", marginBottom: "20px" },
  table: { width: "100%", borderCollapse: "collapse" },
  tableHeader: { background: "#f8fafc" },
  th: {
    padding: "12px 16px",
    textAlign: "left",
    fontSize: "13px",
    fontWeight: "600",
    color: "#374151",
    borderBottom: "1px solid #e2e8f0",
  },
  tableRow: { borderBottom: "1px solid #f1f5f9" },
  td: { padding: "14px 16px", fontSize: "14px", color: "#374151" },
};

export default SeekerDashboard;
