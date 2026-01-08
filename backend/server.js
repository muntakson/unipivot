const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3010;

// Static files directory (parent of backend)
const STATIC_DIR = path.join(__dirname, '..');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Middleware to strip query strings from static file requests
app.use((req, res, next) => {
    // Skip API routes
    if (req.path.startsWith('/api/')) {
        return next();
    }

    // Get the path without query string
    const urlPath = req.path;
    const filePath = path.join(STATIC_DIR, urlPath);

    // Check if file exists
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        return next();
    }

    next();
});

// Serve static files from parent directory
app.use(express.static(STATIC_DIR, {
    extensions: ['html', 'htm'],
    index: 'index.html'
}));

// Handle custom.cm -> custom.css redirect
app.get('/css/custom.cm', (req, res) => {
    res.sendFile(path.join(STATIC_DIR, 'css', 'custom.css'));
});

// Form submission endpoint - general request form
app.post('/api/request', (req, res) => {
    console.log('Request form submitted:', req.body);
    // TODO: Add actual email sending or database storage logic here
    res.json({
        success: true,
        message: 'Your request has been received. We will contact you soon.'
    });
});

// Donation form endpoint
app.post('/api/donate', (req, res) => {
    console.log('Donation form submitted:', req.body);
    // TODO: Add actual donation processing logic here
    res.json({
        success: true,
        message: 'Thank you for your donation interest. We will contact you soon.'
    });
});

// Contact form endpoint
app.post('/api/contact', (req, res) => {
    console.log('Contact form submitted:', req.body);
    res.json({
        success: true,
        message: 'Your message has been received.'
    });
});

// Generic form endpoint for other forms
app.post('/api/form', (req, res) => {
    console.log('Form submitted:', req.body);
    res.json({
        success: true,
        message: 'Form submitted successfully.'
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'An error occurred processing your request.'
    });
});

app.listen(PORT, () => {
    console.log(`Unipivot backend server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
});
