import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getPublishedModels } from "../services/userService";
import { motion } from "framer-motion";

const UserModels = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [models, setModels] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState(["all"]);
  const [error, setError] = useState(null);
  const [isAuthError, setIsAuthError] = useState(false);

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async (filters = {}) => {
    setLoading(true);
    setError(null);
    setIsAuthError(false);
    
    try {
      const response = await getPublishedModels(filters);
      console.log("API Response:", response);
      
      if (response && response.success) {
        setModels(response.data || []);
        
        // Extract unique categories from models
        const uniqueCategories = ["all"];
        if (response.data && response.data.length > 0) {
          response.data.forEach(model => {
            if (model.tags && Array.isArray(model.tags)) {
              model.tags.forEach(tag => {
                if (!uniqueCategories.includes(tag)) {
                  uniqueCategories.push(tag);
                }
              });
            }
          });
        }
        setCategories(uniqueCategories);
      } else {
        console.error("API returned success: false", response);
        setError(response?.message || "Failed to load models");
      }
    } catch (err) {
      console.error("Error fetching published models:", err);
      
      // Check if it's an authentication error
      if (err?.message?.includes("401") || err?.message?.includes("auth") || err?.message?.includes("token")) {
        setIsAuthError(true);
        setError("Authentication error. Please sign in again.");
      } else {
        setError(err?.message || "Failed to load models. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReLogin = () => {
    navigate('/login');
  };

  const handleSearch = () => {
    const filters = {};
    if (searchQuery) filters.search = searchQuery;
    if (selectedCategory !== "all") filters.category = selectedCategory;
    fetchModels(filters);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    const filters = { category };
    if (searchQuery) filters.search = searchQuery;
    fetchModels(filters);
  };

  // Animation variants for cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.3 }
    })
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Published AI Models</h1>
        <p className="text-gray-600 mt-2">
          Discover AI models published by our developers
        </p>
      </div>

      {error && (
        <div className={`p-4 rounded-md mb-6 ${isAuthError ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-700"}`}>
          <p>{error}</p>
          {isAuthError && (
            <button 
              onClick={handleReLogin}
              className="mt-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              Sign In Again
            </button>
          )}
        </div>
      )}

      <div className="mb-8 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search models..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="absolute right-2 top-2 p-1 bg-primary-500 text-white rounded-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>

        <select
          className="px-4 py-2 border border-gray-300 rounded-md"
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : models.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-4 text-xl font-medium text-gray-900">No models found</h3>
          <p className="mt-2 text-gray-500">
            Try adjusting your search or check back later for new models
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map((model, index) => (
            <motion.div
              key={model._id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              custom={index}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {model.name}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{model.description}</p>
                
                {model.owner?.profile?.name && (
                  <p className="text-sm text-gray-500 mb-2">
                    By {model.owner.profile.name}
                    {model.owner.profile.organization && ` (${model.owner.profile.organization})`}
                  </p>
                )}
                
                {model.tags && model.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {model.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-gray-50 p-2 rounded text-center">
                    <p className="text-xs text-gray-500">Usage</p>
                    <p className="font-medium">{model.stats?.usageCount || 0}</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded text-center">
                    <p className="text-xs text-gray-500">Pricing</p>
                    <p className="font-medium">
                      {model.perTokenPricing?.enabled
                        ? `$${model.perTokenPricing.price}/token`
                        : "Free"}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => navigate(`/marketplace/${model._id}`)}
                  className="w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md transition-colors"
                >
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserModels; 