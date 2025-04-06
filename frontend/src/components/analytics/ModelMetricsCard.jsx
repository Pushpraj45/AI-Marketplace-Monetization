import React from 'react';

const ModelMetricsCard = ({ metrics }) => {
  if (!metrics) return null;
  
  // Ensure all metrics have default values
  const {
    revenuePerInteraction = 0,
    tokensPerInteraction = 0,
    costPerToken = 0,
    retentionRate = 0,
    projectedMonthlyRevenue = 0,
    projectedYearlyRevenue = 0,
    growth = {}
  } = metrics;
  
  // Format numbers for display
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
  
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '$0.00';
    return `$${parseFloat(amount).toFixed(2)}`;
  };
  
  const formatPercentage = (value) => {
    if (value === undefined || value === null) return '0%';
    return `${value}%`;
  };
  
  // Helper function for growth indicator
  const getGrowthIndicator = (value) => {
    if (!value && value !== 0) value = 0;
    
    if (value > 0) {
      return (
        <span className="inline-flex items-center text-green-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
          </svg>
          {formatPercentage(value)}
        </span>
      );
    } else if (value < 0) {
      return (
        <span className="inline-flex items-center text-red-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
          </svg>
          {formatPercentage(Math.abs(value))}
        </span>
      );
    } else {
      return (
        <span className="text-gray-500">0%</span>
      );
    }
  };
  
  const metrics1 = [
    {
      label: "Revenue Per Interaction",
      value: formatCurrency(revenuePerInteraction),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      label: "Tokens Per Interaction",
      value: formatNumber(tokensPerInteraction),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
          <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
          <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
          <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
        </svg>
      )
    },
    {
      label: "Cost Per Token",
      value: `$${typeof costPerToken === 'number' ? costPerToken.toFixed(6) : '0.000000'}`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 5a1 1 0 100 2h1a2 2 0 011.732 1H7a1 1 0 100 2h2.732A2 2 0 018 11H7a1 1 0 00-.707 1.707l3 3a1 1 0 001.414-1.414l-1.483-1.484A4.008 4.008 0 0011.874 10H13a1 1 0 100-2h-1.126a3.976 3.976 0 00-.41-1H13a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      label: "Retention Rate",
      value: formatPercentage(retentionRate),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 2a6 6 0 00-4.33 10.146c.776-1.268 2.037-2.145 3.472-2.146a3.012 3.012 0 011.673.51 3.97 3.97 0 011.185.86 4.017 4.017 0 011.185-.86 3.013 3.013 0 011.673-.51c1.434 0 2.695.878 3.472 2.146A6 6 0 0010 4zm2.504 8.5l-.72.72a1 1 0 11-1.414-1.414l.72-.72a1 1 0 111.414 1.414zm-6.54-1.414l.72.72a1 1 0 01-1.414 1.414l-.72-.72a1 1 0 011.414-1.414zM10 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
      )
    }
  ];
  
  const metrics2 = [
    {
      label: "Projected Monthly Revenue",
      value: formatCurrency(projectedMonthlyRevenue),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      label: "Projected Yearly Revenue",
      value: formatCurrency(projectedYearlyRevenue),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
        </svg>
      )
    }
  ];
  
  const growthMetrics = [
    {
      label: "Interactions Growth",
      value: growth?.interactions || 0,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
        </svg>
      )
    },
    {
      label: "Revenue Growth",
      value: growth?.revenue || 0,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      label: "Token Usage Growth",
      value: growth?.tokens || 0,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
          <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
          <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
          <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
        </svg>
      )
    }
  ];
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Performance Metrics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-md font-medium text-gray-700 mb-3">Usage Metrics</h3>
          <div className="space-y-4">
            {metrics1.map((metric, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-3 p-2 rounded-full bg-gray-100">
                    {metric.icon}
                  </div>
                  <span className="text-sm text-gray-600">{metric.label}</span>
                </div>
                <span className="font-medium text-gray-800">{metric.value}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-md font-medium text-gray-700 mb-3">Projected Revenue</h3>
          <div className="space-y-4">
            {metrics2.map((metric, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-3 p-2 rounded-full bg-gray-100">
                    {metric.icon}
                  </div>
                  <span className="text-sm text-gray-600">{metric.label}</span>
                </div>
                <span className="font-medium text-gray-800">{metric.value}</span>
              </div>
            ))}
          </div>
          
          <h3 className="text-md font-medium text-gray-700 mt-6 mb-3">Growth</h3>
          <div className="space-y-4">
            {growthMetrics.map((metric, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-3 p-2 rounded-full bg-gray-100">
                    {metric.icon}
                  </div>
                  <span className="text-sm text-gray-600">{metric.label}</span>
                </div>
                {getGrowthIndicator(metric.value)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelMetricsCard; 