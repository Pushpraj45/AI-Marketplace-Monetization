import React from 'react';

const DashboardSummary = ({ summaryData }) => {
  // Add a null check to handle cases where summary might be undefined
  if (!summaryData) {
    console.log("Missing or invalid summary data:", summaryData);
    return (
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Dashboard Summary</h2>
        <div className="p-4 border border-gray-300 rounded-lg text-gray-600">
          No summary data available at this time.
        </div>
      </div>
    );
  }

  // Handle the structure correctly - the API returns data in a nested 'data' property
  const data = summaryData.data || summaryData;
  
  // Create defaults for missing values
  const totalModels = data.totalModels || data.summary?.totalModels || data.models?.length || data.modelsPerformance?.length || 0;
  const totalInteractions = data.totalInteractions || data.summary?.totalInteractions || 0;
  const totalRevenue = data.totalRevenue || data.summary?.totalRevenue || 0;
  const totalTokens = data.totalTokens || data.summary?.totalTokens || 0;

  // Calculate derived metrics for dashboard summary
  const revenuePerInteraction = totalInteractions > 0 ? 
    parseFloat((totalRevenue / totalInteractions).toFixed(4)) : 0;
  
  const tokensPerInteraction = totalInteractions > 0 ?
    Math.round(totalTokens / totalInteractions) : 0;
    
  const costPerToken = totalTokens > 0 ?
    parseFloat((totalRevenue / totalTokens).toFixed(6)) : 0;
  
  // Projected revenue
  const projectedMonthlyRevenue = parseFloat((totalRevenue * (30 / 7)).toFixed(2)); // Assuming weekly data
  const projectedYearlyRevenue = parseFloat((projectedMonthlyRevenue * 12).toFixed(2));

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    } else {
      return num.toString();
    }
  };

  const formatRevenue = (revenue) => {
    return `$${revenue.toFixed(2)}`;
  };

  const formatTokens = (tokens) => {
    if (tokens >= 1000000) {
      return (tokens / 1000000).toFixed(1) + 'M';
    } else if (tokens >= 1000) {
      return (tokens / 1000).toFixed(1) + 'K';
    } else {
      return tokens.toString();
    }
  };

  const summaryItems = [
    {
      id: 'models',
      label: 'Total Models',
      value: totalModels,
      formattedValue: totalModels.toString(),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
          <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
        </svg>
      ),
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-800',
    },
    {
      id: 'interactions',
      label: 'Total Interactions',
      value: totalInteractions,
      formattedValue: formatNumber(totalInteractions),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-600" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
          <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
        </svg>
      ),
      bgColor: 'bg-green-50',
      textColor: 'text-green-800',
    },
    {
      id: 'revenue',
      label: 'Total Revenue',
      value: totalRevenue,
      formattedValue: formatRevenue(totalRevenue),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
        </svg>
      ),
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-800',
    },
    {
      id: 'tokens',
      label: 'Total Tokens',
      value: totalTokens,
      formattedValue: formatTokens(totalTokens),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
        </svg>
      ),
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-800',
    },
  ];
  
  const calculatedMetrics = [
    {
      id: 'revenuePerInteraction',
      label: 'Revenue/Interaction',
      formattedValue: `$${revenuePerInteraction.toFixed(4)}`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
      ),
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-800',
    },
    {
      id: 'tokensPerInteraction',
      label: 'Tokens/Interaction',
      formattedValue: formatNumber(tokensPerInteraction),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-600" viewBox="0 0 20 20" fill="currentColor">
          <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
          <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
          <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
        </svg>
      ),
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-800',
    },
    {
      id: 'projectedMonthly',
      label: 'Projected Monthly',
      formattedValue: formatRevenue(projectedMonthlyRevenue),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-600" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
        </svg>
      ),
      bgColor: 'bg-cyan-50',
      textColor: 'text-cyan-800',
    },
    {
      id: 'projectedYearly',
      label: 'Projected Yearly',
      formattedValue: formatRevenue(projectedYearlyRevenue),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
        </svg>
      ),
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-800',
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Dashboard Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {summaryItems.map((item) => (
          <div key={item.id} className={`${item.bgColor} p-6 rounded-lg shadow`}>
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{item.label}</p>
                <p className={`text-2xl font-bold ${item.textColor}`}>{item.formattedValue}</p>
              </div>
              <div className={`${item.bgColor} rounded-full p-3`}>
                {item.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Calculated Metrics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {calculatedMetrics.map((item) => (
          <div key={item.id} className={`${item.bgColor} p-6 rounded-lg shadow`}>
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{item.label}</p>
                <p className={`text-2xl font-bold ${item.textColor}`}>{item.formattedValue}</p>
              </div>
              <div className={`${item.bgColor} rounded-full p-3`}>
                {item.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardSummary; 