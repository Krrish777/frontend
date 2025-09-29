const express = require('express');
const path = require('path');
const app = express();

// Get port from environment variable or use 3000 as default
const PORT = process.env.PORT || 3000;

// Serve static files from the current directory
app.use(express.static(__dirname));

// Handle all routes by serving index.html (for SPA routing)
app.get('*', (req, res) => {
    // If the request is for a specific HTML file, serve it
    if (req.path.endsWith('.html')) {
        const filePath = path.join(__dirname, req.path);
        res.sendFile(filePath, (err) => {
            if (err) {
                res.status(404).sendFile(path.join(__dirname, 'index.html'));
            }
        });
    } else if (req.path === '/') {
        // Serve index.html for root path
        res.sendFile(path.join(__dirname, 'index.html'));
    } else {
        // For other paths, try to serve the file or fallback to index.html
        const filePath = path.join(__dirname, req.path);
        res.sendFile(filePath, (err) => {
            if (err) {
                res.sendFile(path.join(__dirname, 'index.html'));
            }
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Samudra-I server is running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 Access your app at: http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM received. Shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('🛑 SIGINT received. Shutting down gracefully...');
    process.exit(0);
});