import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AnimatedCard } from '../common/AnimatedCard';

const ModelCard = ({ model, featured = false }) => {
  // Define default model data if not provided
  const defaultModel = {
    id: '1',
    name: 'AI Model',
    description: 'This is an AI model description',
    imageUrl: 'https://placehold.co/600x400',
    category: 'Other',
    rating: 4.5,
    reviewCount: 120,
    usageCount: 5800,
    price: {
      type: 'usage',
      amount: 0.0012,
      currency: 'USD'
    },
    developer: {
      name: 'AI Developer',
      verified: true
    }
  };

  // Merge with defaults for any missing properties
  const modelData = { ...defaultModel, ...model };

  // Format price display
  const formatPrice = (price) => {
    if (!price) return 'Free';
    
    if (price.type === 'free') return 'Free';
    
    if (price.type === 'subscription') {
      return `$${price.amount}/${price.interval}`;
    }
    
    if (price.type === 'usage') {
      // Format very small numbers correctly
      const formattedAmount = price.amount < 0.01 
        ? `$${price.amount.toFixed(6)}` 
        : `$${price.amount.toFixed(2)}`;
        
      return `${formattedAmount}/request`;
    }
    
    return `$${price.amount}`;
  };

  // Format usage count 
  const formatCount = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  // Card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    hover: {
      y: -10,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  // Badge animation variants
  const badgeVariants = {
    hover: {
      scale: 1.1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  return (
    <AnimatedCard
      lift={true}
      glow={true}
      scale={1.02}
      className={`overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm ${
        featured ? 'lg:col-span-2 lg:grid lg:grid-cols-2 lg:gap-0' : ''
      }`}
    >
      <Link to={`/model/${modelData.id}`} className="block h-full">
        <div className={`flex h-full flex-col ${featured ? 'lg:flex-row' : ''}`}>
          {/* Card image */}
          <div className={`relative ${featured ? 'lg:w-full' : 'h-48'}`}>
            <motion.div 
              className="absolute top-3 left-3 z-10 flex gap-2"
              initial="hidden"
              animate="visible"
              whileHover="hover"
            >
              {modelData.featured && (
                <motion.span
                  className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800"
                  variants={badgeVariants}
                >
                  Featured
                </motion.span>
              )}
              {modelData.isNew && (
                <motion.span
                  className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800"
                  variants={badgeVariants}
                >
                  New
                </motion.span>
              )}
              {modelData.trending && (
                <motion.span
                  className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800"
                  variants={badgeVariants}
                >
                  Trending
                </motion.span>
              )}
            </motion.div>
            <motion.img
              src={modelData.imageUrl}
              alt={modelData.name}
              className={`h-full w-full object-cover ${featured ? 'lg:h-full' : 'h-48'}`}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            />
          </div>

          {/* Card content */}
          <div className="flex flex-1 flex-col p-6">
            <div className="flex items-center justify-between mb-2">
              <motion.span
                className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
                whileHover={{ scale: 1.1 }}
              >
                {modelData.category}
              </motion.span>
              <div className="flex items-center">
                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="ml-1 text-sm font-medium text-gray-700">{modelData.rating}</span>
                <span className="ml-1 text-sm text-gray-500">({modelData.reviewCount})</span>
              </div>
            </div>

            <motion.h3 
              className="mb-2 text-xl font-semibold text-gray-900 flex items-center"
              whileHover={{ x: 3 }}
            >
              {modelData.name}
              {modelData.developer?.verified && (
                <motion.svg 
                  className="ml-1 h-5 w-5 text-blue-500" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <path fillRule="evenodd" clipRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                </motion.svg>
              )}
            </motion.h3>

            <p className="mb-4 text-sm text-gray-600 flex-grow line-clamp-2">
              {modelData.description}
            </p>

            <div className="flex items-center text-sm text-gray-600 mb-4">
              <span className="font-medium mr-1">By:</span>
              <span>{modelData.developer?.name}</span>
            </div>

            <div className="mt-auto grid grid-cols-2 gap-2 text-sm">
              <div className="flex flex-col">
                <span className="text-gray-500">Usage</span>
                <motion.span 
                  className="font-medium text-gray-900"
                  whileHover={{ scale: 1.1, x: 2 }}
                >
                  {formatCount(modelData.usageCount)}
                </motion.span>
              </div>

              <div className="flex flex-col text-right">
                <span className="text-gray-500">Price</span>
                <motion.span 
                  className="font-medium text-gray-900"
                  whileHover={{ scale: 1.1, x: -2 }}
                >
                  {formatPrice(modelData.price)}
                </motion.span>
              </div>
            </div>

            <motion.div 
              className="mt-4 flex justify-between items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.button
                className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                whileHover={{ scale: 1.05, x: 2 }}
                whileTap={{ scale: 0.95 }}
              >
                View Details
              </motion.button>
              <motion.button
                className="rounded-md bg-primary-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-700"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Try Now
              </motion.button>
            </motion.div>
          </div>
        </div>
      </Link>
    </AnimatedCard>
  );
};

export default ModelCard;