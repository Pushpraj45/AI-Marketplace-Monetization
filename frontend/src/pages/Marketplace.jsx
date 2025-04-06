import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Marketplace = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [models, setModels] = useState([]);
  const [filteredModels, setFilteredModels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popularity");

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockModels = [
        {
          id: "model1",
          name: "TextClassifier Pro",
          description:
            "Advanced text classification model with support for 100+ languages.",
          developer: {
            id: "dev1",
            name: "AI Solutions Inc.",
            rating: 4.8,
          },
          category: "nlp",
          tags: ["text", "classification", "multilingual"],
          pricing: {
            model: "usage",
            price: 0.001,
            unit: "per request",
          },
          stats: {
            usageCount: 25890,
            rating: 4.7,
            reviewCount: 156,
          },
          imageUrl: "https://via.placeholder.com/300x200?text=Text+Classifier",
        },
        {
          id: "model2",
          name: "ImageVision API",
          description:
            "State-of-the-art computer vision model for object detection and image analysis.",
          developer: {
            id: "dev2",
            name: "Vision Labs",
            rating: 4.5,
          },
          category: "computer-vision",
          tags: ["image", "object-detection", "recognition"],
          pricing: {
            model: "tiered",
            price: 0.05,
            unit: "per 1000 images",
          },
          stats: {
            usageCount: 18764,
            rating: 4.6,
            reviewCount: 124,
          },
          imageUrl: "https://via.placeholder.com/300x200?text=Image+Vision",
        },
        {
          id: "model3",
          name: "SentimentAnalyzer",
          description:
            "Accurate sentiment analysis for customer feedback and social media.",
          developer: {
            id: "dev3",
            name: "NLP Experts",
            rating: 4.3,
          },
          category: "nlp",
          tags: ["sentiment", "analysis", "emotion"],
          pricing: {
            model: "subscription",
            price: 49.99,
            unit: "per month",
          },
          stats: {
            usageCount: 12432,
            rating: 4.2,
            reviewCount: 98,
          },
          imageUrl:
            "https://via.placeholder.com/300x200?text=Sentiment+Analyzer",
        },
        {
          id: "model4",
          name: "VoiceTranscriber",
          description:
            "Real-time speech-to-text with high accuracy in noisy environments.",
          developer: {
            id: "dev2",
            name: "Vision Labs",
            rating: 4.5,
          },
          category: "speech",
          tags: ["voice", "transcription", "real-time"],
          pricing: {
            model: "usage",
            price: 0.005,
            unit: "per minute",
          },
          stats: {
            usageCount: 9874,
            rating: 4.4,
            reviewCount: 87,
          },
          imageUrl:
            "https://via.placeholder.com/300x200?text=Voice+Transcriber",
        },
      ];

      const allCategories = [
        { id: "nlp", name: "Natural Language Processing" },
        { id: "computer-vision", name: "Computer Vision" },
        { id: "speech", name: "Speech Recognition" },
      ];

      setModels(mockModels);
      setFilteredModels(mockModels);
      setCategories(allCategories);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter and sort models
  useEffect(() => {
    let result = [...models];

    // Apply category filter
    if (selectedCategory !== "all") {
      result = result.filter((model) => model.category === selectedCategory);
    }

    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (model) =>
          model.name.toLowerCase().includes(term) ||
          model.description.toLowerCase().includes(term) ||
          model.tags.some((tag) => tag.includes(term))
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "popularity":
        result.sort((a, b) => b.stats.usageCount - a.stats.usageCount);
        break;
      case "rating":
        result.sort((a, b) => b.stats.rating - a.stats.rating);
        break;
      case "price-low":
        result.sort((a, b) => a.pricing.price - b.pricing.price);
        break;
      case "price-high":
        result.sort((a, b) => b.pricing.price - a.pricing.price);
        break;
      default:
        break;
    }

    setFilteredModels(result);
  }, [models, selectedCategory, searchTerm, sortBy]);

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          AI Model Marketplace
        </h1>
        {currentUser && (
          <Link
            to="/usage-history"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-50 hover:bg-primary-100"
          >
            My Usage History
          </Link>
        )}
      </div>

      {/* Filters and Search */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Search Models
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, description, or tags..."
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="sort"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Sort By
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="popularity">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Models Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : filteredModels.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No models found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search or filter criteria to find what you're
            looking for.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModels.map((model) => (
            <div
              key={model.id}
              className="bg-white shadow rounded-lg overflow-hidden"
            >
              <div className="h-48 bg-gray-200">
                <img
                  src={model.imageUrl}
                  alt={model.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium text-gray-900">
                    {model.name}
                  </h3>
                  <div className="flex items-center">
                    <svg
                      className="h-5 w-5 text-yellow-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="ml-1 text-sm text-gray-600">
                      {model.stats.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {model.description}
                </p>
                <div className="mb-4">
                  <p className="text-sm text-gray-500">
                    By{" "}
                    <span className="text-primary-600">
                      {model.developer.name}
                    </span>
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {model.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      ${model.pricing.price}{" "}
                      <span className="text-xs text-gray-500">
                        {model.pricing.unit}
                      </span>
                    </p>
                  </div>
                  <Link
                    to={`/model/${model.id}`}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Marketplace;
