// ============================================================
// src/pages/PostJob.js - Recruiter posts a new job
// ============================================================

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createJob } from "../services/api";

const PostJob = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
    jobType: "Full-time",
    requirements: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Convert requirements from comma-separated string to array
      // "React, Node.js, MongoDB" → ["React", "Node.js", "MongoDB"]
      const jobData = {
        ...formData,
        requirements: formData.requirements
          .split(",")
          .map((r) => r.trim())
          .filter((r) => r), // Remove empty strings
      };

      await createJob(jobData);
      alert("Job posted successfully!");
      navigate("/recruiter/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post job.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: "20px", maxWidth: "700px" }}>
      <h1 className="page-title">Post a New Job</h1>

      <div className="card">
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Job Title *</label>
            <input
              type="text"
              name="title"
              placeholder="e.g. Frontend Developer, Data Analyst"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>Location *</label>
              <input
                type="text"
                name="location"
                placeholder="e.g. Remote, New York, London"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Job Type</label>
              <select name="jobType" value={formData.jobType} onChange={handleChange}>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Salary</label>
            <input
              type="text"
              name="salary"
              placeholder="e.g. $50,000 - $70,000/year or Not disclosed"
              value={formData.salary}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Job Description *</label>
            <textarea
              name="description"
              placeholder="Describe the role, responsibilities, and what a typical day looks like..."
              value={formData.description}
              onChange={handleChange}
              rows={6}
              required
            />
          </div>

          <div className="form-group">
            <label>Requirements (comma-separated)</label>
            <input
              type="text"
              name="requirements"
              placeholder="e.g. React, 2+ years experience, Bachelor's degree"
              value={formData.requirements}
              onChange={handleChange}
            />
            <small style={{ color: "#64748b", fontSize: "12px", marginTop: "4px", display: "block" }}>
              Separate each requirement with a comma
            </small>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: "12px 28px" }}
              disabled={loading}
            >
              {loading ? "Posting..." : "Post Job"}
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
