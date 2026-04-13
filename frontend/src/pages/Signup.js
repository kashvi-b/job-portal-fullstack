// ============================================================
// src/pages/Signup.js
// ============================================================

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup as signupAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "seeker", // Default role
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await signupAPI(formData);
      login(data.token, data.user); // Auto-login after signup

      if (data.user.role === "recruiter") {
        navigate("/recruiter/dashboard");
      } else {
        navigate("/seeker/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>Join JobPortal today - it's free!</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password (min 6 characters)</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          {/* Role Selection - this is important! */}
          <div className="form-group">
            <label>I am a...</label>
            <div style={styles.roleSelector}>
              <label style={styles.roleOption}>
                <input
                  type="radio"
                  name="role"
                  value="seeker"
                  checked={formData.role === "seeker"}
                  onChange={handleChange}
                />
                <div
                  style={{
                    ...styles.roleCard,
                    ...(formData.role === "seeker" ? styles.roleCardActive : {}),
                  }}
                >
                  <span style={{ fontSize: "24px" }}>👤</span>
                  <span style={{ fontWeight: "500" }}>Job Seeker</span>
                  <span style={styles.roleDesc}>Looking for a job</span>
                </div>
              </label>

              <label style={styles.roleOption}>
                <input
                  type="radio"
                  name="role"
                  value="recruiter"
                  checked={formData.role === "recruiter"}
                  onChange={handleChange}
                />
                <div
                  style={{
                    ...styles.roleCard,
                    ...(formData.role === "recruiter" ? styles.roleCardActive : {}),
                  }}
                >
                  <span style={{ fontSize: "24px" }}>🏢</span>
                  <span style={{ fontWeight: "500" }}>Recruiter</span>
                  <span style={styles.roleDesc}>Hiring talent</span>
                </div>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", padding: "12px" }}
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p style={styles.switchText}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "85vh",
    padding: "20px",
  },
  card: {
    background: "white",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "460px",
  },
  title: { fontSize: "26px", fontWeight: "700", marginBottom: "6px" },
  subtitle: { color: "#64748b", marginBottom: "28px", fontSize: "14px" },
  roleSelector: { display: "flex", gap: "12px" },
  roleOption: { flex: 1, cursor: "pointer" },
  roleCard: {
    border: "2px solid #e2e8f0",
    borderRadius: "8px",
    padding: "14px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    fontSize: "14px",
    transition: "all 0.2s",
  },
  roleCardActive: {
    border: "2px solid #2563eb",
    background: "#eff6ff",
  },
  roleDesc: { fontSize: "12px", color: "#64748b" },
  switchText: { textAlign: "center", marginTop: "20px", fontSize: "14px", color: "#64748b" },
  link: { color: "#2563eb", textDecoration: "none", fontWeight: "500" },
};

export default Signup;
