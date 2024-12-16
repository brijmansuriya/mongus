// Importing modules using ES6 syntax
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './Database.js';


// Initialize the express app
const app = express();
// Load environment variables from .env file
dotenv.config();
// Connect to MongoDB
connectDB();

// Middleware to parse JSON request body
app.use(express.json());
// Use the user routes
export default app;