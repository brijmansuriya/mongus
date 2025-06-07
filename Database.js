import mongoose from 'mongoose';
import config from './config/env.js';
import logger from './utils/logger.js';

// Connect to MongoDB using Mongoose
const connectDB = async () => {
  try {
    // Use config for MongoDB URI and options
    await mongoose.connect(config.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });
    console.log('✅ MongoDB connected successfully');
    
    // Initialize capped collection for logs if needed
    if (config.LOG_TO_DB) {
      try {
        await mongoose.connection.db.createCollection('logs', {
          capped: true,
          size: 5242880, // 5MB
          max: 5000
        });
      } catch (error) {
        // Collection might already exist, which is fine
        if (!error.code === 48) { // 48 is the error code for "collection already exists"
          console.warn('Logs collection initialization warning:', error.message);
        }
      }
    }
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

export default connectDB;
