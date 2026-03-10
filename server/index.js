require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const logger = require('./middleware/logger');

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
app.use('/', require('./routes/authRoutes'));
app.use('/status', require('./routes/statusRoutes'));

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Something went wrong on the server!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
