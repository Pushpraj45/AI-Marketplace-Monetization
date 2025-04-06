import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTokens } from "../contexts/TokenContext";
import { Link } from "react-router-dom";
import { getDashboardAnalytics } from "../services/tokenService";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { tokenBalance } = useTokens();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await getDashboardAnalytics();
        if (response.success) {
          setDashboardData(response.data);
        } else {
          setError("Failed to load dashboard data");
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("An error occurred while loading your dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h1>

      {loading ? (
        <div className="text-center py-6">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading dashboard...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md text-red-700">
          {error}
        </div>
      ) : (
        <>
          {/* Token Balance Card - use tokenBalance from context instead of dashboardData */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg p-6 text-white mb-6 shadow-md">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold mb-1">Token Balance</h2>
                <p className="opacity-80">Available for AI model interactions</p>
              </div>
              <div className="text-4xl font-bold">
                {tokenBalance !== null ? tokenBalance.toLocaleString() : (dashboardData?.currentBalance || 0).toLocaleString()}
              </div>
            </div>
            <div className="mt-4 text-sm flex justify-between">
              <span>Total Used: {dashboardData?.totalUsed.toLocaleString()} tokens</span>
              <span>Cost per chat: 500 tokens</span>
            </div>
            <div className="mt-4 flex justify-end">
              <Link 
                to="/token-history"
                className="bg-white text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                View Full History
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* User Stats */}
            <div className="bg-white border rounded-lg p-4 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Your Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-500">Total Models Used</p>
                  <p className="text-xl font-semibold text-gray-800">{dashboardData?.totalModelsInteracted || 0}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-500">Total Interactions</p>
                  <p className="text-xl font-semibold text-gray-800">{dashboardData?.totalInteractions || 0}</p>
                </div>
              </div>
            </div>

            {/* Most Used Models */}
            <div className="bg-white border rounded-lg p-4 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Most Used Models</h3>
              {dashboardData?.mostUsedModels?.length > 0 ? (
                <ul className="divide-y">
                  {dashboardData.mostUsedModels.map((model, index) => (
                    <li key={model.modelId?._id || index} className="py-2 flex justify-between items-center">
                      <div className="flex items-center">
                        {model.modelId?.icon && (
                          <img src={model.modelId.icon} alt="Model icon" className="h-6 w-6 mr-2" />
                        )}
                        <span className="text-gray-800">{model.modelId?.name || "Unknown Model"}</span>
                      </div>
                      <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {model.interactions} uses
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-center italic py-4">
                  You haven't used any models yet.
                </p>
              )}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Recent Transactions
            </h3>
            {dashboardData?.recentTransactions?.length > 0 ? (
              <div className="bg-white rounded-lg border overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dashboardData.recentTransactions.map((transaction, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            transaction.action === "credit" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}>
                            {transaction.action === "credit" ? "CREDIT" : "DEBIT"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                          {transaction.amount.toLocaleString()} tokens
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                          {transaction.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
                          {new Date(transaction.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 italic">No recent transactions to display.</p>
            )}
          </div>
        </>
      )}

      <div className="mt-6 border-t border-gray-200 pt-4">
        <div className="bg-blue-50 p-4 rounded-md">
          <h3 className="text-md font-medium text-blue-800 mb-2">
            Quick Navigation
          </h3>
          
          <div className="mt-4 flex flex-wrap gap-4">
            {currentUser?.role === "developer" ? (
              <>
                <Link 
                  to="/models"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Manage Models
                </Link>
                <Link 
                  to="/developer-dashboard"
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Analytics Dashboard
                </Link>
              </>
            ) : null}
            
            <Link 
              to="/marketplace"
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
            >
              Browse Marketplace
            </Link>
            
            <Link 
              to={currentUser?.role === "developer" ? "/dev-profile" : "/user-profile"}
              className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200"
            >
              View Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
