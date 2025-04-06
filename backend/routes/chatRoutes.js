const express = require('express');
const { chatWithModel, getChatHistory, getTokenBalance } = require('../controllers/chatController');
// Middleware for authentication
const auth = require('../middleware/auth');

const router = express.Router();

// Create a separate router for public routes
const publicRouter = express.Router();

// Public chat route for testing (no auth required)
publicRouter.post('/public', chatWithModel);

// Use auth middleware for protected routes
router.use(auth);

// Chat with model route (authenticated)
router.post('/', chatWithModel);

// Get chat history route
router.get('/history', getChatHistory);

// Get token balance
router.get('/tokens', getTokenBalance);

// Combine routers
const chatRoutes = express.Router();
chatRoutes.use('/', publicRouter);
chatRoutes.use('/', router);

module.exports = chatRoutes; 