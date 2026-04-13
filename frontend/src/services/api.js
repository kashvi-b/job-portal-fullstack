// ============================================================
// src/services/api.js - API Service
//
// HOW FRONTEND CALLS BACKEND:
// We use axios, a library that makes HTTP requests easy.
// All API calls go through this file so we have one place
// to manage API URLs and authentication headers.
//
// The base URL points to our backend server.
// In development: http://localhost:5000
// In production: your deployed backend URL
// ============================================================

import axios from "axios";

// Create an axios instance with default settings
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

// ============================================================
// INTERCEPTOR: Automatically add JWT token to every request
//
// An interceptor runs before every request is sent.
// Here we add the Authorization header automatically
// so we don't have to do it manually in every API call.
// ============================================================

API.interceptors.request.use((config) => {
  // Get token from localStorage (stored after login)
  const token = localStorage.getItem("token");

  if (token) {
    // Add token to request header
    // Backend's authMiddleware reads this header
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ============================================================
// AUTH API CALLS
// ============================================================

export const signup = (userData) => API.post("/auth/signup", userData);
export const login = (credentials) => API.post("/auth/login", credentials);
export const getMe = () => API.get("/auth/me");

// ============================================================
// JOB API CALLS
// ============================================================

// Get all jobs (with optional search params)
// Example: getAllJobs({ search: "react", location: "remote" })
export const getAllJobs = (params) => API.get("/jobs", { params });

// Get single job by ID
export const getJobById = (id) => API.get(`/jobs/${id}`);

// Post a new job (recruiter only)
export const createJob = (jobData) => API.post("/jobs", jobData);

// Update a job
export const updateJob = (id, jobData) => API.put(`/jobs/${id}`, jobData);

// Delete a job
export const deleteJob = (id) => API.delete(`/jobs/${id}`);

// Get recruiter's own posted jobs
export const getMyPostedJobs = () => API.get("/jobs/recruiter/myjobs");

// ============================================================
// APPLICATION API CALLS
// ============================================================

// Apply to a job
export const applyToJob = (applicationData) =>
  API.post("/applications", applicationData);

// Get seeker's applied jobs
export const getMyApplications = () => API.get("/applications/my-applications");

// Get all applications for a specific job (recruiter)
export const getApplicationsForJob = (jobId) =>
  API.get(`/applications/job/${jobId}`);

// Accept or reject an application
export const updateApplicationStatus = (applicationId, status) =>
  API.put(`/applications/${applicationId}/status`, { status });

// ============================================================
// PROFILE API CALLS
// ============================================================

export const getProfile = () => API.get("/profile");

// For profile updates with file upload, we need FormData (not JSON)
export const updateProfile = (formData) =>
  API.put("/profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export default API;
