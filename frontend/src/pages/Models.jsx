import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Models = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [models, setModels] = useState([]);
  const [selectedTab, setSelectedTab] = useState("published");

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockModels = [
        {
          id: "model1",
          name: "SentimentAnalysis Pro",
          description:
            "Advanced sentiment analysis model with support for 50+ languages",
          status: "active",
          category: "nlp",
          publishedAt: "2023-08-15T10:30:00Z",
          stats: {
            usageCount: 4567,
            revenue: 789.5,
            rating: 4.7,
            reviewCount: 42,
          },
          pricing: {
            model: "usage",
            price: 0.002,
            unit: "per request",
          },
        },
        {
          id: "model2",
          name: "EnhancedImageClassifier",
          description:
            "State-of-the-art image classification for hundreds of categories",
          status: "active",
          category: "computer-vision",
          publishedAt: "2023-09-20T14:15:00Z",
          stats: {
            usageCount: 2345,
            revenue: 456.75,
            rating: 4.5,
            reviewCount: 28,
          },
          pricing: {
            model: "tiered",
            price: 0.01,
            unit: "per 100 images",
          },
        },
        {
          id: "model3",
          name: "RealTimeSpeechToText",
          description:
            "Real-time speech recognition optimized for multiple accents",
          status: "pending-approval",
          category: "speech",
          publishedAt: null,
          stats: {
            usageCount: 0,
            revenue: 0,
            rating: 0,
            reviewCount: 0,
          },
          pricing: {
            model: "usage",
            price: 0.005,
            unit: "per minute",
          },
        },
        {
          id: "model4",
          name: "TextSummarizer",
          description:
            "Efficient text summarization for articles and long-form content",
          status: "draft",
          category: "nlp",
          publishedAt: null,
          stats: {
            usageCount: 0,
            revenue: 0,
            rating: 0,
            reviewCount: 0,
          },
          pricing: {
            model: "subscription",
            price: 0,
            unit: "per month",
          },
        },
      ];

      setModels(mockModels);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter models based on selected tab
  const filteredModels = models.filter((model) => {
    if (selectedTab === "published") {
      return model.status === "active";
    } else if (selectedTab === "pending") {
      return model.status === "pending-approval";
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

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Models</h1>
        <Link
          to="/publish-model"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Publish New Model
        </Link>
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
              .reduce((sum, model) => sum + model.stats.usageCount, 0)
              .toLocaleString()}
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-sm font-medium text-gray-500">Total Revenue</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            $
            {models
              .reduce((sum, model) => sum + model.stats.revenue, 0)
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
            onClick={() => setSelectedTab("pending")}
            className={`${
              selectedTab === "pending"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Pending Approval
            <span className="ml-2 py-0.5 px-2 text-xs rounded-full bg-gray-100 text-gray-700">
              {
                models.filter((model) => model.status === "pending-approval")
                  .length
              }
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

      {/* Models Table */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : filteredModels.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No models found
          </h3>
          <p className="text-gray-600 mb-4">
            {selectedTab === "published"
              ? "You don't have any published models yet."
              : selectedTab === "pending"
              ? "You don't have any models pending approval."
              : "You don't have any draft models."}
          </p>
          <Link
            to="/publish-model"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Create Your First Model
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Model
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Category
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Published
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Usage
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Revenue
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Rating
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredModels.map((model) => (
                <tr key={model.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {model.name}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {model.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        model.status === "active"
                          ? "bg-green-100 text-green-800"
                          : model.status === "pending-approval"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {model.status === "active"
                        ? "Active"
                        : model.status === "pending-approval"
                        ? "Pending Approval"
                        : "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                    {model.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(model.publishedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {model.stats.usageCount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${model.stats.revenue.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {model.stats.rating > 0 ? (
                      <div className="flex items-center">
                        <svg
                          className="h-4 w-4 text-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="ml-1 text-sm text-gray-600">
                          {model.stats.rating.toFixed(1)} (
                          {model.stats.reviewCount})
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">No ratings</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/model-details/${model.id}`}
                      className="text-primary-600 hover:text-primary-900 mr-4"
                    >
                      View
                    </Link>
                    <Link
                      to={`/edit-model/${model.id}`}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Models;
