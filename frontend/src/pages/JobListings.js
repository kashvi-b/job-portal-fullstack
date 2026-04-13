// ============================================================
// src/pages/JobListings.js
// Shows all jobs with search and filter functionality
// ============================================================

import React, { useState, useEffect } from "react";
import { getAllJobs } from "../services/api";
import JobCard from "../components/JobCard";

const JobListings = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search and filter state
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");

  // Fetch jobs when component loads OR when filters change
  useEffect(() => {
    fetchJobs();
  }, []); // Empty array = run once on mount

  const fetchJobs = async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await getAllJobs(params);
      setJobs(data.jobs);
    } catch (err) {
      setError("Failed to load jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    // Send search params to backend
    fetchJobs({
      search: search || undefined,
      location: location || undefined,
      type: jobType || undefined,
    });
  };

  // Reset all filters
  const handleReset = () => {
    setSearch("");
    setLocation("");
    setJobType("");
    fetchJobs();
  };

  return (
    <div className="container" style={{ paddingTop: "20px" }}>
      <h1 className="page-title">Find Your Next Job</h1>

      {/* Search & Filter Bar */}
      <div className="card" style={{ marginBottom: "24px" }}>
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <input
            type="text"
            placeholder="Search by job title, skills, or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
          <input
            type="text"
            placeholder="Location (e.g., Remote, New York)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={styles.filterInput}
          />
          <select
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            style={styles.filterInput}
          >
            <option value="">All Job Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
            <option value="Remote">Remote</option>
          </select>
          <button type="submit" className="btn btn-primary">
            Search
          </button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={handleReset}
          >
            Reset
          </button>
        </form>
      </div>

      {/* Results Info */}
      {!loading && (
        <p style={styles.resultCount}>
          Showing <strong>{jobs.length}</strong> job{jobs.length !== 1 ? "s" : ""}
        </p>
      )}

      {/* Loading State */}
      {loading && (
        <div className="spinner">
          <p>Loading jobs...</p>
        </div>
      )}

      {/* Error State */}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Empty State */}
      {!loading && !error && jobs.length === 0 && (
        <div className="empty-state">
          <h3>No jobs found</h3>
          <p>Try adjusting your search filters</p>
        </div>
      )}

      {/* Job Cards Grid */}
      {!loading && !error && jobs.length > 0 && (
        <div className="grid-2">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  searchForm: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    alignItems: "center",
  },
  searchInput: {
    flex: 2,
    minWidth: "200px",
    padding: "10px 14px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
  },
  filterInput: {
    flex: 1,
    minWidth: "150px",
    padding: "10px 14px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
  },
  resultCount: {
    fontSize: "14px",
    color: "#64748b",
    marginBottom: "16px",
  },
};

export default JobListings;
