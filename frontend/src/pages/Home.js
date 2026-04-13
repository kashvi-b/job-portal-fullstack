// ============================================================
// src/pages/Home.js - Landing Page
// ============================================================

import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { isLoggedIn, isRecruiter, isSeeker } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            Find Your Dream Job <br />
            <span style={styles.highlight}>or Hire Top Talent</span>
          </h1>
          <p style={styles.heroSubtitle}>
            Connect job seekers with great companies. Browse thousands of job
            listings or post your openings today.
          </p>

          <div style={styles.heroBtns}>
            <Link to="/jobs" className="btn btn-primary">
              Browse Jobs
            </Link>

            {/* Show different buttons based on login state */}
            {!isLoggedIn && (
              <Link to="/signup" className="btn btn-outline">
                Get Started →
              </Link>
            )}
            {isSeeker && (
              <Link to="/seeker/dashboard" className="btn btn-outline">
                My Dashboard
              </Link>
            )}
            {isRecruiter && (
              <Link to="/post-job" className="btn btn-outline">
                Post a Job
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container" style={{ marginTop: "40px" }}>
        <div className="grid-3" style={{ marginBottom: "40px" }}>
          <div className="card" style={{ textAlign: "center" }}>
            <div style={styles.statNumber}>500+</div>
            <div style={styles.statLabel}>Jobs Available</div>
          </div>
          <div className="card" style={{ textAlign: "center" }}>
            <div style={styles.statNumber}>200+</div>
            <div style={styles.statLabel}>Companies Hiring</div>
          </div>
          <div className="card" style={{ textAlign: "center" }}>
            <div style={styles.statNumber}>1000+</div>
            <div style={styles.statLabel}>Job Seekers</div>
          </div>
        </div>

        {/* How it works */}
        <h2 style={styles.sectionTitle}>How It Works</h2>
        <div className="grid-2" style={{ marginBottom: "40px" }}>
          {/* For Job Seekers */}
          <div className="card">
            <h3 style={styles.cardTitle}>👤 For Job Seekers</h3>
            <ol style={styles.list}>
              <li>Create your account as a Job Seeker</li>
              <li>Complete your profile and upload your resume</li>
              <li>Search and filter jobs by title, location, or type</li>
              <li>Apply to jobs with a cover letter</li>
              <li>Track your application status in your dashboard</li>
            </ol>
            <Link to="/signup" className="btn btn-primary" style={{ marginTop: "16px" }}>
              Sign Up as Seeker
            </Link>
          </div>

          {/* For Recruiters */}
          <div className="card">
            <h3 style={styles.cardTitle}>🏢 For Recruiters</h3>
            <ol style={styles.list}>
              <li>Create your account as a Recruiter</li>
              <li>Set up your company profile</li>
              <li>Post job openings with requirements</li>
              <li>Review incoming applications</li>
              <li>Accept or reject candidates</li>
            </ol>
            <Link to="/signup" className="btn btn-primary" style={{ marginTop: "16px" }}>
              Sign Up as Recruiter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  hero: {
    background: "linear-gradient(135deg, #1e40af 0%, #2563eb 100%)",
    color: "white",
    padding: "80px 20px",
    textAlign: "center",
  },
  heroContent: {
    maxWidth: "700px",
    margin: "0 auto",
  },
  heroTitle: {
    fontSize: "42px",
    fontWeight: "800",
    marginBottom: "20px",
    lineHeight: "1.2",
  },
  highlight: {
    color: "#93c5fd",
  },
  heroSubtitle: {
    fontSize: "18px",
    opacity: "0.9",
    marginBottom: "32px",
    lineHeight: "1.6",
  },
  heroBtns: {
    display: "flex",
    gap: "16px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  statNumber: {
    fontSize: "36px",
    fontWeight: "800",
    color: "#2563eb",
    marginBottom: "8px",
  },
  statLabel: {
    fontSize: "14px",
    color: "#64748b",
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: "24px",
    fontWeight: "700",
    marginBottom: "24px",
    color: "#0f172a",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "16px",
    color: "#0f172a",
  },
  list: {
    paddingLeft: "20px",
    color: "#475569",
    lineHeight: "2",
    fontSize: "14px",
  },
};

export default Home;
