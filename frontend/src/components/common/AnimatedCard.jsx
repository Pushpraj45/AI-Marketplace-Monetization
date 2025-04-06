import React from "react";
import { useSpring, animated } from "react-spring";

/**
 * AnimatedCard - Card component with hover animations
 * 
 * @param {string} className - Additional CSS classes
 * @param {boolean} lift - Enable lifting effect on hover
 * @param {boolean} glow - Enable glow effect on hover
 * @param {boolean} scale - Enable scaling effect on hover
 * @param {string} backgroundColor - Card background color 
 * @param {number} borderRadius - Card border radius in pixels
 * @param {Object} style - Additional inline styles
 */
const AnimatedCard = ({
  children,
  className = "",
  lift = true,
  glow = true,
  scale = true,
  backgroundColor = "white",
  borderRadius = 8,
  style = {},
  ...props
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  
  // Define the spring animation based on hover state
  const cardSpring = useSpring({
    transform: isHovered 
      ? `scale(${scale ? 1.03 : 1}) translateY(${lift ? -8 : 0}px)` 
      : "scale(1) translateY(0px)",
    boxShadow: isHovered 
      ? glow 
        ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 15px 5px rgba(66, 133, 244, 0.15)" 
        : "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    config: {
      mass: 1,
      tension: 300,
      friction: 20
    }
  });

  return (
    <animated.div
      className={`transition-all duration-300 ${className}`}
      style={{
        backgroundColor,
        borderRadius: `${borderRadius}px`,
        ...cardSpring,
        ...style
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {children}
    </animated.div>
  );
};

export default AnimatedCard; 