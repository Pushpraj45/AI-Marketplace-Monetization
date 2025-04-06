import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getMarketplaceModels } from "../services/modelService";
import { motion } from "framer-motion";

const Marketplace = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [models, setModels] = useState([]);
  const [filteredModels, setFilteredModels] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [error, setError] = useState(null);

  // Fetch models from API
  useEffect(() => {
    const fetchModels = async () => {
      setLoading(true);
      try {
        const response = await getMarketplaceModels();
        const modelsData = response.data || [];
        setModels(modelsData);
        setFilteredModels(modelsData);
        setError(null);
      } catch (err) {
        console.error("Error fetching marketplace models:", err);
        setError("Failed to load AI models. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  // Filter models when search query or category changes
  useEffect(() => {
    let result = [...models];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (model) =>
          model.name.toLowerCase().includes(query) ||
          model.description.toLowerCase().includes(query) ||
          (model.tags && model.tags.some((tag) => tag.toLowerCase().includes(query)))
      );
    }

    // Filter by category
    if (selectedCategory !== "all" && selectedCategory) {
      result = result.filter((model) => 
        model.tags && model.tags.includes(selectedCategory)
      );
    }

    setFilteredModels(result);
  }, [searchQuery, selectedCategory, models]);

  // Extract unique categories from models
  const categories = [
    "all",
    ...new Set(
      models
        .flatMap((model) => model.tags || [])
        .filter(Boolean)
    ),
  ];

  // Model card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.1, duration: 0.3 }
    })
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          AI Model Marketplace
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-gray-600">
          Discover and use powerful AI models created by developers. Find the
          perfect model for your needs.
        </p>
      </div>

      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-grow max-w-3xl">
            <input
              type="text"
              placeholder="Search models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          <div className="flex-shrink-0">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="loader">Loading...</div>
        </div>
      ) : filteredModels.length === 0 ? (
        <div className="text-center py-16 bg-white shadow-sm rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No models found
          </h3>
          <p className="text-gray-600">
            {searchQuery || selectedCategory !== "all"
              ? "Try adjusting your search criteria"
              : "No models are currently available in the marketplace"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModels.map((model, index) => (
            <motion.div
              key={model._id || model.id}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300 flex flex-col"
            >
              <div className="p-6 flex-grow">
                <div className="flex justify-between">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {model.name}
                  </h3>
                </div>
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {model.description}
                </p>
                
                {model.owner?.profile?.name && (
                  <p className="text-xs text-gray-500 mb-3">
                    By{" "}
                    <span className="font-medium text-gray-700">
                      {model.owner.profile.name}
                      {model.owner.profile.organization && ` (${model.owner.profile.organization})`}
                    </span>
                  </p>
                )}
                
                {model.tags && model.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3 mb-4">
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
                
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="bg-gray-50 p-2 rounded text-center">
                    <p className="text-xs text-gray-500">Usage</p>
                    <p className="font-medium">{model.stats?.usageCount?.toLocaleString() || 0}</p>
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
              </div>
              
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <Link
                  to={`/marketplace/${model._id || model.id}`}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Try This Model
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Marketplace;
