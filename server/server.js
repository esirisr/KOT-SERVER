import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import logger from './middleware/logger.js';
import authRoutes from './routes/authRoutes.js';
import statusRoutes from './routes/statusRoutes.js';

// Initialize Express
const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(express.json());
app.use(cors());
app.use(logger);

// Health Check
app.get('/', (req, res) => {
    res.send({
        status: 'AutoSender API is live',
        environment: process.env.NODE_ENV || 'development'
    });
});

// Routes
app.use('/', authRoutes);
app.use('/status', statusRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Something went wrong on the server!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
