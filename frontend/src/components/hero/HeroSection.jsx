import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HeroSection = ({ 
  title = "Discover & Monetize AI Models",
  subtitle = "The premier marketplace for AI developers to showcase their models and for businesses to find the perfect AI solution.",
  primaryCta = "Explore Models",
  secondaryCta = "Become a Developer",
  primaryCtaLink = "/marketplace",
  secondaryCtaLink = "/dev-signup"
}) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };
  
  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: {
      scale: 0.95
    }
  };
  
  const bgVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        duration: 0.8 
      }
    }
  };
  
  const shapeVariants = {
    initial: { scale: 0 },
    animate: { 
      scale: 1, 
      transition: { 
        type: "spring", 
        stiffness: 50, 
        damping: 10,
        delay: 0.5 
      } 
    }
  };
  
  const floatingAnimation = {
    y: [0, -15, 0],
    transition: {
      y: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-gray-50 to-gray-100 py-16 sm:py-24">
      {/* Animated background shapes */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          variants={bgVariants}
          initial="hidden"
          animate="visible"
          className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50"
        />
        
        {/* Background animated shapes */}
        <motion.div 
          className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-primary-100 opacity-20 blur-2xl"
          variants={shapeVariants}
          initial="initial"
          animate="animate"
        />
        <motion.div 
          className="absolute top-1/4 right-1/3 h-96 w-96 rounded-full bg-purple-100 opacity-30 blur-3xl"
          variants={shapeVariants}
          initial="initial"
          animate="animate"
          style={{ animationDelay: "0.2s" }}
        />
        <motion.div 
          className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-teal-100 opacity-20 blur-2xl"
          variants={shapeVariants}
          initial="initial"
          animate="animate"
          style={{ animationDelay: "0.4s" }}
        />
      </div>
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Text content */}
          <motion.div 
            className="lg:col-span-6 xl:col-span-5"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="text-center lg:text-left">
              <motion.h1 
                className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl"
                variants={itemVariants}
              >
                {title}
              </motion.h1>
              <motion.p 
                className="mt-6 text-lg leading-8 text-gray-600"
                variants={itemVariants}
              >
                {subtitle}
              </motion.p>
              <motion.div 
                className="mt-10 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 lg:justify-start justify-center"
                variants={itemVariants}
              >
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Link
                    to={primaryCtaLink}
                    className="rounded-md bg-primary-600 px-6 py-3.5 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    {primaryCta}
                  </Link>
                </motion.div>
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Link
                    to={secondaryCtaLink}
                    className="rounded-md bg-white px-6 py-3.5 text-base font-medium text-primary-700 shadow-sm ring-1 ring-primary-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    {secondaryCta}
                  </Link>
                </motion.div>
              </motion.div>
              
              {/* Statistics */}
              <motion.div 
                className="mt-12 grid grid-cols-3 gap-5 text-center lg:text-left"
                variants={itemVariants}
              >
                <div>
                  <motion.p 
                    className="text-3xl font-bold text-primary-600"
                    animate={{ y: [0, -15, 0] }}
                    transition={{
                      y: {
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut"
                      }
                    }}
                  >
                    500+
                  </motion.p>
                  <p className="text-sm text-gray-500">AI Models</p>
                </div>
                <div>
                  <motion.p 
                    className="text-3xl font-bold text-primary-600"
                    animate={{ y: [0, -15, 0] }}
                    transition={{
                      y: {
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                        delay: 0.3
                      }
                    }}
                  >
                    10K+
                  </motion.p>
                  <p className="text-sm text-gray-500">Active Users</p>
                </div>
                <div>
                  <motion.p 
                    className="text-3xl font-bold text-primary-600"
                    animate={{ y: [0, -15, 0] }}
                    transition={{
                      y: {
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                        delay: 0.6
                      }
                    }}
                  >
                    99.9%
                  </motion.p>
                  <p className="text-sm text-gray-500">Uptime</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Image/Illustration */}
          <motion.div 
            className="relative mt-12 lg:col-span-6 lg:mt-0 xl:col-span-7"
            initial={{ opacity: 0, x: 100 }}
            animate={{ 
              opacity: 1, 
              x: 0,
              transition: {
                type: "spring",
                stiffness: 50,
                damping: 20,
                delay: 0.5
              }
            }}
          >
            <div className="relative">
              <motion.div 
                className="absolute -left-10 top-1/2 h-16 w-16 rounded-full bg-blue-100"
                animate={{
                  y: [0, 15, 0],
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
              <motion.div 
                className="absolute -right-6 bottom-1/3 h-24 w-24 rounded-full bg-purple-100"
                animate={{
                  y: [0, -20, 0],
                  scale: [1, 1.2, 1],
                  opacity: [0.6, 0.9, 0.6],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
              
              {/* Main illustration */}
              <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
                <motion.div 
                  className="overflow-hidden rounded-lg shadow-xl"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 100, damping: 10 }}
                >
                  <svg
                    className="h-full w-full text-gray-200"
                    fill="currentColor"
                    viewBox="0 0 900 600"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect x="0" y="0" width="900" height="600" fill="#f9fafb" />
                    <motion.path
                      d="M0 241L21.5 238.2C43 235.3 86 229.7 128.8 227.5C171.7 225.3 214.3 226.7 257.2 231.2C300 235.7 343 243.3 385.8 247.3C428.7 251.3 471.3 251.7 514.2 247.8C557 244 600 236 642.8 229.7C685.7 223.3 728.3 218.7 771.2 222.8C814 227 857 240 878.5 246.5L900 253L900 601L878.5 601C857 601 814 601 771.2 601C728.3 601 685.7 601 642.8 601C600 601 557 601 514.2 601C471.3 601 428.7 601 385.8 601C343 601 300 601 257.2 601C214.3 601 171.7 601 128.8 601C86 601 43 601 21.5 601L0 601Z"
                      fill="#3b82f6"
                      strokeLinecap="round"
                      strokeLinejoin="miter"
                      initial={{ y: 300, opacity: 0 }}
                      animate={{ y: 0, opacity: 0.3 }}
                      transition={{ duration: 2, ease: "easeOut" }}
                    />
                    <motion.path
                      d="M0 301L21.5 304.3C43 307.7 86 314.3 128.8 316.2C171.7 318 214.3 315 257.2 311C300 307 343 302 385.8 297.7C428.7 293.3 471.3 289.7 514.2 291.8C557 294 600 302 642.8 306.2C685.7 310.3 728.3 310.7 771.2 308.5C814 306.3 857 301.7 878.5 299.3L900 297L900 601L878.5 601C857 601 814 601 771.2 601C728.3 601 685.7 601 642.8 601C600 601 557 601 514.2 601C471.3 601 428.7 601 385.8 601C343 601 300 601 257.2 601C214.3 601 171.7 601 128.8 601C86 601 43 601 21.5 601L0 601Z"
                      fill="#3b82f6"
                      strokeLinecap="round"
                      strokeLinejoin="miter"
                      initial={{ y: 200, opacity: 0 }}
                      animate={{ y: 0, opacity: 0.4 }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                    />
                    <motion.path
                      d="M0 361L21.5 364.3C43 367.7 86 374.3 128.8 373.2C171.7 372 214.3 363 257.2 356.8C300 350.7 343 347.3 385.8 348.5C428.7 349.7 471.3 355.3 514.2 355.8C557 356.3 600 351.7 642.8 353.3C685.7 355 728.3 363 771.2 368.2C814 373.3 857 375.7 878.5 376.8L900 378L900 601L878.5 601C857 601 814 601 771.2 601C728.3 601 685.7 601 642.8 601C600 601 557 601 514.2 601C471.3 601 428.7 601 385.8 601C343 601 300 601 257.2 601C214.3 601 171.7 601 128.8 601C86 601 43 601 21.5 601L0 601Z"
                      fill="#3b82f6"
                      strokeLinecap="round"
                      strokeLinejoin="miter"
                      initial={{ y: 100, opacity: 0 }}
                      animate={{ y: 0, opacity: 0.5 }}
                      transition={{ duration: 1, ease: "easeOut", delay: 1 }}
                    />
                    <motion.path
                      d="M0 421L21.5 423.3C43 425.7 86 430.3 128.8 431.7C171.7 433 214.3 431 257.2 430.5C300 430 343 431 385.8 428.8C428.7 426.7 471.3 421.3 514.2 419.7C557 418 600 420 642.8 423.5C685.7 427 728.3 432 771.2 435.3C814 438.7 857 440.3 878.5 441.2L900 442L900 601L878.5 601C857 601 814 601 771.2 601C728.3 601 685.7 601 642.8 601C600 601 557 601 514.2 601C471.3 601 428.7 601 385.8 601C343 601 300 601 257.2 601C214.3 601 171.7 601 128.8 601C86 601 43 601 21.5 601L0 601Z"
                      fill="#3b82f6"
                      strokeLinecap="round"
                      strokeLinejoin="miter"
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 0.7 }}
                      transition={{ duration: 0.5, ease: "easeOut", delay: 1.5 }}
                    />
                  </svg>
                  
                  {/* Add animated elements on top of the waves */}
                  <motion.div 
                    className="absolute left-1/4 top-1/3 h-16 w-16 rounded-full bg-white shadow-lg flex items-center justify-center"
                    animate={{
                      y: [0, -20, 0],
                      rotate: [0, 10, 0],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  >
                    <span className="text-3xl">🤖</span>
                  </motion.div>
                  
                  <motion.div 
                    className="absolute right-1/4 top-1/2 h-16 w-16 rounded-full bg-white shadow-lg flex items-center justify-center"
                    animate={{
                      y: [0, 20, 0],
                      rotate: [0, -10, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      repeatType: "reverse",
                      delay: 1
                    }}
                  >
                    <span className="text-3xl">✨</span>
                  </motion.div>
                  
                  <motion.div 
                    className="absolute left-1/2 bottom-1/4 h-16 w-16 rounded-full bg-white shadow-lg flex items-center justify-center"
                    animate={{
                      y: [0, -15, 0],
                      rotate: [0, 5, 0],
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      repeatType: "reverse",
                      delay: 2
                    }}
                  >
                    <span className="text-3xl">🧠</span>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;