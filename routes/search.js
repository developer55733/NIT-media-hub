const express = require('express');
const router = express.Router();
const {
  globalSearch,
  getSearchSuggestions,
  getTrendingSearches,
  advancedSearch
} = require('../controllers/searchController');

// Public routes
router.get('/', globalSearch);
router.get('/suggestions', getSearchSuggestions);
router.get('/trending', getTrendingSearches);
router.get('/advanced', advancedSearch);

module.exports = router;
