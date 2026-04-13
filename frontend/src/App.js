// ============================================================
// src/App.js - Main App Component with Routing
//
// React Router lets us create a "Single Page Application" (SPA)
// - The page doesn't reload when you navigate between pages
// - React swaps out components based on the URL
// ============================================================

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Import all pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import JobListings from "./pages/JobListings";
import JobDetails from "./pages/JobDetails";
import SeekerDashboard from "./pages/SeekerDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import PostJob from "./pages/PostJob";
import Applications from "./pages/Applications";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";

import "./App.css";

// ============================================================
// Protected Route Component
// Redirects to login if user is not authenticated
// Usage: <ProtectedRoute> <SomePage /> </ProtectedRoute>
// ============================================================

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isLoggedIn, user } = useAuth();

  if (!isLoggedIn) {
    // Not logged in → redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Wrong role → redirect to home
    return <Navigate to="/" replace />;
  }

  return children;
};

// ============================================================
// App Routes - All pages and their URLs
// ============================================================

function AppRoutes() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: "calc(100vh - 70px)", padding: "20px" }}>
        <Routes>
          {/* Public Routes - anyone can visit */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/jobs" element={<JobListings />} />
          <Route path="/jobs/:id" element={<JobDetails />} />

          {/* Protected Routes for Job Seekers */}
          <Route
            path="/seeker/dashboard"
            element={
              <ProtectedRoute requiredRole="seeker">
                <SeekerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes for Recruiters */}
          <Route
            path="/recruiter/dashboard"
            element={
              <ProtectedRoute requiredRole="recruiter">
                <RecruiterDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/post-job"
            element={
              <ProtectedRoute requiredRole="recruiter">
                <PostJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/applications/:jobId"
            element={
              <ProtectedRoute requiredRole="recruiter">
                <Applications />
              </ProtectedRoute>
            }
          />

          {/* Catch-all: redirect unknown URLs to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}

// Wrap everything in AuthProvider so all components can access auth state
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
