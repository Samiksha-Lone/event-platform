const express = require('express');
const router = express.Router();

const reviewController = require('../controllers/review.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

router.post('/event/:eventId', 
  authenticateToken,
  reviewController.createReview
);

router.get('/event/:eventId', 
  reviewController.getEventReviews
);

router.put('/:reviewId', 
  authenticateToken,
  reviewController.updateReview
);

router.delete('/:reviewId', 
  authenticateToken,
  reviewController.deleteReview
);

router.post('/:reviewId/helpful', 
  authenticateToken,
  reviewController.markReviewHelpful
);

module.exports = router;
