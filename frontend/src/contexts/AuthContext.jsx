import React, { createContext, useState, useEffect, useContext } from "react";
import authService from "../services/authService";

// Create the auth context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Check if user is logged in on initial render
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setCurrentUser(user);
    }
    setLoading(false);
  }, []);

  // Register user
  const register = async (userData) => {
    try {
      setError("");
      const response = await authService.register(userData);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to register");
      throw err;
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setError("");
      const response = await authService.login(email, password);

      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setCurrentUser(user);
      }

      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to login");
      throw err;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
  };

  // Verify email
  const verifyEmail = async (token) => {
    try {
      setError("");
      const response = await authService.verifyEmail(token);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to verify email");
      throw err;
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      setError("");
      const response = await authService.forgotPassword(email);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to process request");
      throw err;
    }
  };

  // Reset password
  const resetPassword = async (token, password) => {
    try {
      setError("");
      const response = await authService.resetPassword(token, password);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
      throw err;
    }
  };

  // Update user profile
  const updateProfile = async (userId, profileData) => {
    try {
      setError("");
      const response = await authService.updateProfile(userId, profileData);

      if (response.data.success) {
        const updatedUser = response.data.user;
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
      }

      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
      throw err;
    }
  };

  // Value object to be provided to consumers of this context
  const value = {
    currentUser,
    loading,
    error,
    register,
    login,
    logout,
    verifyEmail,
    forgotPassword,
    resetPassword,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
