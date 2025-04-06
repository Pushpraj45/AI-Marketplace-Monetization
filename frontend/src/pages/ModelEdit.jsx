import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { 
  getDeveloperModelById, 
  updateModel, 
  submitForPublishing, 
  deleteModel 
} from "../services/modelService";

const ModelEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    firstMessage: "",
    tags: "",
    perTokenPricing: {
      enabled: false,
      price: 0,
    },
  });
  const [formErrors, setFormErrors] = useState({});

  // Load model data
  useEffect(() => {
    const fetchModel = async () => {
      if (!currentUser) {
        navigate("/login");
        return;
      }

      setLoading(true);
      try {
        const response = await getDeveloperModelById(id);
        const modelData = response.data;
        setModel(modelData);
        
        // Format tags from array to comma-separated string for form
        setFormData({
          name: modelData.name,
          description: modelData.description,
          firstMessage: modelData.firstMessage,
          tags: modelData.tags ? modelData.tags.join(", ") : "",
          perTokenPricing: {
            enabled: modelData.perTokenPricing?.enabled || false,
            price: modelData.perTokenPricing?.price || 0,
          },
        });
        
        setError(null);
      } catch (err) {
        console.error("Error fetching model:", err);
        setError("Failed to load model. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchModel();
  }, [id, currentUser, navigate]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === "perTokenPricing.enabled") {
      setFormData({
        ...formData,
        perTokenPricing: {
          ...formData.perTokenPricing,
          enabled: checked,
        },
      });
    } else if (name === "perTokenPricing.price") {
      setFormData({
        ...formData,
        perTokenPricing: {
          ...formData.perTokenPricing,
          price: parseFloat(value) || 0,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  // Validate the form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }
    
    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }
    
    if (!formData.firstMessage.trim()) {
      errors.firstMessage = "First message is required";
    }
    
    if (formData.perTokenPricing.enabled && formData.perTokenPricing.price <= 0) {
      errors["perTokenPricing.price"] = "Price must be greater than 0";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    try {
      // Format tags back to array
      const tags = formData.tags
        ? formData.tags.split(",").map((tag) => tag.trim())
        : [];
      
      const modelData = {
        ...formData,
        tags,
      };
      
      await updateModel(id, modelData);
      setError(null);
      navigate("/models");
    } catch (err) {
      console.error("Error updating model:", err);
      setError("Failed to update model. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle model publishing
  const handlePublish = async () => {
    if (!validateForm()) {
      return;
    }
    
    // First save the changes
    try {
      setSubmitting(true);
      
      // Format tags back to array
      const tags = formData.tags
        ? formData.tags.split(",").map((tag) => tag.trim())
        : [];
      
      const modelData = {
        ...formData,
        tags,
      };
      
      await updateModel(id, modelData);
      
      // Then submit for publishing
      await submitForPublishing(id);
      
      setError(null);
      navigate("/models");
    } catch (err) {
      console.error("Error publishing model:", err);
      setError("Failed to publish model. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle model deletion
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this model? This action cannot be undone.")) {
      setSubmitting(true);
      try {
        await deleteModel(id);
        navigate("/models");
      } catch (err) {
        console.error("Error deleting model:", err);
        setError("Failed to delete model. Please try again.");
      } finally {
        setSubmitting(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6 px-4 flex justify-center items-center min-h-screen-navbar">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  if (!model) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Model not found or you don't have access to edit it.
        </div>
        <Link
          to="/models"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
        >
          Back to My Models
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Model</h1>
        <Link
          to="/models"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-50 hover:bg-primary-100"
        >
          Cancel
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Model Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Model Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${
                  formErrors.name ? "border-red-500" : "border-gray-300"
                } shadow-sm p-2 focus:border-primary-500 focus:ring-primary-500`}
              />
              {formErrors.name && (
                <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className={`mt-1 block w-full rounded-md border ${
                  formErrors.description ? "border-red-500" : "border-gray-300"
                } shadow-sm p-2 focus:border-primary-500 focus:ring-primary-500`}
              />
              {formErrors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.description}
                </p>
              )}
            </div>

            {/* First Message / System Prompt */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                First Message / System Prompt
              </label>
              <textarea
                name="firstMessage"
                value={formData.firstMessage}
                onChange={handleChange}
                rows={6}
                className={`mt-1 block w-full rounded-md border ${
                  formErrors.firstMessage ? "border-red-500" : "border-gray-300"
                } shadow-sm p-2 focus:border-primary-500 focus:ring-primary-500`}
              />
              <p className="mt-1 text-xs text-gray-500">
                This defines how your AI should behave. It's sent as a system
                message at the start of each conversation.
              </p>
              {formErrors.firstMessage && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.firstMessage}
                </p>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tags (comma separated)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="e.g., finance, advisor, nlp"
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            {/* Pricing Options */}
            <div>
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="perTokenPricing.enabled"
                  name="perTokenPricing.enabled"
                  checked={formData.perTokenPricing.enabled}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="perTokenPricing.enabled"
                  className="ml-2 block text-sm font-medium text-gray-700"
                >
                  Enable per-token pricing
                </label>
              </div>

              {formData.perTokenPricing.enabled && (
                <div className="ml-6">
                  <label className="block text-sm font-medium text-gray-700">
                    Price per token ($)
                  </label>
                  <input
                    type="number"
                    name="perTokenPricing.price"
                    value={formData.perTokenPricing.price}
                    onChange={handleChange}
                    step="0.00001"
                    min="0"
                    className={`mt-1 block w-64 rounded-md border ${
                      formErrors["perTokenPricing.price"]
                        ? "border-red-500"
                        : "border-gray-300"
                    } shadow-sm p-2 focus:border-primary-500 focus:ring-primary-500`}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Users will be charged this amount per token.
                  </p>
                  {formErrors["perTokenPricing.price"] && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors["perTokenPricing.price"]}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 flex justify-between">
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              disabled={submitting}
            >
              Delete Model
            </button>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                disabled={submitting}
              >
                {submitting ? "Saving..." : "Save Changes"}
              </button>

              {model.status === "draft" && (
                <button
                  type="button"
                  onClick={handlePublish}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  disabled={submitting}
                >
                  {submitting ? "Publishing..." : "Save & Publish"}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModelEdit; 