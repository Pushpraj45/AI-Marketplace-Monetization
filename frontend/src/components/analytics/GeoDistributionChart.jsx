import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const GeoDistributionChart = ({ data }) => {
  // Handle missing or invalid data
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-gray-50 border border-gray-200 rounded-md">
        <p className="text-gray-500">No geographic distribution data available</p>
      </div>
    );
  }

  // Colors for the pie chart
  const COLORS = [
    '#3B82F6', '#10B981', '#F59E0B', '#6366F1', 
    '#EC4899', '#8B5CF6', '#EF4444', '#14B8A6', 
    '#F97316', '#8B5CF6'
  ];

  // Format data for the chart and handle potential null/undefined values
  const chartData = data
    .filter(item => item && item._id && typeof item.count === 'number')
    .map((item, index) => ({
      name: item._id,
      value: item.count,
      color: COLORS[index % COLORS.length]
    }));

  // If no valid data after filtering, show placeholder
  if (chartData.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-gray-50 border border-gray-200 rounded-md">
        <p className="text-gray-500">No valid geographic distribution data available</p>
      </div>
    );
  }

  // Get total value for percentage calculation
  const getTotalValue = () => {
    return chartData.reduce((sum, item) => sum + item.value, 0);
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const total = getTotalValue();
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-md rounded-md">
          <p className="font-semibold text-gray-700">{data.name}</p>
          <p className="text-gray-600">
            Users: {data.value}
          </p>
          <p className="text-gray-600">
            {total > 0 ? ((data.value / total) * 100).toFixed(1) : 0}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  // Render label with country and percentage
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index
  }) => {
    if (percent === undefined || percent === null || index === undefined || index >= chartData.length) {
      return null;
    }

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return percent > 0.05 ? (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {chartData[index].name} ({(percent * 100).toFixed(0)}%)
      </text>
    ) : null;
  };

  // Custom legend that shows percentages
  const CustomLegend = ({ payload }) => {
    if (!payload || !Array.isArray(payload) || payload.length === 0) {
      return null;
    }

    const total = getTotalValue();
    
    return (
      <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs">
        {payload.map((entry, index) => {
          if (!entry || !entry.payload || typeof entry.payload.value !== 'number') {
            return null;
          }
          const percentage = total > 0 ? ((entry.payload.value / total) * 100).toFixed(1) : '0.0';
          return (
            <li key={`item-${index}`} className="flex items-center">
              <span 
                className="inline-block w-3 h-3 mr-1 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600">
                {entry.value} ({percentage}%)
              </span>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            content={<CustomLegend />}
            verticalAlign="bottom" 
            height={36}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GeoDistributionChart; 