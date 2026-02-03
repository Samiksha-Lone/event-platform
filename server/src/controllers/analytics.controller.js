const Event = require('../models/event.model');
const { logError } = require('../middlewares/logger.middleware');

async function getOrganizerAnalytics(req, res) {
  try {
    const userId = req.user._id;

    const totalEvents = await Event.countDocuments({ owner: userId, isDeleted: false });

    const events = await Event.find({ owner: userId, isDeleted: false }).select('rsvps viewCount title createdAt');
    const totalRsvps = events.reduce((sum, e) => sum + e.rsvps.length, 0);
    const totalViews = events.reduce((sum, e) => sum + (e.viewCount || 0), 0);

    const currentYear = new Date().getFullYear();
    const monthlyStats = Array(12).fill(0);
 
    events.forEach(e => {
      if (e.createdAt.getFullYear() === currentYear) {
        monthlyStats[e.createdAt.getMonth()]++;
      }
    });

    const topEvents = [...events]
      .sort((a, b) => b.rsvps.length - a.rsvps.length)
      .slice(0, 5)
      .map(e => ({
        id: e._id,
        title: e.title,
        rsvps: e.rsvps.length,
        views: e.viewCount || 0
      }));

    res.json({
      message: 'Analytics fetched',
      summary: {
        totalEvents,
        totalRsvps,
        totalViews,
        avgRsvpsPerEvent: totalEvents > 0 ? (totalRsvps / totalEvents).toFixed(1) : 0
      },
      chartData: {
        eventsByMonth: monthlyStats,
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      topEvents
    });

  } catch (error) {
    logError(error, req);
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
}

async function getEventAnalytics(req, res) {
  try {
    const { eventId } = req.params;
    const userId = req.user._id;

    const event = await Event.findById(eventId);
    
    if (!event) return res.status(404).json({ message: 'Event not found' });
    
    if (event.owner.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({
      message: 'Event analytics fetched',
      analytics: {
        views: event.viewCount || 0,
        rsvps: event.rsvps.length,
        capacity: event.capacity,
        fillRate: Math.round((event.rsvps.length / event.capacity) * 100),
        rating: event.averageRating || 0,
        reviews: event.reviewCount || 0
      }
    });

  } catch (error) {
    logError(error, req);
    res.status(500).json({ message: 'Failed to fetch event analytics' });
  }
}

module.exports = {
  getOrganizerAnalytics,
  getEventAnalytics
};
