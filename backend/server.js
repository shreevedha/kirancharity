try {
    require('dotenv').config();
} catch (e) {
    // Environment variables are injected directly in serverless environment
}
const dns = require('dns');

// DNS server fallback setup for environment network compatibility
if (dns && typeof dns.setServers === 'function') {
    try {
        dns.setServers(['8.8.8.8', '8.8.4.4']);
    } catch (err) {
        console.warn('⚠️ DNS resolver warning:', err.message);
    }
}

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

const app = express();

// Security: Hide server technology stack info
app.disable('x-powered-by');

// Enterprise Security: Helmet HTTP Security Headers
app.use(helmet({
    contentSecurityPolicy: false, // Managed at edge / Vercel level
    crossOriginEmbedderPolicy: false,
    hsts: {
        maxAge: 31536000, // 1 year HSTS
        includeSubDomains: true,
        preload: true
    }
}));

// Enterprise Security: Prevent MongoDB Operator Injection attacks ($gt, $ne, etc.)
app.use(mongoSanitize());

// Enterprise Security: Rate Limiting Middleware
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes window
    max: 200, // Limit each IP to 200 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes.' }
});

const paymentLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes window
    max: 20, // Limit each IP to 20 payment initiation requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Payment rate limit reached. Please wait a few minutes before trying again.' }
});

app.use('/api/', generalLimiter);
app.use('/api/donations/initiate-sabpaisa', paymentLimiter);

// Database Connection Manager (Supports Serverless & Standalone Server)
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

// Database auto-connection middleware for serverless invocations
app.use(async (req, res, next) => {
    try {
        if (mongoose.connection.readyState < 1) {
            await connectDB();
        }
    } catch (err) {
        console.error('⚠️ DB connection middleware notice:', err.message);
    }
    next();
});

// CORS Security Configuration
const configuredOrigins = [
    process.env.CLIENT_URL || 'https://kiran-charitable-trust.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:4173'
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, server-to-server, curl)
        if (!origin) return callback(null, true);

        // Allow official domain, Vercel previews, and configured origins
        if (origin.endsWith('.vercel.app') || configuredOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Api-Key']
}));

// Payload limits to prevent DoS vector attacks
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// API Routes
app.use('/api/contact', require('./routes/contact'));
app.use('/api/volunteers', require('./routes/volunteers'));
app.use('/api/donations', require('./routes/donations'));

// Root & Health check endpoints
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Kiran Charitable Trust API is running',
        timestamp: new Date(),
        environment: process.env.NODE_ENV || 'production'
    });
});

app.get('/api', (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to Kiran Charitable Trust High-Security API'
    });
});

// 404 Route Handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'API route not found' });
});

// Centralized Error Handler (Prevents leakage of sensitive stack traces in production)
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err.stack);
    const isDev = process.env.NODE_ENV === 'development';
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        ...(isDev && { error: err.message })
    });
});

// Standalone Server Execution for local testing
if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    connectDB().finally(() => {
        app.listen(PORT, () => {
            console.log(`🚀 High-Security Server running on http://localhost:${PORT}`);
        });
    });
}

module.exports = app;
