import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with auth header
const createAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
};

/**
 * Get user's token balance
 */
export const getUserTokens = async () => {
  try {
    const response = await axios.get(`${API_URL}/tokens`, createAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error getting token balance:', error);
    throw error;
  }
};

/**
 * Get user's token usage history
 */
export const getTokenHistory = async () => {
  try {
    const response = await axios.get(`${API_URL}/tokens/history`, createAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error getting token history:', error);
    throw error;
  }
};

/**
 * Get user's model interactions
 */
export const getModelInteractions = async () => {
  try {
    const response = await axios.get(`${API_URL}/tokens/models`, createAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error getting model interactions:', error);
    throw error;
  }
};

/**
 * Get dashboard analytics
 */
export const getDashboardAnalytics = async () => {
  try {
    const response = await axios.get(`${API_URL}/tokens/dashboard`, createAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error getting dashboard analytics:', error);
    throw error;
  }
};

/**
 * Deduct tokens for model usage
 */
export const deductTokens = async (modelId, amount, description) => {
  try {
    const response = await axios.post(
      `${API_URL}/tokens/deduct`,
      { modelId, amount, description },
      createAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error('Error deducting tokens:', error);
    throw error;
  }
};

/**
 * Add tokens (admin only or self)
 */
export const addTokens = async (userId, amount, description) => {
  try {
    const response = await axios.post(
      `${API_URL}/tokens/add`,
      { userId, amount, description },
      createAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error('Error adding tokens:', error);
    throw error;
  }
};

export default {
  getUserTokens,
  getTokenHistory,
  getModelInteractions,
  getDashboardAnalytics,
  deductTokens,
  addTokens,
}; 