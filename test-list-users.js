const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// MongoDB URI from environment variables
const MONGO_URI = process.env.MONGO_URI;

// Define User schema
const UserSchema = new mongoose.Schema({
  email: String,
  role: String,
  isVerified: Boolean,
  profile: {
    name: String,
    organization: String,
  },
  createdAt: Date,
});

// Create User model (only for reading, no password middleware needed)
const User = mongoose.model('User', UserSchema);

// Function to list all users
async function listAllUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected successfully!');

    // Get all users
    const users = await User.find().select('-password'); // Exclude passwords
    
    console.log(`Found ${users.length} users in the database:`);
    
    // Display users
    users.forEach((user, index) => {
      console.log(`\nUser ${index + 1}:`);
      console.log(`- ID: ${user._id}`);
      console.log(`- Email: ${user.email}`);
      console.log(`- Role: ${user.role}`);
      console.log(`- Verified: ${user.isVerified}`);
      if (user.profile && user.profile.name) {
        console.log(`- Name: ${user.profile.name}`);
      }
      if (user.profile && user.profile.organization) {
        console.log(`- Organization: ${user.profile.organization}`);
      }
      console.log(`- Created: ${user.createdAt}`);
    });
    
    // Close the connection
    await mongoose.connection.close();
    console.log('\nConnection closed');
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

// Run the function
listAllUsers(); 