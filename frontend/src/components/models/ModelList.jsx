import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ModelList = ({ models = [], title = "AI Models" }) => {
  const [hoveredId, setHoveredId] = useState(null);

  // No models yet state
  if (models.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 bg-white rounded-lg shadow-sm text-center"
      >
        <div className="text-4xl mb-4">🔍</div>
        <h3 className="text-lg font-medium text-gray-900">No models found</h3>
        <p className="mt-2 text-gray-500">
          Try adjusting your filters or check back later for new models.
        </p>
      </motion.div>
    );
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <div className="w-full">
      <motion.h2 
        className="text-2xl font-bold mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {title}
      </motion.h2>
      
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {models.map((model) => (
          <motion.div 
            key={model.id} 
            variants={itemVariants}
            whileHover={{ 
              y: -5, 
              transition: { duration: 0.2 }
            }}
            onHoverStart={() => setHoveredId(model.id)}
            onHoverEnd={() => setHoveredId(null)}
          >
            <Link to={`/model/${model.id}`} className="block h-full">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden h-full border border-gray-200 hover:border-primary-300 transition-colors duration-200">
                {/* Model image */}
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                  {model.image ? (
                    <img 
                      src={model.image} 
                      alt={model.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gradient-to-r from-primary-50 to-blue-50">
                      <span className="text-4xl">🤖</span>
                    </div>
                  )}
                  
                  {/* Category tag */}
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      {model.category}
                    </span>
                  </div>
                </div>
                
                {/* Model info */}
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-gray-900 line-clamp-1">
                      {model.name}
                    </h3>
                    
                    {/* Rating */}
                    {model.rating && (
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="ml-1 text-sm text-gray-600">{model.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                    {model.description}
                  </p>
                  
                  {/* Price and developer info */}
                  <div className="mt-4 flex justify-between items-center">
                    <div className="text-primary-600 font-medium">
                      {model.price === 0 ? (
                        "Free"
                      ) : (
                        `$${model.price.toFixed(2)}${model.pricingModel === 'subscription' ? '/mo' : model.pricingModel === 'api' ? '/call' : ''}`
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      By {model.developer}
                    </div>
                  </div>
                  
                  {/* Animated highlight when hovered */}
                  <motion.div 
                    className="mt-4 h-0.5 bg-primary-500 transform origin-left"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: hoveredId === model.id ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ModelList; 