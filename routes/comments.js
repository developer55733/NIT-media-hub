const express = require('express');
const router = express.Router();
const {
  createComment,
  getComments,
  updateComment,
  deleteComment,
  likeComment
} = require('../controllers/commentController');
const { authenticateToken } = require('../middleware/auth');

// All comment routes require authentication
router.use(authenticateToken);

// Comment CRUD routes
router.post('/:videoId', createComment);
router.get('/:videoId', getComments);
router.put('/:id', updateComment);
router.delete('/:id', deleteComment);
router.post('/:id/like', likeComment);

module.exports = router;
