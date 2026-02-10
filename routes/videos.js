const express = require('express');
const router = express.Router();
const {
  getVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
  getUserVideos,
  getTrendingVideos
} = require('../controllers/videoController');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const { videoUpload, thumbnailUpload } = require('../middleware/upload');
const prisma = require('../config/database');

// Public routes
router.get('/', optionalAuth, getVideos);
router.get('/trending', getTrendingVideos);
router.get('/:id', optionalAuth, getVideoById);
router.get('/user/:userId', optionalAuth, getUserVideos);

// Protected routes
router.post('/', authenticateToken, createVideo);
router.put('/:id', authenticateToken, updateVideo);
router.delete('/:id', authenticateToken, deleteVideo);

// Upload routes
router.post('/upload', authenticateToken, [
  videoUpload.single('video'),
  thumbnailUpload.single('thumbnail')
], async (req, res) => {
  try {
    if (!req.files || !req.files.video) {
      return res.status(400).json({ error: 'Video file is required' });
    }

    const { title, description, category, tags, visibility } = req.body;
    const videoFile = req.files.video;
    const thumbnailFile = req.files.thumbnail;

    if (!title || !category) {
      return res.status(400).json({ error: 'Title and category are required' });
    }

    const videoData = {
      title,
      description: description || '',
      thumbnail: thumbnailFile ? thumbnailFile.path : '',
      videoUrl: videoFile.path,
      category,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      visibility: visibility || 'public',
      userId: req.userId
    };

    const video = await prisma.video.create({
      data: videoData,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            channelName: true,
            avatar: true,
            subscribers: true
          }
        }
      }
    });

    // Update user video count
    await prisma.user.update({
      where: { id: req.userId },
      data: { videoCount: { increment: 1 } }
    });

    res.status(201).json({
      message: 'Video uploaded successfully',
      video
    });
  } catch (error) {
    console.error('Video upload error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
