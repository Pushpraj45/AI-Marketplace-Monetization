import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const VerifyEmail = () => {
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");
  const { token } = useParams();
  const { verifyEmail } = useAuth();

  useEffect(() => {
    const verifyUserEmail = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await verifyEmail(token);

        if (response.success) {
          setVerified(true);
        } else {
          setError(
            response.message ||
              "Failed to verify email. The link may be invalid or expired."
          );
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to verify email. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    verifyUserEmail();
  }, [token, verifyEmail]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
          <h2 className="text-xl font-semibold text-gray-800">
            Verifying your email...
          </h2>
          <p className="text-gray-600">This may take a moment.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md text-center">
          <div className="rounded-full h-12 w-12 flex items-center justify-center bg-red-100 mx-auto">
            <svg
              className="h-6 w-6 text-red-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-red-800">
            Verification Failed
          </h2>
          <p className="text-gray-600">{error}</p>
          <div className="mt-6">
            <Link
              to="/login"
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md text-center">
        <div className="rounded-full h-12 w-12 flex items-center justify-center bg-green-100 mx-auto">
          <svg
            className="h-6 w-6 text-green-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-green-800">
          Email Verified!
        </h2>
        <p className="text-gray-600">
          Your email has been successfully verified. You can now log in to your
          account.
        </p>
        <div className="mt-6">
          <Link
            to="/login"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Log in to your account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
