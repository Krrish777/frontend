const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// RAILWAY DEPLOYMENT CONFIGURATION
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'production';
const HOST = '0.0.0.0'; // CRITICAL: Railway requires 0.0.0.0

console.log('🚀 Starting Samudra-I Server...');
console.log('📍 PORT:', PORT);
console.log('🌍 HOST:', HOST);
console.log('📦 NODE_ENV:', NODE_ENV);
console.log('🔧 Platform:', process.platform);
console.log('📊 Node Version:', process.version);

// MIDDLEWARE CONFIGURATION
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// SECURITY HEADERS
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

// STATIC FILES WITH OPTIMIZED CACHING
app.use(express.static(__dirname, {
    maxAge: NODE_ENV === 'production' ? '1d' : '0',
    etag: true,
    lastModified: true,
    index: false // Prevent automatic index.html serving
}));

// FAVICON HANDLER - Prevents 404 errors
app.get('/favicon.ico', (req, res) => {
    const faviconPath = path.join(__dirname, 'favicon.ico');
    if (fs.existsSync(faviconPath)) {
        res.sendFile(faviconPath);
    } else {
        res.status(204).end(); // No content
    }
});

// HEALTH CHECK ENDPOINT - Railway monitoring
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: '1.0.0',
        environment: NODE_ENV,
        port: PORT,
        host: HOST
    });
});

// API STATUS ENDPOINT
app.get('/api/status', (req, res) => {
    res.json({
        message: 'Samudra-I API is running!',
        timestamp: new Date().toISOString(),
        environment: NODE_ENV,
        version: '1.0.0',
        status: 'online'
    });
});

// ROOT ROUTE HANDLER
app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).json({ error: 'Index file not found' });
    }
});

// SPA ROUTE HANDLER - Serve HTML files directly
app.get('*.html', (req, res) => {
    const filePath = path.join(__dirname, req.path);
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).json({ error: 'Page not found' });
    }
});

// CATCH-ALL ROUTE - Handle all other requests
app.get('*', (req, res) => {
    const filePath = path.join(__dirname, req.path);
    
    // Check if file exists
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        res.sendFile(filePath);
    } else {
        // Fallback to index.html for SPA routing
        const indexPath = path.join(__dirname, 'index.html');
        if (fs.existsSync(indexPath)) {
            res.sendFile(indexPath);
        } else {
            res.status(404).json({ error: 'File not found' });
        }
    }
});

// ERROR HANDLING MIDDLEWARE
app.use((err, req, res, next) => {
    console.error('❌ Server Error:', err);
    res.status(500).json({ 
        error: 'Internal Server Error',
        message: NODE_ENV === 'production' ? 'Something went wrong' : err.message
    });
});

// GRACEFUL SHUTDOWN HANDLERS
process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM received. Shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('🛑 SIGINT received. Shutting down gracefully...');
    process.exit(0);
});

process.on('uncaughtException', (err) => {
    console.error('💥 Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('🚫 Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// START SERVER
const server = app.listen(PORT, HOST, () => {
    console.log('\n✅ SERVER STARTED SUCCESSFULLY!');
    console.log(`🌐 Server running on http://${HOST}:${PORT}`);
    console.log(`📡 Health check: http://${HOST}:${PORT}/health`);
    console.log(`🔍 API status: http://${HOST}:${PORT}/api/status`);
    console.log(`🎯 Ready to accept Railway traffic!\n`);
});

// SERVER ERROR HANDLER
server.on('error', (err) => {
    console.error('❌ Server failed to start:', err);
    process.exit(1);
});

module.exports = app;