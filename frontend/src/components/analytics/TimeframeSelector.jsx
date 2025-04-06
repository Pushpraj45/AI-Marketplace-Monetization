import React from 'react';

const TimeframeSelector = ({ selectedTimeframe, onTimeframeChange }) => {
  const timeframes = [
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
    { value: 'year', label: 'Year' },
  ];

  return (
    <div className="flex items-center">
      <span className="text-sm text-gray-700 mr-2">Timeframe:</span>
      <div className="inline-flex rounded-md shadow-sm" role="group">
        {timeframes.map((timeframe) => (
          <button
            key={timeframe.value}
            type="button"
            className={`px-4 py-2 text-sm font-medium ${
              selectedTimeframe === timeframe.value
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            } ${
              timeframe.value === 'day'
                ? 'rounded-l-md'
                : timeframe.value === 'year'
                ? 'rounded-r-md'
                : ''
            } border border-gray-300`}
            onClick={() => onTimeframeChange(timeframe.value)}
          >
            {timeframe.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeframeSelector; 