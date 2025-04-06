
import axios from "axios";

const API_URL = "https://ai-marketplace-monetization.onrender.com/api";

// Create axios instance with default headers
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["x-auth-token"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle unauthorized responses (expired token, etc)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear local storage and redirect to login if unauthorized
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

const authService = {
  // Register new user
  register: (userData) => {
    return apiClient.post("/auth/register", userData);
  },

  // Login user
  login: (email, password) => {
    return apiClient.post("/auth/login", { email, password });
  },

  // Verify email with token
  verifyEmail: (token) => {
    return apiClient.get(`/auth/verify-email/${token}`);
  },

  // Request password reset
  forgotPassword: (email) => {
    return apiClient.post("/auth/forgot-password", { email });
  },

  // Reset password with token
  resetPassword: (token, password) => {
    return apiClient.post(`/auth/reset-password/${token}`, { password });
  },

  // Get current user profile
  getCurrentUser: () => {
    return apiClient.get("/auth/me");
  },

  // Update user profile
  updateProfile: (userId, profileData) => {
    return apiClient.put(`/users/${userId}`, profileData);
  },

  // Delete user account
  deleteAccount: (userId) => {
    return apiClient.delete(`/users/${userId}`);
  },
};

export default authService;
