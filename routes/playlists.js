const express = require('express');
const router = express.Router();
const {
  createPlaylist,
  getUserPlaylists,
  getPublicPlaylists,
  getPlaylistById,
  addVideosToPlaylist,
  removeVideoFromPlaylist,
  updatePlaylist,
  deletePlaylist,
  reorderPlaylistVideos
} = require('../controllers/playlistController');
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.get('/public', getPublicPlaylists);
router.get('/:id', getPlaylistById);

// Protected routes
router.use(authenticateToken);
router.post('/', createPlaylist);
router.get('/', getUserPlaylists);
router.post('/:id/videos', addVideosToPlaylist);
router.delete('/:id/videos/:videoId', removeVideoFromPlaylist);
router.put('/:id', updatePlaylist);
router.delete('/:id', deletePlaylist);
router.put('/:id/reorder', reorderPlaylistVideos);

module.exports = router;
