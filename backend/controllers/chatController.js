const { chatWithBot } = require('../advanced-chat-service');

/**
 * @desc    Chat with Azure OpenAI model
 * @route   POST /api/chat
 * @access  Private
 */
const chatWithModel = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    const response = await chatWithBot(message);
    
    res.status(200).json({
      success: true,
      data: { response }
    });
  } catch (error) {
    console.error('Error in chat controller:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'An error occurred while processing your request'
    });
  }
};

/**
 * @desc    Get chat history for a user
 * @route   GET /api/chat/history
 * @access  Private
 */
const getChatHistory = async (req, res) => {
  try {
    // Placeholder for actual implementation
    // In a real implementation, this would fetch chat history from a database
    res.status(200).json({
      success: true,
      data: {
        history: []
      }
    });
  } catch (error) {
    console.error('Error getting chat history:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'An error occurred while retrieving chat history'
    });
  }
};

module.exports = {
  chatWithModel,
  getChatHistory
}; 