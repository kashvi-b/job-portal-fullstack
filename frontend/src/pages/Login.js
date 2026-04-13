// ============================================================
// src/pages/Login.js
// ============================================================

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as loginAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Form state
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Update form state on input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default browser form submission
    setError("");
    setLoading(true);

    try {
      // Call the login API
      const { data } = await loginAPI(formData);

      // Save token and user to context + localStorage
      login(data.token, data.user);

      // Redirect based on role
      if (data.user.role === "recruiter") {
        navigate("/recruiter/dashboard");
      } else {
        navigate("/seeker/dashboard");
      }
    } catch (err) {
      // Show error message from backend
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>Sign in to your account</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
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
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", padding: "12px" }}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p style={styles.switchText}>
          Don't have an account?{" "}
          <Link to="/signup" style={styles.link}>
            Sign up
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
    minHeight: "80vh",
    padding: "20px",
  },
  card: {
    background: "white",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "420px",
  },
  title: { fontSize: "26px", fontWeight: "700", marginBottom: "6px" },
  subtitle: { color: "#64748b", marginBottom: "28px", fontSize: "14px" },
  switchText: { textAlign: "center", marginTop: "20px", fontSize: "14px", color: "#64748b" },
  link: { color: "#2563eb", textDecoration: "none", fontWeight: "500" },
};

export default Login;
