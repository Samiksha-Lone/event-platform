const Review = require('../models/review.model');
const Event = require('../models/event.model');
const { logError } = require('../middlewares/logger.middleware');

async function createReview(req, res) {
  try {
    const { eventId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.isDeleted) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const existingReview = await Review.findOne({ event: eventId, user: userId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this event' });
    }

    const review = await Review.create({
      event: eventId,
      user: userId,
      rating,
      comment
    });

    const reviews = await Review.find({ event: eventId });
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    event.averageRating = totalRating / reviews.length;
    event.reviewCount = reviews.length;
    await event.save();

    const populatedReview = await Review.findById(review._id)
      .populate('user', 'name email profilePicture');

    res.status(201).json({
      message: 'Review created successfully',
      review: populatedReview
    });
  } catch (error) {
    logError(error, req);
    res.status(500).json({ message: 'Server error' });
  }
}

async function getEventReviews(req, res) {
  try {
    const { eventId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ event: eventId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name email profilePicture');

    const totalReviews = await Review.countDocuments({ event: eventId });

    res.json({
      message: 'Reviews fetched successfully',
      reviews,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalReviews / limit),
        totalReviews,
        reviewsPerPage: limit
      }
    });
  } catch (error) {
    logError(error, req);
    res.status(500).json({ message: 'Server error' });
  }
}

async function updateReview(req, res) {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    review.rating = rating || review.rating;
    review.comment = comment !== undefined ? comment : review.comment;
    await review.save();

    const event = await Event.findById(review.event);
    const reviews = await Review.find({ event: review.event });
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    event.averageRating = totalRating / reviews.length;
    await event.save();

    const populatedReview = await Review.findById(review._id)
      .populate('user', 'name email profilePicture');

    res.json({
      message: 'Review updated successfully',
      review: populatedReview
    });
  } catch (error) {
    logError(error, req);
    res.status(500).json({ message: 'Server error' });
  }
}

async function deleteReview(req, res) {
  try {
    const { reviewId } = req.params;
    const userId = req.user._id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    const eventId = review.event;
    await review.deleteOne();

    const event = await Event.findById(eventId);
    const reviews = await Review.find({ event: eventId });
    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
      event.averageRating = totalRating / reviews.length;
      event.reviewCount = reviews.length;
    } else {
      event.averageRating = 0;
      event.reviewCount = 0;
    }
    await event.save();

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    logError(error, req);
    res.status(500).json({ message: 'Server error' });
  }
}

async function markReviewHelpful(req, res) {
  try {
    const { reviewId } = req.params;
    const userId = req.user._id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const alreadyMarked = review.helpful.some(id => id.toString() === userId.toString());
    
    if (alreadyMarked) {
      review.helpful = review.helpful.filter(id => id.toString() !== userId.toString());
    } else {
      review.helpful.push(userId);
    }

    await review.save();

    res.json({
      message: alreadyMarked ? 'Removed from helpful' : 'Marked as helpful',
      helpfulCount: review.helpful.length
    });
  } catch (error) {
    logError(error, req);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  createReview,
  getEventReviews,
  updateReview,
  deleteReview,
  markReviewHelpful
};
