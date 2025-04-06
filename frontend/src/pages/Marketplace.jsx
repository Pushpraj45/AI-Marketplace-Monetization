import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import AnimatedCard from "../components/common/AnimatedCard";
import AnimatedSection, { AnimatedItem } from "../components/common/AnimatedSection";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { motion } from "framer-motion";
import ModelFilter from "../components/models/ModelFilter";
import ModelList from "../components/models/ModelList";

const Marketplace = () => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [models, setModels] = useState([]);
  const [filteredModels, setFilteredModels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState([]);
  const [sortBy, setSortBy] = useState("popularity");
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check URL params for category
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [location]);

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
          developer: "AI Solutions Inc.",
          category: "nlp",
          image: "https://via.placeholder.com/300x200?text=Text+Classifier",
          price: 0.001,
          pricingModel: "api",
          rating: 4.7,
          tags: ["text", "classification", "multilingual"],
        },
        {
          id: "model2",
          name: "ImageVision API",
          description:
            "State-of-the-art computer vision model for object detection and image analysis.",
          developer: "Vision Labs",
          category: "computer-vision",
          image: "https://via.placeholder.com/300x200?text=Image+Vision",
          price: 0.05,
          pricingModel: "api",
          rating: 4.6,
          tags: ["image", "object-detection", "recognition"],
        },
        {
          id: "model3",
          name: "SentimentAnalyzer",
          description:
            "Accurate sentiment analysis for customer feedback and social media.",
          developer: "NLP Experts",
          category: "nlp",
          image: "https://via.placeholder.com/300x200?text=Sentiment+Analyzer",
          price: 49.99,
          pricingModel: "subscription",
          rating: 4.2,
          tags: ["sentiment", "analysis", "emotion"],
        },
        {
          id: "model4",
          name: "VoiceTranscriber",
          description:
            "Real-time speech-to-text with high accuracy in noisy environments.",
          developer: "Vision Labs",
          category: "speech",
          image: "https://via.placeholder.com/300x200?text=Voice+Transcriber",
          price: 0.005,
          pricingModel: "api",
          rating: 4.4,
          tags: ["voice", "transcription", "real-time"],
        },
        {
          id: "model5",
          name: "CodeAssistant",
          description:
            "AI-powered code completion and suggestions for multiple programming languages.",
          developer: "CodeAI Labs",
          category: "code",
          image: "https://via.placeholder.com/300x200?text=Code+Assistant",
          price: 0,
          pricingModel: "free",
          rating: 4.8,
          tags: ["code", "programming", "assistance"],
        },
        {
          id: "model6",
          name: "DataAnalyzer Pro",
          description:
            "Advanced data analysis with automated insights and visualization.",
          developer: "Data Systems Inc.",
          category: "data",
          image: "https://via.placeholder.com/300x200?text=Data+Analyzer",
          price: 99.99,
          pricingModel: "subscription",
          rating: 4.5,
          tags: ["data", "analysis", "visualization"],
        },
      ];

      const allCategories = [
        { id: "nlp", name: "Natural Language Processing" },
        { id: "computer-vision", name: "Computer Vision" },
        { id: "speech", name: "Speech Recognition" },
        { id: "code", name: "Code Generation" },
        { id: "data", name: "Data Analysis" },
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

    // Apply price range filter
    if (selectedPriceRange && selectedPriceRange.length > 0) {
      result = result.filter((model) => {
        if (selectedPriceRange.includes('free') && model.price === 0) return true;
        if (selectedPriceRange.includes('low') && model.price > 0 && model.price <= 0.01) return true;
        if (selectedPriceRange.includes('medium') && model.price > 0.01 && model.price <= 10) return true;
        if (selectedPriceRange.includes('high') && model.price > 10) return true;
        return false;
      });
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
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        // In a real app, would sort by date
        result.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    setFilteredModels(result);
  }, [models, selectedCategory, selectedPriceRange, searchTerm, sortBy]);

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    switch (filterType) {
      case 'category':
        setSelectedCategory(value);
        break;
      case 'price':
        setSelectedPriceRange(value);
        break;
      case 'sort':
        setSortBy(value);
        break;
      case 'search':
        setSearchTerm(value);
        break;
      default:
        break;
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedPriceRange([]);
    setSortBy("popularity");
  };

  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-24 flex justify-center">
        <LoadingSpinner size="lg" text="Loading marketplace..." />
      </div>
    );
  }

  // Format categories for filter component
  const categoryOptions = [
    { id: "all", name: "All Categories" },
    ...categories
  ];

  // Create price range options
  const priceOptions = [
    { id: "free", name: "Free" },
    { id: "low", name: "Low ($0 - $0.01)" },
    { id: "medium", name: "Medium ($0.01 - $10)" },
    { id: "high", name: "High (>$10)" },
  ];

  // Create sort options
  const sortOptions = [
    { id: "popularity", name: "Most Popular" },
    { id: "newest", name: "Newest First" },
    { id: "price-low", name: "Price: Low to High" },
    { id: "price-high", name: "Price: High to Low" },
  ];

  return (
    <div className="container mx-auto py-6 px-4">
      <AnimatedSection animation="slideIn" className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          AI Model Marketplace
        </h1>
        {currentUser && (
          <Link
            to="/usage-history"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-50 hover:bg-primary-100 transition-all duration-300 hover:scale-105"
          >
            My Usage History
          </Link>
        )}
      </AnimatedSection>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters sidebar */}
        <div className={`${isMobile && !showFilters ? 'hidden' : 'block'} lg:block w-full lg:w-64 flex-shrink-0`}>
          <ModelFilter 
            categories={categoryOptions}
            selectedCategory={selectedCategory}
            priceRanges={priceOptions}
            selectedPriceRange={selectedPriceRange}
            sortOptions={sortOptions}
            selectedSort={sortBy}
            searchTerm={searchTerm}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            isMobile={isMobile}
            onClose={() => setShowFilters(false)}
          />
        </div>

        {/* Main content area */}
        <div className="flex-1">
          {/* Mobile filter button */}
          {isMobile && (
            <motion.button
              onClick={handleToggleFilters}
              className="w-full mb-4 flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                  clipRule="evenodd"
                />
              </svg>
            </motion.button>
          )}

          {/* Search bar */}
          <AnimatedSection animation="fadeIn" className="mb-6">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search models by name, description, or tags..."
                className="block w-full p-3 pl-10 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              {searchTerm && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    onClick={() => setSearchTerm("")}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </AnimatedSection>

          {/* Models list */}
          <ModelList 
            models={filteredModels} 
            title={`${filteredModels.length} Models Found`} 
          />
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
