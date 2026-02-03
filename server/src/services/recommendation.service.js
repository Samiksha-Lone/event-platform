const Event = require('../models/event.model');
const UserPreferences = require('../models/userPreferences.model');
const Review = require('../models/review.model');
const { logError } = require('../middlewares/logger.middleware');

async function getRecommendations(req, res) {
  try {
    const userId = req.user._id;
    const limit = parseInt(req.query.limit) || 5;

    const preferences = await UserPreferences.findOne({ user: userId });
    const userInterests = preferences ? preferences.interests : [];

    const query = {
      isDeleted: false,
      date: { $gte: new Date() }, 
      owner: { $ne: userId },
      rsvps: { $ne: userId } 
    };

    let recommendations = [];

    if (userInterests.length > 0) {
      const interestEvents = await Event.find({
        ...query,
        category: { $in: userInterests }
      })
      .sort({ date: 1, averageRating: -1 })
      .limit(limit)
      .populate('owner', 'name');
      
      recommendations = [...interestEvents];
    }

    if (recommendations.length < limit) {
      const remainingLimit = limit - recommendations.length;
      const popularEvents = await Event.find({
        ...query,
        _id: { $nin: recommendations.map(e => e._id) } 
      })
      .sort({ rsvps: -1, averageRating: -1 }) 
      .limit(remainingLimit)
      .populate('owner', 'name');

      recommendations = [...recommendations, ...popularEvents];
    }

    res.json({
      message: 'Recommendations fetched',
      recommendations
    });

  } catch (error) {
    logError(error, req);
    res.status(500).json({ message: 'Failed to get recommendations' });
  }
}

async function getTrendingEvents(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const trending = await Event.find({
      isDeleted: false,
      date: { $gte: new Date() }
    })
    .sort({ rsvps: -1, averageRating: -1 })
    .limit(limit)
    .populate('owner', 'name');

    res.json({
      message: 'Trending events fetched',
      events: trending
    });
  } catch (error) {
    logError(error, req);
    res.status(500).json({ message: 'Failed to get trending events' });
  }
}

module.exports = {
  getRecommendations,
  getTrendingEvents
};
