import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

/**
 * AnimatedModal - A fully animated modal component with customizable animations
 * 
 * @param {boolean} isOpen - Whether the modal is open
 * @param {function} onClose - Function to call when modal is closed
 * @param {string} title - Modal title
 * @param {JSX.Element} children - Modal content
 * @param {boolean} showCloseButton - Whether to show the close button
 * @param {string} size - Modal size (sm, md, lg, xl, full)
 * @param {string} animation - Animation type (fade, slide, scale, flip)
 * @param {boolean} closeOnOverlayClick - Whether to close on overlay click
 * @param {boolean} closeOnEsc - Whether to close on Escape key
 * @param {JSX.Element} footer - Modal footer content
 * @param {boolean} centered - Whether the modal should be vertically centered
 */
const AnimatedModal = ({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
  size = "md",
  animation = "scale",
  closeOnOverlayClick = true,
  closeOnEsc = true,
  footer = null,
  centered = true,
}) => {
  const modalRef = useRef(null);

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (isOpen && closeOnEsc && e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, closeOnEsc, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }
    return () => {
      document.body.style.overflow = "visible";
    };
  }, [isOpen]);

  // Handle overlay click
  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  // Size classes
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    full: "max-w-full",
  };

  // Animation variants
  const animations = {
    fade: {
      overlay: {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.3 } },
        exit: { opacity: 0, transition: { duration: 0.2 } },
      },
      modal: {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.3, delay: 0.1 } },
        exit: { opacity: 0, transition: { duration: 0.2 } },
      },
    },
    scale: {
      overlay: {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.3 } },
        exit: { opacity: 0, transition: { duration: 0.2 } },
      },
      modal: {
        initial: { opacity: 0, scale: 0.75 },
        animate: { 
          opacity: 1, 
          scale: 1, 
          transition: { 
            type: "spring",
            damping: 30,
            stiffness: 500,
          } 
        },
        exit: { 
          opacity: 0, 
          scale: 0.75, 
          transition: { duration: 0.2 } 
        },
      },
    },
    slide: {
      overlay: {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.3 } },
        exit: { opacity: 0, transition: { duration: 0.2 } },
      },
      modal: {
        initial: { opacity: 0, y: -50 },
        animate: { 
          opacity: 1, 
          y: 0, 
          transition: { 
            type: "spring",
            damping: 25,
            stiffness: 500,
          } 
        },
        exit: { 
          opacity: 0, 
          y: -50, 
          transition: { duration: 0.2 } 
        },
      },
    },
    flip: {
      overlay: {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.3 } },
        exit: { opacity: 0, transition: { duration: 0.2 } },
      },
      modal: {
        initial: { opacity: 0, rotateX: 90, y: -50 },
        animate: { 
          opacity: 1, 
          rotateX: 0, 
          y: 0, 
          transition: { 
            type: "spring",
            damping: 20,
            stiffness: 300,
          } 
        },
        exit: { 
          opacity: 0, 
          rotateX: 90, 
          y: -50, 
          transition: { duration: 0.3 } 
        },
      },
    },
  };

  // Get selected animation variant
  const selectedAnimation = animations[animation] || animations.scale;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            variants={selectedAnimation.overlay}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={handleOverlayClick}
          />

          <div className={`flex min-h-full ${centered ? 'items-center' : 'items-start'} justify-center p-4 text-center sm:p-0`}>
            <motion.div
              ref={modalRef}
              className={`relative w-full ${sizeClasses[size] || sizeClasses.md} bg-white rounded-lg shadow-xl overflow-hidden transform transition-all`}
              variants={selectedAnimation.modal}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {/* Header */}
              {(title || showCloseButton) && (
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  {title && (
                    <h3 className="text-lg font-medium text-gray-900">
                      {title}
                    </h3>
                  )}
                  {showCloseButton && (
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-500 focus:outline-none"
                      onClick={onClose}
                    >
                      <span className="sr-only">Close</span>
                      <svg
                        className="h-6 w-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="p-6">
                {children}
              </div>

              {/* Footer */}
              {footer && (
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6 flex justify-end">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default AnimatedModal; 