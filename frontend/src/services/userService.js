import axios from "axios";

// Make sure API_URL is correctly formatted
const API_URL = (() => {
  const url = process.env.REACT_APP_API_URL || "https://ai-marketplace-monetization.onrender.com/api";
  // Remove trailing slash if present
  return url.endsWith('/') ? url.slice(0, -1) : url;
})();

console.log('Using API URL:', API_URL);

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
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Get user profile
export const getUserProfile = async (userId) => {
  try {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update user profile
export const updateUserProfile = async (userId, profileData) => {
  try {
    const response = await apiClient.put(`/users/${userId}`, profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get published models with optional filtering
export const getPublishedModels = async (filters = {}) => {
  try {
    const { category, search } = filters;
    let queryParams = new URLSearchParams();
    
    if (category) queryParams.append("category", category);
    if (search) queryParams.append("search", search);
    
    const queryString = queryParams.toString();
    
    // Log token info
    const token = localStorage.getItem("token");
    console.log('Auth token present:', !!token);
    if (token) {
      console.log('Token length:', token.length);
    }
    
    // First try the direct test endpoint
    try {
      console.log('Trying test endpoint...');
      // Manually create a direct axios call to avoid baseURL issues
      const testUrl = process.env.REACT_APP_API_URL 
        ? `${process.env.REACT_APP_API_URL.replace(/\/api\/?$/, '')}/api/test/models/published` 
        : 'https://ai-marketplace-monetization.onrender.com/api/test/models/published';
      
      console.log('Direct test URL:', testUrl);
      
      const headers = {};
      if (token) {
        headers['x-auth-token'] = token;
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const testResponse = await axios.get(testUrl, { headers });
      console.log('Test endpoint success!', testResponse.data);
      return testResponse.data;
    } catch (testError) {
      console.warn('Test endpoint failed:', testError.message);
      
      // Fall back to regular endpoint
      console.log('Trying regular users endpoint...');
      const regularResponse = await apiClient.get(`users/models/published${queryString ? `?${queryString}` : ''}`);
      console.log('Regular endpoint success!', regularResponse.data);
      return regularResponse.data;
    }
  } catch (error) {
    console.error('API Error:', error);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw error.response?.data || { success: false, message: error.message };
  }
};

// Test API connection
export const testApiConnection = async () => {
  try {
    const response = await apiClient.get("/test");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}; 