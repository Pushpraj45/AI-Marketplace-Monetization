import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getTokenHistory, getModelInteractions } from "../services/tokenService";

const TokenHistory = () => {
  const [tokenHistory, setTokenHistory] = useState([]);
  const [modelInteractions, setModelInteractions] = useState([]);
  const [activeTab, setActiveTab] = useState("history");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (activeTab === "history") {
          const response = await getTokenHistory();
          if (response.success) {
            setTokenHistory(response.data);
          } else {
            setError("Failed to load token history");
          }
        } else {
          const response = await getModelInteractions();
          if (response.success) {
            setModelInteractions(response.data);
          } else {
            setError("Failed to load model interactions");
          }
        }
      } catch (err) {
        console.error(`Error fetching ${activeTab} data:`, err);
        setError(`An error occurred while loading ${activeTab} data`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Token History</h1>
        <Link
          to="/dashboard"
          className="text-primary-600 hover:text-primary-800 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Dashboard
        </Link>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex" aria-label="Tabs">
          <button
            onClick={() => handleTabChange("history")}
            className={`${
              activeTab === "history"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm mr-8`}
          >
            Transaction History
          </button>
          <button
            onClick={() => handleTabChange("models")}
            className={`${
              activeTab === "models"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Model Interactions
          </button>
        </nav>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
          <p className="mt-3 text-gray-600">Loading data...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md text-red-700">
          {error}
        </div>
      ) : (
        <>
          {activeTab === "history" ? (
            // Token Transaction History
            <>
              {tokenHistory.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Model
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {tokenHistory.map((transaction, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                transaction.action === "credit"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {transaction.action === "credit" ? "CREDIT" : "DEBIT"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                            {transaction.amount.toLocaleString()} tokens
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                            {transaction.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                            {transaction.modelId ? (
                              <Link 
                                to={`/marketplace/${transaction.modelId}`}
                                className="text-primary-600 hover:text-primary-900"
                              >
                                View Model
                              </Link>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                            {new Date(transaction.timestamp).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="mt-2 text-gray-500">No transaction history found</p>
                </div>
              )}
            </>
          ) : (
            // Model Interactions
            <>
              {modelInteractions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {modelInteractions.map((model, index) => (
                    <div
                      key={model.modelId?._id || index}
                      className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          {model.modelId?.icon ? (
                            <img
                              src={model.modelId.icon}
                              alt={model.modelId.name}
                              className="h-10 w-10 mr-3 rounded-full"
                            />
                          ) : (
                            <div className="h-10 w-10 mr-3 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-500 text-sm">AI</span>
                            </div>
                          )}
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">
                              {model.modelId?.name || "Unknown Model"}
                            </h3>
                            <p className="text-sm text-gray-500 truncate max-w-[200px]">
                              {model.modelId?.description || "No description"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-blue-50 p-3 rounded-md">
                          <p className="text-xs text-blue-700 font-medium">Interactions</p>
                          <p className="text-xl font-semibold text-blue-900">
                            {model.interactions}
                          </p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-md">
                          <p className="text-xs text-green-700 font-medium">Tokens Used</p>
                          <p className="text-xl font-semibold text-green-900">
                            {model.tokensUsed.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>Last used: {new Date(model.lastInteraction).toLocaleDateString()}</span>
                        {model.modelId?._id && (
                          <Link
                            to={`/marketplace/${model.modelId._id}`}
                            className="text-primary-600 hover:text-primary-800 font-medium"
                          >
                            View Model
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="mt-2 text-gray-500">No model interactions found</p>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default TokenHistory; 