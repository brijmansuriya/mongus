import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../database.js'; // Database connection function
import generateFakeUsers from './UserFaker.js';


dotenv.config();

const count = 10; // Define a default count (you can adjust or pass via arguments)

const seedDatabase = async () => {
  try {
    // Connect to the database
    await connectDB();

    // Run all seeders
    await generateFakeUsers(count);

    console.log('All seeders have been run successfully!');
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1); // Exit with an error code
  } finally {
    // Disconnect from the database after seeding
    await mongoose.disconnect();
    console.log('Database disconnected after seeding');
  }
};

// Execute the seeding function
seedDatabase();
