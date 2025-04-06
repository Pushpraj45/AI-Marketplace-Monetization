import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getDeveloperDashboardSummary 
} from '../services/analyticsService';
import DashboardSummary from '../components/analytics/DashboardSummary';
import ModelPerformanceList from '../components/analytics/ModelPerformanceList';
import TimeframeSelector from '../components/analytics/TimeframeSelector';
import { useAuth } from '../contexts/AuthContext';

const DeveloperDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [timeframe, setTimeframe] = useState('week');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getDeveloperDashboardSummary(timeframe);
        
        if (response.success) {
          console.log("Dashboard data received:", response.data);
          setDashboardData(response.data);
        } else if (response.data && response.data.modelsPerformance) {
          // Handle the case when the analytics service returns fake data
          console.log("Using fake dashboard data:", response);
          setDashboardData(response);
        } else {
          setError(response.error || 'Failed to fetch dashboard data');
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message || 'An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [timeframe]);

  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
  };

  const handleModelClick = (modelId) => {
    navigate(`/model-analytics/${modelId}`);
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

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Developer Dashboard</h1>
        <TimeframeSelector 
          selectedTimeframe={timeframe} 
          onTimeframeChange={handleTimeframeChange} 
        />
      </div>

      {dashboardData ? (
        <>
          <DashboardSummary summaryData={dashboardData} />
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Models Performance</h2>
            <ModelPerformanceList 
              models={dashboardData.modelsPerformance || dashboardData.models || []} 
              onModelClick={handleModelClick}
            />
          </div>
        </>
      ) : (
        <div className="p-4 border border-gray-300 rounded-lg text-gray-600">
          No dashboard data available. Try refreshing the page.
        </div>
      )}
    </div>
  );
};

export default DeveloperDashboard; 