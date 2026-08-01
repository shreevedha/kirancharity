require('dotenv').config();
const dns = require('dns');
if (dns && typeof dns.setServers === 'function') {
    try {
        dns.setServers(['8.8.8.8', '8.8.4.4']);
    } catch (err) {
        console.warn('⚠️ Failed to set external DNS resolvers:', err.message);
    }
}
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Database Connection Helper for Serverless and Traditional Server environments
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/kiran-charitable-trust';

let isConnecting = false;
const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    if (isConnecting) return;
    try {
        isConnecting = true;
        await mongoose.connect(MONGO_URI);
        console.log('✅ MongoDB connected successfully');
    } catch (err) {
        console.error('❌ MongoDB connection error:', err.message);
    } finally {
        isConnecting = false;
    }
};

// Auto-connect DB middleware for serverless requests
app.use(async (req, res, next) => {
    if (mongoose.connection.readyState < 1) {
        await connectDB();
    }
    next();
});

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL 
        ? [process.env.CLIENT_URL, 'http://localhost:5173', 'http://localhost:3000'] 
        : true,
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/contact', require('./routes/contact'));
app.use('/api/volunteers', require('./routes/volunteers'));
app.use('/api/donations', require('./routes/donations'));

// Root & Health check
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Kiran Charitable Trust API is running', timestamp: new Date() });
});

app.get('/api', (req, res) => {
    res.json({ success: true, message: 'Welcome to Kiran Charitable Trust API' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Internal server error' });
});

// Connect to MongoDB and start server for direct local runs
if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    connectDB().finally(() => {
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    });
}

module.exports = app;
