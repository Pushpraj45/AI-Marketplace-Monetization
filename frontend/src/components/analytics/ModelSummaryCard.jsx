import React from 'react';

const ModelSummaryCard = ({ model, summary }) => {
  // Handle case where model or summary could be undefined or null
  if (!model || !summary) {
    return (
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <p className="text-gray-600">Model data is loading or unavailable.</p>
      </div>
    );
  }

  const formatNumber = (num) => {
    if (num === undefined || num === null) return '0';
    
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    } else {
      return num.toString();
    }
  };

  const formatRevenue = (revenue) => {
    if (revenue === undefined || revenue === null) return '$0.00';
    return `$${revenue.toFixed(2)}`;
  };

  const formatTokens = (tokens) => {
    if (tokens === undefined || tokens === null) return '0';
    
    if (tokens >= 1000000) {
      return (tokens / 1000000).toFixed(1) + 'M';
    } else if (tokens >= 1000) {
      return (tokens / 1000).toFixed(1) + 'K';
    } else {
      return tokens.toString();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not published';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'active': { bg: 'bg-green-100', text: 'text-green-800', label: 'Active' },
      'draft': { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Draft' },
      'pending-approval': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending Approval' },
      'rejected': { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' },
    };

    const config = statusConfig[status] || statusConfig.draft;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getPricingInfo = () => {
    if (!model.perTokenPricing || !model.perTokenPricing.enabled) {
      return 'Free';
    }
    return `$${model.perTokenPricing.price} per token`;
  };

  // Create safe summary values with defaults
  const safeInteractions = summary.totalInteractions ?? summary.interactions ?? 0;
  const safeRevenue = summary.totalRevenue ?? summary.revenue ?? 0;
  const safeTotalTokens = summary.totalTokens ?? (summary.tokens?.total) ?? 0;
  const safeResponseTime = summary.avgResponseTime ?? summary.responseTime?.average ?? 0;

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex flex-col md:flex-row md:justify-between">
        <div className="mb-4 md:mb-0">
          <h2 className="text-xl font-bold text-gray-900">{model.name}</h2>
          <p className="text-sm text-gray-500 mt-1">{model.description}</p>
          
          <div className="flex flex-wrap mt-4 gap-4">
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-2">Status:</span>
              {getStatusBadge(model.status)}
            </div>
            
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-2">Published:</span>
              <span className="text-sm text-gray-900">{formatDate(model.publishedAt)}</span>
            </div>
            
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-2">Pricing:</span>
              <span className="text-sm text-gray-900">{getPricingInfo()}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 md:gap-6">
          <div className="bg-blue-50 rounded-lg p-3 md:p-4 text-center min-w-[100px]">
            <p className="text-sm text-gray-600 mb-1">Interactions</p>
            <p className="text-xl font-bold text-blue-700">{formatNumber(safeInteractions)}</p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-3 md:p-4 text-center min-w-[100px]">
            <p className="text-sm text-gray-600 mb-1">Revenue</p>
            <p className="text-xl font-bold text-green-700">{formatRevenue(safeRevenue)}</p>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-3 md:p-4 text-center min-w-[100px]">
            <p className="text-sm text-gray-600 mb-1">Tokens</p>
            <p className="text-xl font-bold text-purple-700">{formatTokens(safeTotalTokens)}</p>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-3 md:p-4 text-center min-w-[100px]">
            <p className="text-sm text-gray-600 mb-1">Response Time</p>
            <p className="text-xl font-bold text-yellow-700">{typeof safeResponseTime === 'number' ? safeResponseTime.toFixed(2) : '0.00'}s</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelSummaryCard; 