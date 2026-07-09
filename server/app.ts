import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import userRouter from './route/user.route.js';
import projectRouter from './route/project.route.js';
import profileRouter from './route/profile.route.js';

// Load environment variables
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Serve static uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

// Routes
app.use('/api/auth', userRouter);
app.use('/api/projects', projectRouter);
app.use('/api/profile', profileRouter);

// Basic root route
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Rohan Portfolio API is running smoothly',
    timestamp: new Date().toISOString()
  });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'UP',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

export default app;
