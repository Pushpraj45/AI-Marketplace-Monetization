import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const TokenUsageChart = ({ data }) => {
  // Handle missing or invalid data
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-gray-50 border border-gray-200 rounded-md">
        <p className="text-gray-500">No token usage data available</p>
      </div>
    );
  }

  // Format data for the chart and handle potential null/undefined values
  const chartData = data.map(item => {
    const inputTokens = typeof item.inputTokens === 'number' ? item.inputTokens : 
                         (item.tokens && typeof item.tokens.input === 'number' ? item.tokens.input : 0);
    
    const outputTokens = typeof item.outputTokens === 'number' ? item.outputTokens : 
                         (item.tokens && typeof item.tokens.output === 'number' ? item.tokens.output : 0);
    
    const totalTokens = typeof item.totalTokens === 'number' ? item.totalTokens : 
                         (item.tokens && typeof item.tokens.total === 'number' ? item.tokens.total : inputTokens + outputTokens);
    
    return {
      date: item._id || '',
      input: inputTokens,
      output: outputTokens,
      total: totalTokens
    };
  });

  // Format numbers in the tooltip
  const formatNumber = (value) => {
    if (value === undefined || value === null) return '0';
    
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M';
    } else if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'K';
    } else {
      return value.toString();
    }
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-md rounded-md">
          <p className="font-semibold text-gray-700">{label || 'Unknown'}</p>
          <div className="space-y-1">
            <p className="text-blue-600 text-sm">
              Input Tokens: {formatNumber(payload[0]?.value || 0)}
            </p>
            <p className="text-purple-600 text-sm">
              Output Tokens: {formatNumber(payload[1]?.value || 0)}
            </p>
            <p className="text-indigo-600 font-semibold">
              Total Tokens: {formatNumber(payload[2]?.value || 0)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
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
            tickFormatter={formatNumber}
            tick={{ fontSize: 12 }}
            width={50}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="top" 
            height={36}
            iconType="circle"
            fontSize={12}
          />
          <Area 
            type="monotone" 
            dataKey="input" 
            name="Input Tokens"
            stackId="1"
            stroke="#3B82F6" 
            fill="#93C5FD" 
          />
          <Area 
            type="monotone" 
            dataKey="output" 
            name="Output Tokens"
            stackId="1"
            stroke="#8B5CF6" 
            fill="#C4B5FD" 
          />
          <Area 
            type="monotone" 
            dataKey="total" 
            name="Total Tokens"
            stroke="#4F46E5" 
            fill="none"
            activeDot={{ r: 8 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TokenUsageChart; 