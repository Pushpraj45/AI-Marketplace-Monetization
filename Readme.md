# MonetizeAI: AI Model Marketplace and Monetization Platform

MonetizeAI is a comprehensive platform that allows AI model developers to deploy, share, and monetize their AI models. Users can discover, purchase, and use AI models in a seamless marketplace experience.

## 🌐 Live Demo & Links

- **Live Demo:** [https://frontend-monetize-ai.vercel.app/](https://frontend-monetize-ai.vercel.app/)
- **GitHub Repository:** [https://github.com/Pushpraj45/AI-Marketplace-Monetization](https://github.com/Pushpraj45/AI-Marketplace-Monetization)

## ✨ Features

- **For Developers:**
  - Deploy AI models with Azure OpenAI integration
  - Set custom pricing models (per-token or subscription based)
  - Track usage and earnings
  - Manage model versions and updates

- **For Users:**
  - Discover AI models in the marketplace
  - Test models before purchasing
  - Secure payment processing
  - Usage tracking and history

- **Platform Features:**
  - User authentication with email verification
  - Role-based access control (users, developers, admins)
  - Secure API endpoints for model interaction
  - Real-time chat interfaces for model testing

## 🏗️ Project Structure

```
MonetizeAI/
├── backend/         # Express.js backend API
│   ├── config/      # Configuration files
│   ├── controllers/ # Route controllers
│   ├── middleware/  # Custom middleware
│   ├── models/      # Mongoose models
│   └── routes/      # API routes
├── frontend/        # React/Vite frontend
│   ├── public/      # Static files
│   └── src/         # React components and logic
└── .env             # Environment variables
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB database
- Azure OpenAI account (for model deployment)

### Backend Setup

1. Clone the repository:
   ```
   git clone https://github.com/Pushpraj45/AI-Marketplace-Monetization.git
   cd AI-Marketplace-Monetization
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env` in the backend directory
   - Update the values with your actual credentials:
     ```
     JWT_SECRET=your-super-secret-jwt-key
     PORT=5000
     MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
     NODE_ENV=development
     AZURE_OPENAI_ENDPOINT=https://your-azure-openai-resource.openai.azure.com/
     AZURE_OPENAI_API_KEY=your-azure-openai-api-key
     AZURE_DEPLOYMENT_NAME=your-azure-deployment-name
     ```

4. Start the backend server:
   ```
   npm run server
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the frontend development server:
   ```
   npm run dev
   ```

### Running the Full Stack Application

To run both frontend and backend concurrently:
```
npm run dev
```

- Backend will run on http://localhost:5000
- Frontend will run on http://localhost:5173

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify-email/:token` - Verify email address
- `POST /api/auth/forgot-password` - Send password reset email
- `POST /api/auth/reset-password/:token` - Reset password

### User Endpoints
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/models/published` - Get user's published models

### Developer Endpoints
- `POST /api/models` - Create a new model
- `GET /api/models` - Get all developer's models
- `GET /api/models/:id` - Get a specific model
- `PUT /api/models/:id` - Update a model
- `DELETE /api/models/:id` - Delete a model

### Chat/AI Endpoints
- `POST /api/chat/:modelId` - Interact with an AI model

## 🧰 Technologies Used

### Backend
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens (JWT) for authentication
- Azure OpenAI SDK

### Frontend
- React
- Vite
- React Router
- Tailwind CSS
- Framer Motion for animations

## 👥 Contributors

- [Pushpraj Dubey](https://github.com/Pushpraj45)
- [Ashish Patel]([https://github.com/ashis2004])
- [Tanjul Sarathe](https://github.com/tanjul17)
- [Devendra Sahu](https://github.com/DevendraKumarSahu09)

## 📄 License

This project is licensed under the MIT License.
