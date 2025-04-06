import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getModelDetailedAnalytics } from '../services/analyticsService';
import TimeframeSelector from '../components/analytics/TimeframeSelector';
import IntervalSelector from '../components/analytics/IntervalSelector';
import ModelSummaryCard from '../components/analytics/ModelSummaryCard';
import ModelMetricsCard from '../components/analytics/ModelMetricsCard';
import RevenueChart from '../components/analytics/RevenueChart';
import UsageChart from '../components/analytics/UsageChart';
import TokenUsageChart from '../components/analytics/TokenUsageChart';
import GeoDistributionChart from '../components/analytics/GeoDistributionChart';

const ModelAnalytics = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [timeframe, setTimeframe] = useState('week');
  const [interval, setInterval] = useState('day');

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getModelDetailedAnalytics(id, timeframe, interval);
        
        if (response.success) {
          console.log("Analytics data received:", response.data);
          setAnalyticsData(response.data);
        } else {
          setError(response.error || 'Failed to fetch analytics data');
        }
      } catch (err) {
        setError(err.message || 'An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [id, timeframe, interval]);

  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
    
    // Adjust interval based on timeframe
    if (newTimeframe === 'day') {
      setInterval('hour');
    } else if (newTimeframe === 'year' && interval === 'day') {
      setInterval('month');
    } else if (newTimeframe !== 'year' && interval === 'month') {
      setInterval('day');
    }
  };

  const handleIntervalChange = (newInterval) => {
    setInterval(newInterval);
  };

  const handleBackClick = () => {
    navigate('/developer-dashboard');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
            <button 
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return null;
  }

  const { model, summary, timeSeriesData, geoDistribution } = analyticsData;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center mb-6">
        <button 
          onClick={handleBackClick}
          className="mr-4 text-blue-600 hover:text-blue-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {model.name} Analytics
        </h1>
      </div>

      <div className="flex justify-end space-x-4 mb-6">
        <TimeframeSelector 
          selectedTimeframe={timeframe} 
          onTimeframeChange={handleTimeframeChange} 
        />
        {timeframe !== 'day' && (
          <IntervalSelector 
            selectedInterval={interval} 
            onIntervalChange={handleIntervalChange}
            timeframe={timeframe}
          />
        )}
      </div>

      <ModelSummaryCard model={model} summary={summary} />
      
      {summary.metrics && (
        <div className="mt-6">
          <ModelMetricsCard metrics={summary.metrics} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue</h3>
          <RevenueChart data={timeSeriesData} />
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Interactions</h3>
          <UsageChart data={timeSeriesData} />
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Token Usage</h3>
          <TokenUsageChart data={timeSeriesData} />
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Geographic Distribution</h3>
          <GeoDistributionChart data={geoDistribution} />
        </div>
      </div>
    </div>
  );
};

export default ModelAnalytics; 