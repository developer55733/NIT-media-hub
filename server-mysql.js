require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const Joi = require('joi');

// Import database configuration
const { executeQuery, executeTransaction, testConnection, getDatabaseStats } = require('./database/config');

const app = express();
const PORT = process.env.PORT || 3000;

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
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
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

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads', file.fieldname === 'video' ? 'videos' : 'thumbnails');
    if (!require('fs').existsSync(uploadDir)) {
      require('fs').mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 100 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowedVideoTypes = /mp4|avi|mov|wmv|flv|webm/;
    const allowedImageTypes = /jpeg|jpg|png|gif/;
    
    const isVideo = allowedVideoTypes.test(path.extname(file.originalname).toLowerCase());
    const isImage = allowedImageTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = file.mimetype.startsWith('video/') || file.mimetype.startsWith('image/');
    
    if ((isVideo || isImage) && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and videos are allowed.'));
    }
  }
});

// JWT middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Validation schemas
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
  channelName: Joi.string().optional(),
  description: Joi.string().optional()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Helper functions
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// API Routes

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const stats = await getDatabaseStats();
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: stats
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      error: error.message
    });
  }
});

// Authentication routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, username, password, channelName, description } = req.body;

    // Check if user exists
    const existingUser = await executeQuery(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'User with this email or username already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS) || 12);

    // Create user
    const result = await executeQuery(
      `INSERT INTO users (email, username, password, channel_name, description) 
       VALUES (?, ?, ?, ?, ?)`,
      [email, username, hashedPassword, channelName || username, description || '']
    );

    const token = generateToken(result.insertId);

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: result.insertId, email, username, channelName: channelName || username },
      token
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password } = req.body;

    // Find user
    const users = await executeQuery(
      'SELECT * FROM users WHERE email = ? AND is_active = TRUE',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id);

    const userResponse = {
      id: user.id,
      email: user.email,
      username: user.username,
      channelName: user.channel_name,
      description: user.description,
      avatar: user.avatar,
      subscribers: user.subscribers,
      totalViews: user.total_views,
      videoCount: user.video_count,
      isAdmin: user.is_admin
    };

    res.json({
      message: 'Login successful',
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const users = await executeQuery(
      `SELECT id, email, username, channel_name, description, avatar, 
              subscribers, total_views, video_count, is_admin 
       FROM users WHERE id = ? AND is_active = TRUE`,
      [req.user.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[0];
    res.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        channelName: user.channel_name,
        description: user.description,
        avatar: user.avatar,
        subscribers: user.subscribers,
        totalViews: user.total_views,
        videoCount: user.video_count,
        isAdmin: user.is_admin
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Video routes
app.get('/api/videos', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const category = req.query.category;
    const search = req.query.search;
    const sortBy = req.query.sortBy || 'created_at';
    const sortOrder = req.query.sortOrder || 'desc';
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE v.status = "published" AND v.visibility = "public"';
    let params = [];

    if (category && category !== 'all') {
      whereClause += ' AND v.category = ?';
      params.push(category);
    }

    if (search) {
      whereClause += ' AND (v.title LIKE ? OR v.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    const query = `
      SELECT 
        v.*,
        u.username,
        u.channel_name,
        u.avatar as channel_avatar,
        u.subscribers as channel_subscribers
      FROM videos v
      JOIN users u ON v.user_id = u.id
      ${whereClause}
      ORDER BY v.${sortBy} ${sortOrder}
      LIMIT ? OFFSET ?
    `;

    const videos = await executeQuery(query, [...params, limit, offset]);

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM videos v
      ${whereClause}
    `;

    const countResult = await executeQuery(countQuery, params);
    const total = countResult[0].total;

    res.json({
      videos,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get videos error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/videos/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const videos = await executeQuery(
      `SELECT 
        v.*,
        u.username,
        u.channel_name,
        u.avatar as channel_avatar,
        u.subscribers as channel_subscribers,
        u.description as channel_description
       FROM videos v
       JOIN users u ON v.user_id = u.id
       WHERE v.id = ?`,
      [id]
    );

    if (videos.length === 0) {
      return res.status(404).json({ error: 'Video not found' });
    }

    const video = videos[0];

    // Check if video is accessible
    if (video.visibility === 'private' && (!req.user || req.user.userId !== video.user_id)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Increment views if not the owner
    if (!req.user || req.user.userId !== video.user_id) {
      await executeQuery(
        'UPDATE videos SET views = views + 1 WHERE id = ?',
        [id]
      );
      video.views += 1;
    }

    // Get comments
    const comments = await executeQuery(
      `SELECT 
        c.*,
        u.username,
        u.avatar as user_avatar
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.video_id = ? AND c.parent_id IS NULL
       ORDER BY c.created_at DESC`,
      [id]
    );

    res.json({
      video: {
        ...video,
        comments
      }
    });
  } catch (error) {
    console.error('Get video by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/videos', authenticateToken, upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, description, category, tags, visibility } = req.body;

    if (!title || !category) {
      return res.status(400).json({ error: 'Title and category are required' });
    }

    const videoFile = req.files.video ? req.files.video[0] : null;
    const thumbnailFile = req.files.thumbnail ? req.files.thumbnail[0] : null;

    if (!videoFile) {
      return res.status(400).json({ error: 'Video file is required' });
    }

    const result = await executeQuery(
      `INSERT INTO videos (title, description, thumbnail, video_url, category, tags, visibility, user_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        description || '',
        thumbnailFile ? `/uploads/thumbnails/${thumbnailFile.filename}` : '',
        `/uploads/videos/${videoFile.filename}`,
        category,
        tags ? JSON.stringify(tags.split(',').map(tag => tag.trim())) : JSON.stringify([]),
        visibility || 'public',
        req.user.userId
      ]
    );

    res.status(201).json({
      message: 'Video uploaded successfully',
      video: {
        id: result.insertId,
        title,
        description,
        category,
        videoUrl: `/uploads/videos/${videoFile.filename}`,
        thumbnail: thumbnailFile ? `/uploads/thumbnails/${thumbnailFile.filename}` : ''
      }
    });
  } catch (error) {
    console.error('Video upload error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Trending videos
app.get('/api/videos/trending', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;

    const videos = await executeQuery(
      `SELECT 
        v.*,
        u.username,
        u.channel_name,
        u.avatar as channel_avatar,
        u.subscribers as channel_subscribers
       FROM videos v
       JOIN users u ON v.user_id = u.id
       WHERE v.status = 'published' 
         AND v.visibility = 'public'
         AND v.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
       ORDER BY (v.views + v.likes + v.comments) DESC, v.created_at DESC
       LIMIT ?`,
      [limit]
    );

    res.json({ videos });
  } catch (error) {
    console.error('Get trending videos error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Comments routes
app.get('/api/comments/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const comments = await executeQuery(
      `SELECT 
        c.*,
        u.username,
        u.avatar as user_avatar
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.video_id = ? AND c.parent_id IS NULL
       ORDER BY c.created_at DESC
       LIMIT ? OFFSET ?`,
      [videoId, limit, offset]
    );

    const countResult = await executeQuery(
      'SELECT COUNT(*) as total FROM comments WHERE video_id = ? AND parent_id IS NULL',
      [videoId]
    );

    const total = countResult[0].total;

    res.json({
      comments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/comments/:videoId', authenticateToken, async (req, res) => {
  try {
    const { videoId } = req.params;
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Comment text is required' });
    }

    const result = await executeQuery(
      'INSERT INTO comments (text, user_id, video_id) VALUES (?, ?, ?)',
      [text.trim(), req.user.userId, videoId]
    );

    res.status(201).json({
      message: 'Comment created successfully',
      comment: {
        id: result.insertId,
        text: text.trim(),
        videoId,
        userId: req.user.userId
      }
    });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Likes routes
app.post('/api/likes/:videoId', authenticateToken, async (req, res) => {
  try {
    const { videoId } = req.params;
    const { type } = req.body;

    if (!['like', 'dislike'].includes(type)) {
      return res.status(400).json({ error: 'Type must be like or dislike' });
    }

    // Check if user already liked/disliked
    const existingLikes = await executeQuery(
      'SELECT * FROM likes WHERE user_id = ? AND video_id = ?',
      [req.user.userId, videoId]
    );

    let updateData = {};
    let message = '';

    if (existingLikes.length > 0) {
      const existingLike = existingLikes[0];
      
      if (existingLike.type === type) {
        // Remove the like/dislike
        await executeQuery(
          'DELETE FROM likes WHERE user_id = ? AND video_id = ?',
          [req.user.userId, videoId]
        );

        if (type === 'like') {
          updateData = { likes: -1 };
          message = 'Like removed successfully';
        } else {
          updateData = { dislikes: -1 };
          message = 'Dislike removed successfully';
        }
      } else {
        // Change from like to dislike or vice versa
        await executeQuery(
          'UPDATE likes SET type = ? WHERE user_id = ? AND video_id = ?',
          [type, req.user.userId, videoId]
        );

        if (type === 'like') {
          updateData = { likes: 1, dislikes: -1 };
          message = 'Changed to like successfully';
        } else {
          updateData = { likes: -1, dislikes: 1 };
          message = 'Changed to dislike successfully';
        }
      }
    } else {
      // Add new like/dislike
      await executeQuery(
        'INSERT INTO likes (type, user_id, video_id) VALUES (?, ?, ?)',
        [type, req.user.userId, videoId]
      );

      if (type === 'like') {
        updateData = { likes: 1 };
        message = 'Video liked successfully';
      } else {
        updateData = { dislikes: 1 };
        message = 'Video disliked successfully';
      }
    }

    // Update video counts
    if (updateData.likes) {
      await executeQuery(
        `UPDATE videos SET likes = likes + ? WHERE id = ?`,
        [updateData.likes, videoId]
      );
    }

    if (updateData.dislikes) {
      await executeQuery(
        `UPDATE videos SET dislikes = dislikes + ? WHERE id = ?`,
        [updateData.dislikes, videoId]
      );
    }

    // Get updated counts
    const videoResult = await executeQuery(
      'SELECT likes, dislikes FROM videos WHERE id = ?',
      [videoId]
    );

    const video = videoResult[0];

    res.json({
      message,
      likes: video.likes,
      dislikes: video.dislikes
    });
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve main page
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
  
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      error: 'File too large'
    });
  }
  
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      error: error.message
    });
  }
  
  res.status(500).json({
    error: 'Internal server error'
  });
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    const connected = await testConnection();
    if (!connected) {
      throw new Error('Database connection failed');
    }
    
    app.listen(PORT, () => {
      console.log(`🚀 Media Hub server running on port ${PORT}`);
      console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 URL: http://localhost:${PORT}`);
      console.log(`🗄️  Database: MySQL`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
