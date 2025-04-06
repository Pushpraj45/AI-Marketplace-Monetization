import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const RevenueChart = ({ data }) => {
  // Handle missing or invalid data
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-gray-50 border border-gray-200 rounded-md">
        <p className="text-gray-500">No revenue data available</p>
      </div>
    );
  }

  // Format data for the chart and handle potential null/undefined values
  const chartData = data.map(item => ({
    date: item._id || '',
    revenue: typeof item.revenue === 'number' ? item.revenue : 0
  }));

  // Format currency in the tooltip
  const formatCurrency = (value) => {
    if (value === undefined || value === null) return '$0.00';
    return `$${value.toFixed(2)}`;
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-md rounded-md">
          <p className="font-semibold text-gray-700">{label || 'Unknown'}</p>
          <p className="text-green-600">
            Revenue: {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickMargin={10}
          />
          <YAxis 
            tickFormatter={formatCurrency}
            tick={{ fontSize: 12 }}
            width={60}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#10B981"
            strokeWidth={2}
            activeDot={{ r: 6 }}
            dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart; 