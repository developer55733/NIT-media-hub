const express = require('express');
const router = express.Router();
const {
  getChannelAnalytics,
  getVideoAnalytics,
  getPlatformAnalytics
} = require('../controllers/analyticsController');
const { authenticateToken } = require('../middleware/auth');

// All analytics routes require authentication
router.use(authenticateToken);

router.get('/channel/:userId', getChannelAnalytics);
router.get('/video/:videoId', getVideoAnalytics);
router.get('/platform', getPlatformAnalytics);

module.exports = router;
