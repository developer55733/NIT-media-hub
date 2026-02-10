const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getCurrentUser,
  updateProfile
} = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { avatarUpload } = require('../middleware/upload');
const prisma = require('../config/database');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', authenticateToken, getCurrentUser);
router.put('/profile', authenticateToken, updateProfile);
router.put('/avatar', authenticateToken, avatarUpload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Update user avatar in database
    const user = await prisma.user.update({
      where: { id: req.userId },
      data: { avatar: req.file.path },
      select: {
        id: true,
        email: true,
        username: true,
        channelName: true,
        description: true,
        avatar: true,
        subscribers: true,
        totalViews: true,
        videoCount: true,
        isAdmin: true,
        createdAt: true
      }
    });

    res.json({
      message: 'Avatar updated successfully',
      user
    });
  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
