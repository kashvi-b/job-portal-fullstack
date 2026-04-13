// ============================================================
// src/pages/Profile.js
// Profile page - works for both seekers and recruiters
// Shows different fields based on user role
// ============================================================

import React, { useState, useEffect } from "react";
import { getProfile, updateProfile } from "../services/api";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user, updateUser, isSeeker, isRecruiter } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    skills: "",
    resumeLink: "",
    companyName: "",
    companyDescription: "",
    companyWebsite: "",
  });

  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Load profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await getProfile();
        const u = data.user;
        setFormData({
          name: u.name || "",
          bio: u.bio || "",
          skills: u.skills ? u.skills.join(", ") : "", // Array to comma string
          resumeLink: u.resumeLink || "",
          companyName: u.companyName || "",
          companyDescription: u.companyDescription || "",
          companyWebsite: u.companyWebsite || "",
        });
      } catch (err) {
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      // We use FormData to support file uploads (resume)
      const form = new FormData();
      form.append("name", formData.name);
      form.append("bio", formData.bio);
      form.append("resumeLink", formData.resumeLink);
      form.append("companyName", formData.companyName);
      form.append("companyDescription", formData.companyDescription);
      form.append("companyWebsite", formData.companyWebsite);

      // Convert skills from "React, Node.js" to ["React", "Node.js"]
      const skillsArray = formData.skills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s);
      skillsArray.forEach((skill) => form.append("skills", skill));

      // Append resume file if selected
      if (resumeFile) {
        form.append("resume", resumeFile);
      }

      const { data } = await updateProfile(form);
      updateUser(data.user); // Update auth context
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="spinner"><p>Loading profile...</p></div>;

  return (
    <div className="container" style={{ paddingTop: "20px", maxWidth: "700px" }}>
      <h1 className="page-title">My Profile</h1>

      <div className="card">
        {/* Role badge */}
        <div style={styles.roleBadge}>
          <span style={isSeeker ? styles.seekerBadge : styles.recruiterBadge}>
            {isSeeker ? "👤 Job Seeker" : "🏢 Recruiter"}
          </span>
        </div>

        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Common fields */}
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={user.email}
              disabled
              style={{ background: "#f8fafc", color: "#64748b" }}
            />
            <small style={{ color: "#94a3b8", fontSize: "12px" }}>
              Email cannot be changed
            </small>
          </div>

          {/* Job Seeker specific fields */}
          {isSeeker && (
            <>
              <div className="form-group">
                <label>Bio / Summary</label>
                <textarea
                  name="bio"
                  placeholder="Tell employers about yourself, your experience, and goals..."
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label>Skills (comma-separated)</label>
                <input
                  type="text"
                  name="skills"
                  placeholder="e.g. React, Node.js, Python, SQL"
                  value={formData.skills}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Resume Link (Google Drive / LinkedIn / Dropbox)</label>
                <input
                  type="url"
                  name="resumeLink"
                  placeholder="https://drive.google.com/your-resume"
                  value={formData.resumeLink}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Upload Resume (PDF or Word, max 5MB)</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                />
                {user.resumeFile && (
                  <small style={{ color: "#16a34a", fontSize: "12px", marginTop: "4px", display: "block" }}>
                    ✓ Resume already uploaded
                  </small>
                )}
              </div>
            </>
          )}

          {/* Recruiter specific fields */}
          {isRecruiter && (
            <>
              <div className="form-group">
                <label>Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  placeholder="Your company name"
                  value={formData.companyName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Company Description</label>
                <textarea
                  name="companyDescription"
                  placeholder="Tell job seekers about your company culture and mission..."
                  value={formData.companyDescription}
                  onChange={handleChange}
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label>Company Website</label>
                <input
                  type="url"
                  name="companyWebsite"
                  placeholder="https://yourcompany.com"
                  value={formData.companyWebsite}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ padding: "12px 28px" }}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  roleBadge: { marginBottom: "20px" },
  seekerBadge: {
    background: "#eff6ff",
    color: "#1d4ed8",
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "500",
  },
  recruiterBadge: {
    background: "#f0fdf4",
    color: "#15803d",
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "500",
  },
};

export default Profile;
