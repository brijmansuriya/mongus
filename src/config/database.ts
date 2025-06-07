import mongoose from 'mongoose';
import { config } from './env';
import { Logger } from '@utils/logger';

const logger = Logger.getInstance(config);

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.MONGODB_URI);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export default {
  connectDB
};
