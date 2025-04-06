const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// MongoDB URI from environment variables
const MONGO_URI = process.env.MONGO_URI;

// Log the MongoDB URI (remove this in production)
console.log('MongoDB URI:', MONGO_URI);

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully!');
    mongoose.connection.close();
    console.log('Connection closed');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  }); 