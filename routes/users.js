const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  toggleSubscription,
  getSubscriptionStatus,
  getUserSubscriptions,
  searchUsers,
  getChannelSubscribers
} = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.get('/search', searchUsers);
router.get('/:userId', getUserProfile);

// Protected routes
router.use(authenticateToken);
router.post('/:channelId/subscribe', toggleSubscription);
router.get('/:channelId/subscribe/status', getSubscriptionStatus);
router.get('/subscriptions/list', getUserSubscriptions);
router.get('/:channelId/subscribers', getChannelSubscribers);

module.exports = router;
