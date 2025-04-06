import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

// Animation variants for different animation styles
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const slideIn = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const slideInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const scaleUp = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    }
  }
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const animationVariants = {
  fadeIn,
  slideIn,
  slideInRight,
  scaleUp,
  staggerChildren,
  staggerItem
};

/**
 * AnimatedSection - Wrap components with animations triggered when they come into view
 * @param {string} animation - Animation type: "fadeIn", "slideIn", "slideInRight", "scaleUp", "staggerChildren"
 * @param {Object} customVariants - Optional custom animation variants
 * @param {number} delay - Delay before animation starts (in seconds)
 * @param {number} threshold - Viewport threshold to trigger animation (0-1)
 * @param {string} className - Additional CSS classes
 * @param {boolean} once - If true, animation plays only once
 */
const AnimatedSection = ({
  children,
  animation = "fadeIn",
  customVariants,
  delay = 0,
  threshold = 0.2,
  className = "",
  once = true,
  ...props
}) => {
  const [ref, inView] = useInView({
    triggerOnce: once,
    threshold
  });

  const selectedVariant = customVariants || animationVariants[animation] || fadeIn;
  
  // Add delay to the variant if specified
  const variantWithDelay = {
    ...selectedVariant,
    visible: {
      ...selectedVariant.visible,
      transition: {
        ...selectedVariant.visible.transition,
        delay
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variantWithDelay}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// For use with staggerChildren animation
export const AnimatedItem = ({ children, className = "", ...props }) => {
  return (
    <motion.div
      variants={staggerItem}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection; 