import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const DevProfile = () => {
  const { currentUser, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: currentUser?.profile?.name || "",
    organization: currentUser?.profile?.organization || "",
    bio: currentUser?.profile?.bio || "",
  });

  // Mock data for published models - in a real app, this would come from an API
  const [publishedModels] = useState([
    {
      id: "model1",
      name: "Text Classification Model",
      description: "A model for classifying text into categories",
      status: "active",
      usageCount: 1243,
      revenue: 560.2,
    },
    {
      id: "model2",
      name: "Image Recognition API",
      description: "Identifies objects in images with high accuracy",
      status: "pending-review",
      usageCount: 0,
      revenue: 0,
    },
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const profileData = {
        profile: {
          ...formData,
        },
      };

      const response = await updateProfile(currentUser.id, profileData);

      if (response.success) {
        setSuccess("Profile updated successfully!");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Developer Profile
        </h1>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{success}</p>
              </div>
            </div>
          </div>
        )}

        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center mb-4">
            <div className="bg-primary-100 p-2 rounded-full mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-primary-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                {currentUser?.email}
              </h2>
              <p className="text-sm text-gray-500 capitalize">
                {currentUser?.role}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label
                htmlFor="organization"
                className="block text-sm font-medium text-gray-700"
              >
                Organization
              </label>
              <input
                type="text"
                id="organization"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-gray-700"
              >
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows="3"
                value={formData.bio}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              ></textarea>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                loading ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Published Models Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900">Published Models</h2>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
            Publish New Model
          </button>
        </div>

        {publishedModels.length === 0 ? (
          <p className="text-gray-500 italic">
            You have not published any models yet.
          </p>
        ) : (
          <div className="space-y-4">
            {publishedModels.map((model) => (
              <div
                key={model.id}
                className="border border-gray-200 rounded-md p-4"
              >
                <div className="flex justify-between">
                  <h3 className="text-md font-medium text-gray-900">
                    {model.name}
                  </h3>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      model.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {model.status === "active" ? "Active" : "Pending Review"}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  {model.description}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Usage</p>
                    <p className="text-lg font-medium text-gray-900">
                      {model.usageCount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Revenue</p>
                    <p className="text-lg font-medium text-gray-900">
                      ${model.revenue.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex space-x-3">
                  <button className="text-primary-600 hover:text-primary-800 text-sm font-medium">
                    View Details
                  </button>
                  <button className="text-primary-600 hover:text-primary-800 text-sm font-medium">
                    Edit
                  </button>
                  <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                    Unpublish
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* API Keys Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">API Keys</h2>
        <p className="text-gray-600 mb-4">
          Use these keys to authenticate your API requests.
        </p>

        <div className="border border-gray-200 rounded-md p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-700">
                Production Key
              </p>
              <p className="text-sm text-gray-500">Use for live applications</p>
            </div>
            <button className="text-primary-600 hover:text-primary-800 text-sm font-medium">
              Show Key
            </button>
          </div>
        </div>

        <div className="mt-4 border border-gray-200 rounded-md p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-700">Test Key</p>
              <p className="text-sm text-gray-500">
                Use for development and testing
              </p>
            </div>
            <button className="text-primary-600 hover:text-primary-800 text-sm font-medium">
              Show Key
            </button>
          </div>
        </div>

        <button className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
          Generate New Keys
        </button>
      </div>
    </div>
  );
};

export default DevProfile;
