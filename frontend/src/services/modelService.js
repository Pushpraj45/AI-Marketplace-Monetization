import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "https://ai-marketplace-monetization.onrender.com/api";

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

// Get all marketplace models
export const getMarketplaceModels = async () => {
  try {
    const response = await apiClient.get("/models/marketplace");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get marketplace model by ID
export const getMarketplaceModelById = async (modelId) => {
  try {
    const response = await apiClient.get(`/models/marketplace/${modelId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get developer's models
export const getDeveloperModels = async () => {
  try {
    const response = await apiClient.get("/models");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get developer model by ID
export const getDeveloperModelById = async (modelId) => {
  try {
    const response = await apiClient.get(`/models/${modelId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Create a new model
export const createModel = async (modelData) => {
  try {
    const response = await apiClient.post("/models", modelData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update a model
export const updateModel = async (modelId, modelData) => {
  try {
    const response = await apiClient.put(`/models/${modelId}`, modelData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Submit a model for publishing
export const submitForPublishing = async (modelId) => {
  try {
    const response = await apiClient.put(`/models/${modelId}/submit`, {});
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete a model
export const deleteModel = async (modelId) => {
  try {
    const response = await apiClient.delete(`/models/${modelId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Generate AI completions
export const generateCompletion = async (modelId, messages) => {
  try {
    const response = await apiClient.post("/models/generate", { modelId, messages });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Test Azure OpenAI connection
export const testAzureConnection = async () => {
  try {
    const response = await apiClient.get("/models/test-azure");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Test Azure OpenAI deployments
export const testDeployments = async () => {
  try {
    const response = await apiClient.get("/models/test-deployments");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Direct test with hardcoded credentials
export const directTest = async () => {
  try {
    const response = await apiClient.get("/models/direct-test");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Python-style test that exactly follows the example
export const pythonStyleTest = async () => {
  try {
    const response = await apiClient.get("/models/python-test");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get a simple completion from the AI
export const getSimpleCompletion = async (prompt, systemMessage = null) => {
  try {
    const payload = { prompt };
    if (systemMessage) {
      payload.systemMessage = systemMessage;
    }
    
    const response = await apiClient.post("/models/completion", payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Test endpoint
export const testModelRoutes = async () => {
  try {
    const response = await apiClient.get("/models/test");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}; 