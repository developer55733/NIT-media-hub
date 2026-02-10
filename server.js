require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { PrismaClient } = require('@prisma/client');

// Import routes
const authRoutes = require('./routes/auth');
const videoRoutes = require('./routes/videos');
const commentRoutes = require('./routes/comments');
const likeRoutes = require('./routes/likes');
const userRoutes = require('./routes/users');
const playlistRoutes = require('./routes/playlists');
const notificationRoutes = require('./routes/notifications');
const analyticsRoutes = require('./routes/analytics');
const searchRoutes = require('./routes/search');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Prisma Client with fallback
const DATABASE_URL = process.env.DATABASE_URL || 'mysql://root:rFGqmfUlVUcBHwqXviwmqhRazfdNjAXX@mysql.railway.internal:3306/railway';
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL
    }
  }
});

// Log the actual DATABASE_URL being used
console.log('🔗 DATABASE_URL:', DATABASE_URL);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      mediaSrc: ["'self'", "https:", "http:"],
      connectSrc: ["'self'"]
    }
  }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use(express.static(path.join(__dirname)));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1 as test`;
    
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      mysql: 'operational'
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error.message
    });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/search', searchRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Serve main page (SPA fallback)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle 404 for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found'
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  
  // Handle multer errors
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      error: 'File too large'
    });
  }
  
  // Handle validation errors
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      error: error.message
    });
  }
  
  // Handle Prisma errors
  if (error.code === 'P2002') {
    return res.status(409).json({
      error: 'Resource already exists'
    });
  }
  
  // Default error response
  res.status(500).json({
    error: 'Internal server error'
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Received SIGINT, shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

// Start server
const startServer = async () => {
  try {
    console.log('🔗 Attempting to connect to database...');
    console.log('🔗 DATABASE_URL:', DATABASE_URL);
    
    // Test database connection with detailed logging
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Test database query to verify connection
    try {
      const result = await prisma.$queryRaw`SELECT 1 as test`;
      console.log('✅ Database query test successful:', result);
    } catch (queryError) {
      console.error('❌ Database query test failed:', queryError);
    }
    
    app.listen(PORT, () => {
      console.log(`🚀 Media Hub server running on port ${PORT}`);
      console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 URL: http://localhost:${PORT}`);
      console.log(`🗄️ Database: MySQL connected`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    console.error('❌ Error details:', {
      message: error.message,
      code: error.code,
      meta: error.meta
    });
    process.exit(1);
  }
};

startServer();

module.exports = app;
