const express = require('express');
const router = express.Router();
const {
  toggleVideoLike,
  getVideoLikeStatus,
  getVideoLikes
} = require('../controllers/likeController');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

// Public routes
router.get('/:videoId', getVideoLikes);

// Protected routes
router.use(authenticateToken);
router.post('/:videoId', toggleVideoLike);
router.get('/:videoId/status', getVideoLikeStatus);

module.exports = router;
