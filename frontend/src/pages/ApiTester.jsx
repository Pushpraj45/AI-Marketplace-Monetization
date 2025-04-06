import React, { useState } from 'react';
import axios from 'axios';

const ApiTester = () => {
  const [endpoint, setEndpoint] = useState('api/test/models/published');
  const [method, setMethod] = useState('GET');
  const [headers, setHeaders] = useState('{\n  "Content-Type": "application/json"\n}');
  const [body, setBody] = useState('{}');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Add token from localStorage
  const addAuthToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const headerObj = JSON.parse(headers);
        headerObj['x-auth-token'] = token;
        headerObj['Authorization'] = `Bearer ${token}`;
        setHeaders(JSON.stringify(headerObj, null, 2));
      } catch (e) {
        setError(`Error parsing headers: ${e.message}`);
      }
    } else {
      setError('No token found in localStorage');
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);
    
    try {
      const baseUrl = process.env.REACT_APP_API_URL || 'https://ai-marketplace-monetization.onrender.com/';
      
      // Clean up any potential double slashes in the URL
      let cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
      if (!cleanEndpoint.startsWith('api/') && !baseUrl.endsWith('/api/')) {
        cleanEndpoint = `api/${cleanEndpoint}`;
      }
      
      const url = `${baseUrl}/${cleanEndpoint}`;
      
      const headerObj = JSON.parse(headers);
      const bodyObj = method !== 'GET' ? JSON.parse(body) : undefined;
      
      console.log(`Making ${method} request to ${url}`);
      console.log('Headers:', headerObj);
      if (bodyObj) console.log('Body:', bodyObj);
      
      const requestConfig = {
        method,
        url,
        headers: headerObj,
        data: bodyObj
      };
      
      const result = await axios(requestConfig);
      
      setResponse({
        status: result.status,
        statusText: result.statusText,
        headers: result.headers,
        data: result.data
      });
      
    } catch (err) {
      console.error('API request failed:', err);
      setError({
        message: err.message,
        response: err.response ? {
          status: err.response.status,
          statusText: err.response.statusText,
          data: err.response.data
        } : 'No response'
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">API Tester</h1>
      
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">API Endpoint</label>
          <input
            type="text"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="/api/users/models/published"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Method</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
        </div>
        
        <div>
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium mb-1">Headers (JSON)</label>
            <button
              type="button"
              onClick={addAuthToken}
              className="text-xs text-primary-600 hover:text-primary-800"
            >
              Add Auth Token
            </button>
          </div>
          <textarea
            value={headers}
            onChange={(e) => setHeaders(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
            rows={5}
          />
        </div>
        
        {method !== 'GET' && (
          <div>
            <label className="block text-sm font-medium mb-1">Request Body (JSON)</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
              rows={5}
            />
          </div>
        )}
        
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send Request'}
        </button>
      </form>
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
          <h3 className="font-bold">Error</h3>
          <p>{error.message}</p>
          {error.response && (
            <div className="mt-2">
              <p>Status: {error.response.status} {error.response.statusText}</p>
              <pre className="mt-2 p-2 bg-red-50 overflow-auto max-h-60 text-sm">
                {JSON.stringify(error.response.data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
      
      {response && (
        <div className="p-4 bg-green-100 text-green-700 rounded-md">
          <h3 className="font-bold">Response</h3>
          <p>Status: {response.status} {response.statusText}</p>
          <div className="mt-4">
            <h4 className="font-medium">Data:</h4>
            <pre className="mt-2 p-2 bg-green-50 overflow-auto max-h-96 text-sm">
              {JSON.stringify(response.data, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiTester; 