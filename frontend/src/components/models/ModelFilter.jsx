import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ModelFilter = ({ 
  categories = [],
  selectedCategory,
  onCategoryChange,
  priceRanges = [],
  selectedPriceRange,
  onPriceRangeChange,
  sortOptions = [],
  selectedSortOption,
  onSortOptionChange,
  onClearFilters,
  isMobile = false,
  onClose = () => {}
}) => {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    sort: true
  });

  // Define animation variants
  const containerVariants = {
    hidden: {
      opacity: 0,
      x: isMobile ? '-100%' : 0,
      y: isMobile ? 0 : 20,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 300,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      x: isMobile ? '-100%' : 0,
      y: isMobile ? 0 : 20,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 300,
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 300
      }
    },
    exit: { 
      opacity: 0, 
      y: 10,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 300
      }
    }
  };

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  // Default categories if none provided
  const defaultCategories = [
    { id: 'text-generation', name: 'Text Generation' },
    { id: 'image-generation', name: 'Image Generation' },
    { id: 'text-to-speech', name: 'Text to Speech' },
    { id: 'speech-to-text', name: 'Speech to Text' },
    { id: 'translation', name: 'Translation' },
    { id: 'question-answering', name: 'Question Answering' },
    { id: 'sentiment-analysis', name: 'Sentiment Analysis' },
    { id: 'code-generation', name: 'Code Generation' }
  ];

  // Default price ranges if none provided
  const defaultPriceRanges = [
    { id: 'free', name: 'Free' },
    { id: 'under-0.01', name: 'Under $0.01 per request' },
    { id: '0.01-0.1', name: '$0.01 - $0.1 per request' },
    { id: '0.1-1', name: '$0.1 - $1 per request' },
    { id: 'above-1', name: 'Above $1 per request' },
    { id: 'subscription', name: 'Subscription only' }
  ];

  // Default sort options if none provided
  const defaultSortOptions = [
    { id: 'popular', name: 'Most Popular' },
    { id: 'newest', name: 'Newest' },
    { id: 'rating', name: 'Highest Rated' },
    { id: 'price-low', name: 'Price: Low to High' },
    { id: 'price-high', name: 'Price: High to Low' }
  ];

  // Use provided or default values
  const displayCategories = categories.length > 0 ? categories : defaultCategories;
  const displayPriceRanges = priceRanges.length > 0 ? priceRanges : defaultPriceRanges;
  const displaySortOptions = sortOptions.length > 0 ? sortOptions : defaultSortOptions;

  return (
    <motion.div
      className={`bg-white ${isMobile ? 'fixed inset-y-0 left-0 z-40 w-72 overflow-y-auto shadow-xl' : 'rounded-lg border border-gray-200 p-5 shadow-sm'}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {isMobile && (
        <div className="sticky top-0 z-10 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Filters</h2>
            <motion.button
              onClick={onClose}
              className="rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-500"
              whileHover={{ rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          </div>
        </div>
      )}

      <div className={isMobile ? 'p-4' : ''}>
        {!isMobile && (
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Filters</h2>
            <motion.button
              onClick={onClearFilters}
              className="text-sm font-medium text-primary-600 hover:text-primary-800"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Clear all
            </motion.button>
          </div>
        )}

        {/* Category filter */}
        <div className="border-b border-gray-200 pb-5 pt-1">
          <div className="flex cursor-pointer items-center justify-between" onClick={() => toggleSection('categories')}>
            <h3 className="text-base font-medium text-gray-900">Categories</h3>
            <motion.div
              animate={{ rotate: expandedSections.categories ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <svg className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </motion.div>
          </div>
          <AnimatePresence>
            {expandedSections.categories && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-2 overflow-hidden"
              >
                <div className="space-y-2">
                  {displayCategories.map((category) => (
                    <motion.div
                      key={category.id}
                      className="flex items-center"
                      variants={itemVariants}
                    >
                      <input
                        id={`category-${category.id}`}
                        name={`category-${category.id}`}
                        type="checkbox"
                        checked={selectedCategory === category.id}
                        onChange={() => onCategoryChange(category.id)}
                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <motion.label
                        htmlFor={`category-${category.id}`}
                        className="ml-3 block text-sm text-gray-700 cursor-pointer"
                        whileHover={{ x: 2 }}
                      >
                        {category.name}
                      </motion.label>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Price range filter */}
        <div className="border-b border-gray-200 py-5">
          <div className="flex cursor-pointer items-center justify-between" onClick={() => toggleSection('price')}>
            <h3 className="text-base font-medium text-gray-900">Price</h3>
            <motion.div
              animate={{ rotate: expandedSections.price ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <svg className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </motion.div>
          </div>
          <AnimatePresence>
            {expandedSections.price && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-2 overflow-hidden"
              >
                <div className="space-y-2">
                  {displayPriceRanges.map((priceRange) => (
                    <motion.div
                      key={priceRange.id}
                      className="flex items-center"
                      variants={itemVariants}
                    >
                      <input
                        id={`price-${priceRange.id}`}
                        name={`price-${priceRange.id}`}
                        type="checkbox"
                        checked={selectedPriceRange === priceRange.id}
                        onChange={() => onPriceRangeChange(priceRange.id)}
                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <motion.label
                        htmlFor={`price-${priceRange.id}`}
                        className="ml-3 block text-sm text-gray-700 cursor-pointer"
                        whileHover={{ x: 2 }}
                      >
                        {priceRange.name}
                      </motion.label>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sort options */}
        <div className="pt-5">
          <div className="flex cursor-pointer items-center justify-between" onClick={() => toggleSection('sort')}>
            <h3 className="text-base font-medium text-gray-900">Sort By</h3>
            <motion.div
              animate={{ rotate: expandedSections.sort ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <svg className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </motion.div>
          </div>
          <AnimatePresence>
            {expandedSections.sort && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-2 overflow-hidden"
              >
                <div className="space-y-2">
                  {displaySortOptions.map((sortOption) => (
                    <motion.div
                      key={sortOption.id}
                      className="flex items-center"
                      variants={itemVariants}
                    >
                      <input
                        id={`sort-${sortOption.id}`}
                        name="sort-option"
                        type="radio"
                        checked={selectedSortOption === sortOption.id}
                        onChange={() => onSortOptionChange(sortOption.id)}
                        className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <motion.label
                        htmlFor={`sort-${sortOption.id}`}
                        className="ml-3 block text-sm text-gray-700 cursor-pointer"
                        whileHover={{ x: 2 }}
                      >
                        {sortOption.name}
                      </motion.label>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {isMobile && (
          <motion.div
            className="mt-6 flex items-center justify-center"
            variants={itemVariants}
          >
            <motion.button
              onClick={onClearFilters}
              className="mr-2 w-1/2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Clear All
            </motion.button>
            <motion.button
              onClick={onClose}
              className="w-1/2 rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Apply Filters
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ModelFilter; 