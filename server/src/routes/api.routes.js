const express = require('express');
const router = express.Router();

const searchController = require('../controllers/search.controller');
const recommendationController = require('../services/recommendation.service');
const analyticsController = require('../controllers/analytics.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

router.get('/search', searchController.searchEvents);
router.get('/filters', searchController.getFilterOptions);

router.get('/recommendations', 
  authenticateToken, 
  recommendationController.getRecommendations
);

router.get('/trending', recommendationController.getTrendingEvents);

router.get('/analytics/organizer', 
  authenticateToken, 
  analyticsController.getOrganizerAnalytics
);

router.get('/analytics/event/:eventId', 
  authenticateToken, 
  analyticsController.getEventAnalytics
);

module.exports = router;
