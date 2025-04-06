const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config();

// MongoDB URI from environment variables
const MONGO_URI = process.env.MONGO_URI;

// Define User schema - Minimal version matching our actual schema
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'developer'],
    default: 'user',
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  profile: {
    name: String,
    organization: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Create User model
const User = mongoose.model('User', UserSchema);

// Test user data
const testUser = {
  email: 'testuser' + Date.now() + '@example.com', // Unique email
  password: 'password123',
  role: 'user',
  isVerified: true,
  profile: {
    name: 'Test User',
    organization: 'Test Org',
  },
};

// Function to register a test user
async function registerTestUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected successfully!');

    // Check if user already exists
    const existingUser = await User.findOne({ email: testUser.email });
    if (existingUser) {
      console.log('User already exists with email:', testUser.email);
      await mongoose.connection.close();
      return;
    }

    // Create new user
    const user = new User(testUser);
    await user.save();

    console.log('Test user registered successfully:', user);
    
    // Close the connection
    await mongoose.connection.close();
    console.log('Connection closed');
  } catch (error) {
    console.error('Error:', error);
    
    // Make sure we close the connection even if there's an error
    try {
      await mongoose.connection.close();
      console.log('Connection closed after error');
    } catch (err) {
      console.error('Error closing connection:', err);
    }
  }
}

// Run the test
registerTestUser(); 