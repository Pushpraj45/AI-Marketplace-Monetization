import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getMarketplaceModelById, generateCompletion, testAzureConnection, testDeployments, directTest, getSimpleCompletion, pythonStyleTest } from '../services/modelService';
import { motion } from 'framer-motion';

const ModelDetail = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [testingAzure, setTestingAzure] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [testingDeployments, setTestingDeployments] = useState(false);
  const [deploymentResult, setDeploymentResult] = useState(null);
  const [testingDirect, setTestingDirect] = useState(false);
  const [directResult, setDirectResult] = useState(null);
  const [testingSimple, setTestingSimple] = useState(false);
  const [simpleResult, setSimpleResult] = useState(null);
  const [testingPython, setTestingPython] = useState(false);
  const [pythonResult, setPythonResult] = useState(null);
  const messagesEndRef = useRef(null);

  // Load model details
  useEffect(() => {
    const fetchModel = async () => {
      setLoading(true);
      try {
        const response = await getMarketplaceModelById(id);
        setModel(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching model details:", error);
        setError("Failed to load model details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchModel();
  }, [id]);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isGenerating) return;
    
    // Add user message to chat
    const userMessage = { role: 'user', content: inputValue };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue('');
    
    // Start generating response
    setIsGenerating(true);
    
    try {
      const response = await generateCompletion(model._id, updatedMessages);
      
      // Add AI response to chat
      setMessages([...updatedMessages, response.data.message]);
    } catch (error) {
      console.error("Error generating response:", error);
      setMessages([
        ...updatedMessages, 
        { 
          role: 'assistant', 
          content: "I'm sorry, I encountered an error while processing your request. Please try again." 
        }
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  // Reset the conversation
  const handleResetConversation = () => {
    setMessages([]);
  };

  // Test Azure OpenAI connection
  const handleTestAzure = async () => {
    setTestingAzure(true);
    setTestResult(null);
    try {
      const response = await testAzureConnection();
      console.log('Azure test successful:', response);
      setTestResult({
        success: true,
        message: 'Azure OpenAI connection successful!',
        details: response.data
      });
    } catch (error) {
      console.error('Azure test failed:', error);
      setTestResult({
        success: false,
        message: 'Azure OpenAI connection failed',
        details: error
      });
    } finally {
      setTestingAzure(false);
    }
  };

  // Test Azure OpenAI deployments
  const handleTestDeployments = async () => {
    setTestingDeployments(true);
    setDeploymentResult(null);
    try {
      const response = await testDeployments();
      console.log('Deployments test successful:', response);
      setDeploymentResult({
        success: true,
        message: response.message || 'Deployments test successful!',
        details: response
      });
    } catch (error) {
      console.error('Deployments test failed:', error);
      setDeploymentResult({
        success: false,
        message: 'Deployments test failed',
        details: error
      });
    } finally {
      setTestingDeployments(false);
    }
  };

  // Test with hardcoded credentials
  const handleDirectTest = async () => {
    setTestingDirect(true);
    setDirectResult(null);
    try {
      const response = await directTest();
      console.log('Direct test successful:', response);
      setDirectResult({
        success: true,
        message: response.message || 'Direct test successful!',
        details: response
      });
    } catch (error) {
      console.error('Direct test failed:', error);
      setDirectResult({
        success: false,
        message: 'Direct test failed',
        details: error
      });
    } finally {
      setTestingDirect(false);
    }
  };

  // Test simple completion
  const handleSimpleTest = async () => {
    setTestingSimple(true);
    setSimpleResult(null);
    try {
      const response = await getSimpleCompletion("Give me a short greeting in one sentence.");
      console.log('Simple completion test successful:', response);
      setSimpleResult({
        success: true,
        message: 'Simple completion successful!',
        result: response.data.result
      });
    } catch (error) {
      console.error('Simple completion test failed:', error);
      setSimpleResult({
        success: false,
        message: 'Simple completion failed',
        error: error
      });
    } finally {
      setTestingSimple(false);
    }
  };

  // Test Python-style method
  const handlePythonTest = async () => {
    setTestingPython(true);
    setPythonResult(null);
    try {
      const response = await pythonStyleTest();
      console.log('Python-style test successful:', response);
      setPythonResult({
        success: true,
        message: response.message || 'Python-style test successful!',
        details: response
      });
    } catch (error) {
      console.error('Python-style test failed:', error);
      setPythonResult({
        success: false,
        message: 'Python-style test failed',
        details: error
      });
    } finally {
      setTestingPython(false);
    }
  };

  // Chat message animation variants
  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4 flex justify-center">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  if (error || !model) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded relative mb-6">
          {error || "Model not found"}
        </div>
        <Link 
          to="/marketplace" 
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
        >
          &larr; Back to Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Model Information Panel */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 sticky top-24">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{model.name}</h1>
                {model.owner?.profile?.name && (
                  <p className="text-sm text-gray-600 mt-1">
                    By {model.owner.profile.name}
                    {model.owner.profile.organization && ` (${model.owner.profile.organization})`}
                  </p>
                )}
              </div>
            </div>

            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Description</h2>
              <p className="text-gray-600">{model.description}</p>
            </div>

            {model.tags && model.tags.length > 0 && (
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {model.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="bg-primary-50 text-primary-700 px-2 py-1 rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Pricing</h2>
              <p className="text-gray-600">
                {model.perTokenPricing?.enabled 
                  ? `$${model.perTokenPricing.price} per token` 
                  : "Free to use"}
              </p>
            </div>

            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Usage Statistics</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-500">Total Usage</p>
                  <p className="font-semibold">{model.stats?.usageCount?.toLocaleString() || 0}</p>
                </div>
              </div>
            </div>

            <Link 
              to="/marketplace" 
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              &larr; Back to Marketplace
            </Link>
            
            {/* Azure test button (only visible in development) */}
            {process.env.NODE_ENV !== 'production' && (
              <div className="mt-4 border-t pt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Debug Tools</h3>
                <div className="flex flex-wrap gap-2 mb-2">
                  <button
                    onClick={handleTestAzure}
                    disabled={testingAzure}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded hover:bg-blue-200 transition-colors"
                  >
                    {testingAzure ? 'Testing Azure...' : 'Test Connection'}
                  </button>
                  
                  <button
                    onClick={handleTestDeployments}
                    disabled={testingDeployments}
                    className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded hover:bg-green-200 transition-colors"
                  >
                    {testingDeployments ? 'Testing Deployments...' : 'Test Deployments'}
                  </button>
                  
                  <button
                    onClick={handleDirectTest}
                    disabled={testingDirect}
                    className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded hover:bg-purple-200 transition-colors"
                  >
                    {testingDirect ? 'Testing...' : 'Direct Test'}
                  </button>
                  
                  <button
                    onClick={handleSimpleTest}
                    disabled={testingSimple}
                    className="px-3 py-1 bg-orange-100 text-orange-800 text-xs rounded hover:bg-orange-200 transition-colors"
                  >
                    {testingSimple ? 'Testing...' : 'Simple Completion'}
                  </button>
                  
                  <button
                    onClick={handlePythonTest}
                    disabled={testingPython}
                    className="px-3 py-1 bg-pink-100 text-pink-800 text-xs rounded hover:bg-pink-200 transition-colors"
                  >
                    {testingPython ? 'Testing...' : 'Python-Style Test'}
                  </button>
                </div>
                
                {testResult && (
                  <div className={`mt-2 p-2 text-xs rounded ${testResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    <p className="font-medium">{testResult.message}</p>
                    {!testResult.success && testResult.details && (
                      <p className="mt-1 text-xs overflow-auto max-h-32">
                        Error: {testResult.details.message || JSON.stringify(testResult.details)}
                      </p>
                    )}
                  </div>
                )}
                
                {deploymentResult && (
                  <div className={`mt-2 p-2 text-xs rounded ${deploymentResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    <p className="font-medium">{deploymentResult.message}</p>
                    {deploymentResult.success && deploymentResult.details?.workingDeployment && (
                      <p className="mt-1 text-xs">
                        Working deployment: <span className="font-mono bg-green-100 px-1">{deploymentResult.details.workingDeployment}</span>
                        {deploymentResult.details.recommendation && (
                          <div className="mt-1 text-green-700">{deploymentResult.details.recommendation}</div>
                        )}
                      </p>
                    )}
                    {!deploymentResult.success && deploymentResult.details && (
                      <p className="mt-1 text-xs overflow-auto max-h-32">
                        Error: {deploymentResult.details.message || JSON.stringify(deploymentResult.details)}
                      </p>
                    )}
                  </div>
                )}
                
                {directResult && (
                  <div className={`mt-2 p-2 text-xs rounded ${directResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    <p className="font-medium">{directResult.message}</p>
                    {directResult.success && directResult.details?.workingDeployment && (
                      <p className="mt-1 text-xs">
                        Working deployment: <span className="font-mono bg-green-100 px-1">{directResult.details.workingDeployment}</span>
                        <div className="mt-1 text-green-700">
                          Use this deployment name in your .env file
                        </div>
                      </p>
                    )}
                    {directResult.success && directResult.details?.response?.content && (
                      <p className="mt-1 text-xs bg-gray-100 p-1 rounded">
                        Response: "{directResult.details.response.content}"
                      </p>
                    )}
                    {!directResult.success && directResult.details && (
                      <p className="mt-1 text-xs overflow-auto max-h-32">
                        Error: {directResult.details.message || directResult.details.error || JSON.stringify(directResult.details)}
                      </p>
                    )}
                  </div>
                )}
                
                {simpleResult && (
                  <div className={`mt-2 p-2 text-xs rounded ${simpleResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    <p className="font-medium">{simpleResult.message}</p>
                    {simpleResult.success && simpleResult.result && (
                      <p className="mt-1 text-xs bg-gray-100 p-1 rounded">
                        Response: "{simpleResult.result}"
                      </p>
                    )}
                    {!simpleResult.success && simpleResult.error && (
                      <p className="mt-1 text-xs overflow-auto max-h-32">
                        Error: {simpleResult.error.message || JSON.stringify(simpleResult.error)}
                      </p>
                    )}
                  </div>
                )}
                
                {pythonResult && (
                  <div className={`mt-2 p-2 text-xs rounded ${pythonResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    <p className="font-medium">{pythonResult.message}</p>
                    {pythonResult.success && pythonResult.details?.response?.content && (
                      <p className="mt-1 text-xs bg-gray-100 p-1 rounded">
                        Response: "{pythonResult.details.response.content}"
                      </p>
                    )}
                    {!pythonResult.success && pythonResult.details && (
                      <p className="mt-1 text-xs overflow-auto max-h-32">
                        Error: {pythonResult.details.message || pythonResult.details.error || JSON.stringify(pythonResult.details)}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Chat Interface */}
        <div className="lg:w-2/3 flex flex-col">
          <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-[70vh]">
            <div className="bg-primary-600 text-white px-6 py-4">
              <h2 className="text-xl font-semibold">Chat with {model.name}</h2>
            </div>

            {/* Chat messages area */}
            <div className="flex-grow overflow-y-auto p-4 bg-gray-50">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-500">
                    <p className="mb-2">Send a message to start the conversation</p>
                    <p className="text-sm">This model responds to your questions in real-time</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      variants={messageVariants}
                      initial="hidden"
                      animate="visible"
                      className={`max-w-3/4 ${
                        message.role === 'user'
                          ? 'ml-auto bg-primary-500 text-white'
                          : 'bg-white border border-gray-200'
                      } rounded-lg p-4 shadow-sm`}
                    >
                      <p className="text-sm">
                        {message.content}
                      </p>
                      <div className="mt-1 text-xs text-right opacity-70">
                        {message.role === 'user' ? 'You' : model.name}
                      </div>
                    </motion.div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input area */}
            <div className="border-t border-gray-200 p-4 bg-white">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-grow border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  disabled={!currentUser || isGenerating}
                />
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-md ${
                    isGenerating || !inputValue.trim()
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-primary-600 hover:bg-primary-700 text-white'
                  }`}
                  disabled={isGenerating || !inputValue.trim() || !currentUser}
                >
                  {isGenerating ? 'Thinking...' : 'Send'}
                </button>
                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={handleResetConversation}
                    className="px-3 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100"
                    title="Reset conversation"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                )}
              </form>
              {!currentUser && (
                <p className="mt-2 text-sm text-red-500">
                  Please <Link to="/login" className="underline">log in</Link> to chat with this model.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelDetail; 