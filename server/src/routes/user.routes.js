const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

router.get('/profile/:userId', 
  userController.getUserProfile
);

router.put('/profile', 
  authenticateToken,
  userController.updateUserProfile
);

router.get('/preferences', 
  authenticateToken,
  userController.getUserPreferences
);

router.put('/preferences', 
  authenticateToken,
  userController.updateUserPreferences
);

router.post('/follow/:targetUserId', 
  authenticateToken,
  userController.followUser
);

router.delete('/follow/:targetUserId', 
  authenticateToken,
  userController.unfollowUser
);

router.post('/favorites/:eventId', 
  authenticateToken,
  userController.addFavoriteEvent
);

router.delete('/favorites/:eventId', 
  authenticateToken,
  userController.removeFavoriteEvent
);

router.get('/favorites', 
  authenticateToken,
  userController.getFavoriteEvents
);

module.exports = router;
