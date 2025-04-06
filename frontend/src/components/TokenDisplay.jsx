import React from "react";
import { Link } from "react-router-dom";
import { useTokens } from "../contexts/TokenContext";

const TokenDisplay = () => {
  const { tokenBalance, loading, error } = useTokens();

  if (loading) {
    return (
      <div className="flex items-center bg-gray-100 rounded-full px-3 py-1">
        <div className="animate-pulse h-4 w-16 bg-gray-300 rounded"></div>
      </div>
    );
  }

  if (error || tokenBalance === null) {
    return (
      <div className="text-red-500 text-sm">
        <span role="img" aria-label="error">⚠️</span> Token error
      </div>
    );
  }

  return (
    <Link
      to="/dashboard"
      className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 rounded-full px-3 py-1 transition-colors"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 text-blue-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span className="font-medium text-blue-800">
        {tokenBalance.toLocaleString()}
      </span>
    </Link>
  );
};

export default TokenDisplay; 