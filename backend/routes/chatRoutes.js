const express = require('express');
const { chatWithModel, getChatHistory } = require('../controllers/chatController');
// Middleware for authentication
const auth = require('../middleware/auth');

const router = express.Router();

// Chat with model route (authenticated)
router.post('/', auth, chatWithModel);

// Public chat route for testing (no auth required)
router.post('/public', chatWithModel);

// Get chat history route
router.get('/history', auth, getChatHistory);

module.exports = router; 