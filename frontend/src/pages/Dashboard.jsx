import React from "react";
import { useAuth } from "../contexts/AuthContext";

const Dashboard = () => {
  const { currentUser } = useAuth();

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h1>

      <div className="border-t border-gray-200 pt-4">
        <h2 className="text-lg font-medium text-gray-900 mb-2">
          Welcome, {currentUser?.profile?.name || currentUser?.email}
        </h2>
        <p className="text-gray-600 mb-4">
          You are logged in as a{" "}
          <span className="font-semibold capitalize">{currentUser?.role}</span>.
        </p>

        {currentUser?.role === "developer" ? (
          <div className="bg-blue-50 p-4 rounded-md">
            <h3 className="text-md font-medium text-blue-800 mb-2">
              Developer Options
            </h3>
            <p className="text-blue-700">
              As a developer, you can publish models, set pricing, and access
              the model catalog.
            </p>
            <div className="mt-4 flex space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Publish New Model
              </button>
              <button className="bg-blue-100 text-blue-800 px-4 py-2 rounded-md hover:bg-blue-200">
                View Model Catalog
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-green-50 p-4 rounded-md">
            <h3 className="text-md font-medium text-green-800 mb-2">
              User Options
            </h3>
            <p className="text-green-700">
              Browse and select models, track your usage, and access analytics.
            </p>
            <div className="mt-4 flex space-x-4">
              <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                Browse Models
              </button>
              <button className="bg-green-100 text-green-800 px-4 py-2 rounded-md hover:bg-green-200">
                View Usage Analytics
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 border-t border-gray-200 pt-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Recent Activity
        </h3>
        <p className="text-gray-500 italic">No recent activity to display.</p>
      </div>
    </div>
  );
};

export default Dashboard;
