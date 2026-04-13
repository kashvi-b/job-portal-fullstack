// ============================================================
// src/context/AuthContext.js - Global Authentication State
//
// WHY DO WE NEED THIS?
// Many components need to know: "Is the user logged in? Who are they?"
// Instead of passing this info through every component (prop drilling),
// we use React Context - a way to share data globally.
//
// Think of Context like a global variable that any component can read.
// ============================================================

import React, { createContext, useContext, useState, useEffect } from "react";
import { getMe } from "../services/api";

// Step 1: Create the Context
const AuthContext = createContext();

// Step 2: Create a Provider component that wraps our entire app
// This Provider holds the shared state and functions
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);       // Logged-in user data
  const [loading, setLoading] = useState(true); // Are we checking auth status?

  // When the app first loads, check if there's a saved token
  // This keeps the user logged in even after page refresh
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          // Verify token is still valid by calling /auth/me
          const { data } = await getMe();
          setUser(data.user);
        } catch (error) {
          // Token is invalid or expired - clear it
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }

      setLoading(false); // Done checking
    };

    checkLoggedIn();
  }, []);

  // Login function - saves token and user to state + localStorage
  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // Logout function - clears everything
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // Update user data (e.g., after profile update)
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  // Value = everything we want to share with the whole app
  const value = {
    user,          // The logged-in user object (null if not logged in)
    loading,       // True while checking auth status
    login,         // Call this after successful login
    logout,        // Call this to log out
    updateUser,    // Call this to update user data
    isLoggedIn: !!user,           // Boolean: is user logged in?
    isRecruiter: user?.role === "recruiter", // Is user a recruiter?
    isSeeker: user?.role === "seeker",       // Is user a seeker?
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Don't render anything while checking auth status */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Step 3: Custom hook to easily use auth context in any component
// Usage: const { user, login, logout } = useAuth();
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
