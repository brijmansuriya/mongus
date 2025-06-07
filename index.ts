import express from 'express';
import { connectDB } from './database/Database.js';
import { env } from './config/env.js';

const app = express();

// Connect to MongoDB
connectDB();

app.get('/', (req, res) => {
  res.send('🚀 Hello from Express + TypeScript (ESM)!');
});

app.listen(env.port, () => {
  console.log(`✅ Server is running at http://localhost:${env.port}`);
});
