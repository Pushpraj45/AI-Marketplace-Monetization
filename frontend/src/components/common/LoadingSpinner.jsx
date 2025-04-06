import React from "react";
import { motion } from "framer-motion";

const spinTransition = {
  loop: Infinity,
  duration: 1,
  ease: "linear"
};

/**
 * LoadingSpinner - Animated loading spinner component
 * 
 * @param {string} size - Size of the spinner (sm, md, lg)
 * @param {string} color - Color of the spinner
 * @param {string} text - Optional loading text
 * @param {string} className - Additional CSS classes
 */
const LoadingSpinner = ({
  size = "md",
  color = "primary",
  text = "Loading...",
  className = "",
}) => {
  // Determine size values
  const sizeValues = {
    sm: {
      outer: "w-8 h-8",
      inner: "w-6 h-6",
      text: "text-sm"
    },
    md: {
      outer: "w-12 h-12",
      inner: "w-9 h-9",
      text: "text-base"
    },
    lg: {
      outer: "w-16 h-16",
      inner: "w-12 h-12",
      text: "text-lg"
    }
  };

  // Determine color values
  const colorClasses = {
    primary: "border-primary-500",
    secondary: "border-secondary-500",
    success: "border-green-500",
    danger: "border-red-500",
    warning: "border-yellow-500",
    info: "border-blue-500",
    light: "border-gray-300",
    dark: "border-gray-700"
  };

  const sizeClass = sizeValues[size] || sizeValues.md;
  const colorClass = colorClasses[color] || colorClasses.primary;

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`relative ${sizeClass.outer}`}>
        {/* Outer static ring */}
        <div className={`absolute inset-0 rounded-full border-4 border-t-transparent ${colorClass} opacity-30`}></div>
        
        {/* Inner spinning ring */}
        <motion.div
          className={`absolute inset-0 rounded-full border-4 border-t-transparent ${colorClass}`}
          animate={{ rotate: 360 }}
          transition={spinTransition}
        ></motion.div>
      </div>
      
      {text && (
        <p className={`mt-3 text-gray-600 ${sizeClass.text}`}>{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner; 