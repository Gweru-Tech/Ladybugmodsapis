const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"]
    }
  }
}));

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Import API routes
const downloadAPIs = require('./api/download');
const aiAPIs = require('./api/ai');
const youtubeAPIs = require('./api/youtube');
const toolsAPIs = require('./api/tools');
const imageAPIs = require('./api/image');
const nsfAPIs = require('./api/nsf');
const imagineAPIs = require('./api/imagine');
const businessAPIs = require('./api/business');

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: require('./package.json').version
  });
});

// API Routes
app.use('/api/download', downloadAPIs);
app.use('/api/ai', aiAPIs);
app.use('/api/youtube', youtubeAPIs);
app.use('/api/tools', toolsAPIs);
app.use('/api/image', imageAPIs);
app.use('/api/nsf', nsfAPIs);
app.use('/api/imagine', imagineAPIs);
app.use('/api/business', businessAPIs);

// API Documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'Comprehensive API Hub',
    version: '1.0.0',
    description: 'A collection of powerful APIs for various use cases',
    endpoints: {
      download: '/api/download - File download utilities',
      ai: '/api/ai - AI-powered text processing',
      youtube: '/api/youtube - YouTube video operations',
      tools: '/api/tools - General utility tools',
      image: '/api/image - Image processing and generation',
      nsf: '/api/nsf - National Science Foundation data',
      imagine: '/api/imagine - Creative content generation',
      business: '/api/business - Business and financial data'
    },
    documentation: '/docs',
    health: '/health'
  });
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve API documentation
app.get('/docs', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'docs.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 API Hub Server running on port ${PORT}`);
  console.log(`📖 Documentation available at http://localhost:${PORT}/docs`);
  console.log(`🔍 Health check at http://localhost:${PORT}/health`);
});

module.exports = app;