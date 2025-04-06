import React from 'react';

const IntervalSelector = ({ selectedInterval, onIntervalChange, timeframe }) => {
  // Define intervals based on timeframe
  const getIntervals = () => {
    if (timeframe === 'day') {
      return [{ value: 'hour', label: 'Hour' }];
    } else if (timeframe === 'year') {
      return [
        { value: 'day', label: 'Day' },
        { value: 'week', label: 'Week' },
        { value: 'month', label: 'Month' },
      ];
    } else {
      return [
        { value: 'day', label: 'Day' },
        { value: 'week', label: 'Week' },
      ];
    }
  };

  const intervals = getIntervals();

  if (intervals.length <= 1) {
    return null;
  }

  return (
    <div className="flex items-center">
      <span className="text-sm text-gray-700 mr-2">Interval:</span>
      <div className="inline-flex rounded-md shadow-sm" role="group">
        {intervals.map((interval, index) => (
          <button
            key={interval.value}
            type="button"
            className={`px-4 py-2 text-sm font-medium ${
              selectedInterval === interval.value
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            } ${
              index === 0
                ? 'rounded-l-md'
                : index === intervals.length - 1
                ? 'rounded-r-md'
                : ''
            } border border-gray-300`}
            onClick={() => onIntervalChange(interval.value)}
          >
            {interval.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default IntervalSelector; 