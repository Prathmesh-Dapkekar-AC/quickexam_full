import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { connectDB } from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';
import examRoutes from './src/routes/examRoutes.js';
import attemptRoutes from './src/routes/attemptRoutes.js';
import { initSweeperJob } from './src/jobs/sweeper.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: 'Too many requests from this IP, please try again later.' }
});
app.use('/api/', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/attempts', attemptRoutes);

app.get('/health', (req, res) => res.json({ status: 'UP', timestamp: new Date() }));

// Centralized Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.statusCode || 500;
  res.status(status).json({
    error: err.message || 'Internal Server Error'
  });
});

initSweeperJob();

app.listen(PORT, () => {
  console.log(`QuickExam server running on port ${PORT}`);
});
