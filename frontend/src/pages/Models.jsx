import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getDeveloperModels, deleteModel, submitForPublishing, testModelRoutes } from "../services/modelService";
import { motion } from "framer-motion";

// Create Model Modal Component
const CreateModelModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    firstMessage: "",
    tags: "",
    perTokenPricing: {
      enabled: false,
      price: 0
    }
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "perTokenPricing.enabled") {
      setFormData({
        ...formData,
        perTokenPricing: {
          ...formData.perTokenPricing,
          enabled: e.target.checked
        }
      });
    } else if (name === "perTokenPricing.price") {
      setFormData({
        ...formData,
        perTokenPricing: {
          ...formData.perTokenPricing,
          price: parseFloat(value) || 0
        }
      });
    } else if (name === "tags") {
      setFormData({
        ...formData,
        [name]: value
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.firstMessage.trim()) newErrors.firstMessage = "First message is required";
    
    if (formData.perTokenPricing.enabled && formData.perTokenPricing.price <= 0) {
      newErrors["perTokenPricing.price"] = "Price must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Format tags as an array from comma-separated string
      const formattedData = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
      };
      
      await onSubmit(formattedData);
      onClose();
    } catch (error) {
      console.error("Error creating model:", error);
      setErrors({ submit: error.message || "Failed to create model" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-medium text-gray-900">Create New Model</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {errors.submit && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
              {errors.submit}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Model Name*
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`shadow appearance-none border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="e.g., Financial Advisor AI"
            />
            {errors.name && (
              <p className="text-red-500 text-xs italic">{errors.name}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Description*
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`shadow appearance-none border ${
                errors.description ? "border-red-500" : "border-gray-300"
              } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500`}
              rows="3"
              placeholder="Describe what your model does..."
            ></textarea>
            {errors.description && (
              <p className="text-red-500 text-xs italic">{errors.description}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              First Message / System Prompt*
            </label>
            <textarea
              name="firstMessage"
              value={formData.firstMessage}
              onChange={handleChange}
              className={`shadow appearance-none border ${
                errors.firstMessage ? "border-red-500" : "border-gray-300"
              } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500`}
              rows="5"
              placeholder="Enter the system prompt that defines how your AI should behave..."
            ></textarea>
            {errors.firstMessage && (
              <p className="text-red-500 text-xs italic">{errors.firstMessage}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Tags (comma separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., finance, advisor, investment"
            />
          </div>

          <div className="mb-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="perTokenPricing.enabled"
                checked={formData.perTokenPricing.enabled}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-gray-700 text-sm font-medium">
                Enable Per Token Pricing
              </label>
            </div>
          </div>

          {formData.perTokenPricing.enabled && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Price Per Token ($)
              </label>
              <input
                type="number"
                name="perTokenPricing.price"
                value={formData.perTokenPricing.price}
                onChange={handleChange}
                step="0.00001"
                min="0"
                className={`shadow appearance-none border ${
                  errors["perTokenPricing.price"] ? "border-red-500" : "border-gray-300"
                } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="e.g., 0.00001"
              />
              {errors["perTokenPricing.price"] && (
                <p className="text-red-500 text-xs italic">
                  {errors["perTokenPricing.price"]}
                </p>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Creating..." : "Create Model"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Models Component
const Models = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [models, setModels] = useState([]);
  const [selectedTab, setSelectedTab] = useState("published");
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionInProgress, setActionInProgress] = useState(null);

  // Fetch models from API
  useEffect(() => {
    const fetchModels = async () => {
      setLoading(true);
      try {
        const response = await getDeveloperModels();
        setModels(response.data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching models:", err);
        setError("Failed to load models. Please try again later.");
        setModels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  // Filter models based on selected tab
  const filteredModels = models.filter((model) => {
    if (selectedTab === "published") {
      return model.status === "active";
    } else if (selectedTab === "drafts") {
      return model.status === "draft";
    }
    return true;
  });

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Not published";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Handle model creation
  const handleCreateModel = async (formData) => {
    setIsProcessing(true);
    try {
      const response = await import("../services/modelService").then(module => module.createModel(formData));
      setModels([response.data, ...models]);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Error creating model:", error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle model deletion
  const handleDeleteModel = async (modelId) => {
    if (window.confirm("Are you sure you want to delete this model?")) {
      setIsProcessing(true);
      setActionInProgress(modelId);
      try {
        await deleteModel(modelId);
        setModels(models.filter(model => model._id !== modelId));
      } catch (error) {
        console.error("Error deleting model:", error);
        setError("Failed to delete model. Please try again.");
      } finally {
        setIsProcessing(false);
        setActionInProgress(null);
      }
    }
  };

  // Handle submission for publishing
  const handleSubmitForPublishing = async (modelId) => {
    setIsProcessing(true);
    setActionInProgress(modelId);
    try {
      const response = await submitForPublishing(modelId);
      setModels(models.map(model => 
        model._id === modelId ? response.data : model
      ));
    } catch (error) {
      console.error("Error submitting model for publishing:", error);
      setError("Failed to submit model for publishing. Please try again.");
    } finally {
      setIsProcessing(false);
      setActionInProgress(null);
    }
  };

  // Model card animation
  const modelCardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.1, duration: 0.3 }
    })
  };

  // Add this function inside the Models component
  const handleTestRoutes = async () => {
    try {
      const result = await testModelRoutes();
      console.log("Test result:", result);
      alert("API test successful! Check console for details.");
    } catch (error) {
      console.error("API test failed:", error);
      alert("API test failed: " + (error.message || "Unknown error"));
    }
  };

  return (
    <div className="container mx-auto py-6 px-4">
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* Test API Button */}
      <div className="mb-4">
        <button
          onClick={handleTestRoutes}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Test API Connection
        </button>
      </div>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Models</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          disabled={isProcessing}
        >
          Create New Model
        </button>
      </div>

      {/* Stats Overview */}
      <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-sm font-medium text-gray-500">Total Models</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {models.length}
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-sm font-medium text-gray-500">Active Models</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {models.filter((model) => model.status === "active").length}
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-sm font-medium text-gray-500">Total Usage</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {models
              .reduce((sum, model) => sum + (model.stats?.usageCount || 0), 0)
              .toLocaleString()}
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-sm font-medium text-gray-500">Total Revenue</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            $
            {models
              .reduce((sum, model) => sum + (model.stats?.revenue || 0), 0)
              .toFixed(2)}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setSelectedTab("published")}
            className={`${
              selectedTab === "published"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Published
            <span className="ml-2 py-0.5 px-2 text-xs rounded-full bg-gray-100 text-gray-700">
              {models.filter((model) => model.status === "active").length}
            </span>
          </button>
          <button
            onClick={() => setSelectedTab("drafts")}
            className={`${
              selectedTab === "drafts"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Drafts
            <span className="ml-2 py-0.5 px-2 text-xs rounded-full bg-gray-100 text-gray-700">
              {models.filter((model) => model.status === "draft").length}
            </span>
          </button>
        </nav>
      </div>

      {/* Models List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loader">Loading...</div>
        </div>
      ) : filteredModels.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredModels.map((model, index) => (
            <motion.div
              key={model._id || model.id}
              custom={index}
              variants={modelCardVariants}
              initial="hidden"
              animate="visible"
              className="bg-white overflow-hidden shadow rounded-lg flex flex-col"
            >
              <div className="px-4 py-5 sm:p-6 flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      {model.name}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <span>
                        Created: {formatDate(model.createdAt)}
                      </span>
                      {model.status === "active" && (
                        <span className="ml-2 py-1 px-2 text-xs rounded-full bg-green-100 text-green-800">
                          Published
                        </span>
                      )}
                      {model.status === "draft" && (
                        <span className="ml-2 py-1 px-2 text-xs rounded-full bg-gray-100 text-gray-800">
                          Draft
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                  {model.description}
                </p>
                
                {model.tags && model.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {model.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {model.status === "active" && (
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-gray-50 p-2 rounded-md">
                      <p className="text-xs text-gray-500">Total Usage</p>
                      <p className="font-medium">{model.stats?.usageCount?.toLocaleString() || 0}</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-md">
                      <p className="text-xs text-gray-500">Revenue</p>
                      <p className="font-medium">${model.stats?.revenue?.toFixed(2) || "0.00"}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="px-4 py-4 sm:px-6 bg-gray-50 border-t border-gray-200">
                <div className="flex space-x-3">
                  <button
                    onClick={() => navigate(`/models/${model._id || model.id}/edit`)}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    disabled={isProcessing && actionInProgress === model._id}
                  >
                    Edit
                  </button>
                  
                  {model.status === "draft" && (
                    <button
                      onClick={() => handleSubmitForPublishing(model._id)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      disabled={isProcessing && actionInProgress === model._id}
                    >
                      {isProcessing && actionInProgress === model._id
                        ? "Processing..."
                        : "Publish to Marketplace"}
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleDeleteModel(model._id || model.id)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    disabled={isProcessing && actionInProgress === model._id}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No models found
          </h3>
          {selectedTab === "published" ? (
            <p className="text-gray-600">
              You don't have any published models yet. Start by creating a new model.
            </p>
          ) : (
            <p className="text-gray-600">
              You don't have any model drafts. Create a new model to get started.
            </p>
          )}
        </div>
      )}

      {/* Create Model Modal */}
      <CreateModelModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateModel}
      />
    </div>
  );
};

export default Models;
