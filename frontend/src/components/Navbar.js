// ============================================================
// src/components/Navbar.js
// Navigation bar shown on every page
// ============================================================

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, isLoggedIn, logout, isRecruiter, isSeeker } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        {/* Logo */}
        <Link to="/" style={styles.logo}>
          💼 JobPortal
        </Link>

        {/* Navigation Links */}
        <div style={styles.links}>
          <Link to="/jobs" style={styles.link}>Find Jobs</Link>

          {/* Show different links based on user role */}
          {isLoggedIn && isSeeker && (
            <>
              <Link to="/seeker/dashboard" style={styles.link}>My Applications</Link>
              <Link to="/profile" style={styles.link}>Profile</Link>
            </>
          )}

          {isLoggedIn && isRecruiter && (
            <>
              <Link to="/recruiter/dashboard" style={styles.link}>My Jobs</Link>
              <Link to="/post-job" style={styles.link}>Post a Job</Link>
              <Link to="/profile" style={styles.link}>Profile</Link>
            </>
          )}

          {/* Show Login/Signup if not logged in, Logout if logged in */}
          {!isLoggedIn ? (
            <>
              <Link to="/login" style={styles.link}>Login</Link>
              <Link to="/signup" style={{ ...styles.link, ...styles.signupBtn }}>
                Sign Up
              </Link>
            </>
          ) : (
            <div style={styles.userSection}>
              <span style={styles.userName}>Hi, {user.name.split(" ")[0]}</span>
              <button onClick={handleLogout} style={styles.logoutBtn}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    background: "white",
    borderBottom: "1px solid #e2e8f0",
    padding: "0 20px",
    height: "65px",
    display: "flex",
    alignItems: "center",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#2563eb",
    textDecoration: "none",
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  link: {
    color: "#374151",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "500",
  },
  signupBtn: {
    background: "#2563eb",
    color: "white",
    padding: "8px 16px",
    borderRadius: "6px",
  },
  userSection: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  userName: {
    fontSize: "14px",
    color: "#374151",
    fontWeight: "500",
  },
  logoutBtn: {
    background: "none",
    border: "1px solid #e2e8f0",
    padding: "7px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    color: "#64748b",
  },
};

export default Navbar;
