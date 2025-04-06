import React, { useState } from "react";
import { motion } from "framer-motion";

/**
 * AnimatedButton - Animated button component with different variants and effects
 * 
 * @param {string} variant - Button variant (primary, secondary, outline, text)
 * @param {string} size - Button size (sm, md, lg)
 * @param {boolean} isLoading - Loading state
 * @param {boolean} isFullWidth - Whether the button should take full width
 * @param {boolean} disabled - Whether the button is disabled
 * @param {function} onClick - Click handler function
 * @param {JSX.Element} leftIcon - Icon to display before the button text
 * @param {JSX.Element} rightIcon - Icon to display after the button text
 * @param {string} className - Additional CSS classes
 */
const AnimatedButton = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  isFullWidth = false,
  disabled = false,
  onClick,
  leftIcon,
  rightIcon,
  className = "",
  ...props
}) => {
  const [ripples, setRipples] = useState([]);

  // Calculate button styles based on variant and size
  const variantStyles = {
    primary: "bg-primary-600 hover:bg-primary-700 text-white shadow-sm focus:ring-primary-500",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 focus:ring-gray-500",
    outline: "bg-transparent hover:bg-gray-50 text-primary-600 border border-primary-600 focus:ring-primary-500",
    text: "bg-transparent hover:bg-gray-50 text-primary-600 focus:ring-primary-500",
    danger: "bg-red-600 hover:bg-red-700 text-white shadow-sm focus:ring-red-500",
    success: "bg-green-600 hover:bg-green-700 text-white shadow-sm focus:ring-green-500",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  // Add ripple effect
  const addRipple = (e) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const size = Math.max(rect.width, rect.height) * 2;
    
    const newRipple = {
      x,
      y,
      size,
      id: Date.now(),
    };
    
    setRipples([...ripples, newRipple]);
    
    // Remove ripple after animation completes
    setTimeout(() => {
      setRipples((prevRipples) => 
        prevRipples.filter((ripple) => ripple.id !== newRipple.id)
      );
    }, 600);
  };

  const handleClick = (e) => {
    if (!disabled && !isLoading) {
      addRipple(e);
      onClick && onClick(e);
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      whileHover={{ 
        scale: disabled || isLoading ? 1 : 1.02,
        transition: { duration: 0.2 }
      }}
      disabled={disabled || isLoading}
      className={`
        relative overflow-hidden rounded-md font-medium transition-all duration-200
        flex items-center justify-center
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${variantStyles[variant] || variantStyles.primary}
        ${sizeStyles[size] || sizeStyles.md}
        ${isFullWidth ? "w-full" : ""}
        ${disabled ? "opacity-60 cursor-not-allowed" : ""}
        ${className}
      `}
      {...props}
    >
      {/* Ripple effect */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          style={{
            position: "absolute",
            top: ripple.y - ripple.size / 2,
            left: ripple.x - ripple.size / 2,
            width: ripple.size,
            height: ripple.size,
            borderRadius: "50%",
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            transform: "scale(0)",
            animation: "ripple 0.6s linear",
          }}
        />
      ))}

      {/* Loading spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-inherit">
          <svg
            className="animate-spin h-5 w-5 text-current"
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
        </div>
      )}

      {/* Button content */}
      <div className={`flex items-center gap-2 ${isLoading ? "invisible" : ""}`}>
        {leftIcon && <span className="btn-icon">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="btn-icon">{rightIcon}</span>}
      </div>

      {/* CSS for ripple animation */}
      <style jsx global>{`
        @keyframes ripple {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 0;
          }
        }
      `}</style>
    </motion.button>
  );
};

export default AnimatedButton; 