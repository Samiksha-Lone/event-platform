const Event = require('../models/event.model');
const { logError } = require('../middlewares/logger.middleware');

async function searchEvents(req, res) {
  try {
    const {
      q,             
      category,       
      startDate,    
      endDate,        
      minPrice,     
      maxPrice,      
      eventType,   
      location,      
      tags,         
      sort = 'date',  
      order = 'asc',  
      page = 1,
      limit = 10
    } = req.query;

    const filter = { isDeleted: false };
    
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (eventType) {
      filter.eventType = eventType;
    }

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    } else {
      filter.date = { $gte: new Date() }; 
    }

    if (tags) {
      const tagList = tags.split(',').map(t => t.trim().toLowerCase());
      filter.tags = { $in: tagList };
    }

    const sortOptions = {};
    if (sort === 'popularity') {
      sortOptions.rsvps = -1; 
    } else if (sort === 'rating') {
      sortOptions.averageRating = -1;
    } else {
      sortOptions[sort] = order === 'desc' ? -1 : 1;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [events, total] = await Promise.all([
      Event.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('owner', 'name email')
        .select('-auditLog -attendees'), 
      Event.countDocuments(filter)
    ]);

    res.json({
      message: 'Search results',
      events,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalEvents: total,
        hasMore: parseInt(page) * parseInt(limit) < total
      }
    });

  } catch (error) {
    logError(error, req);
    res.status(500).json({ message: 'Search failed' });
  }
}

async function getFilterOptions(req, res) {
  try {
    const [categories, tags, cities] = await Promise.all([
      Event.distinct('category', { isDeleted: false }),
      Event.distinct('tags', { isDeleted: false }),
      Event.distinct('location', { eventType: 'offline', isDeleted: false }) 
    ]); 
    res.json({
      categories,
      tags: tags.slice(0, 20), 
      locations: cities.slice(0, 20)
    });
  } catch (error) {
    logError(error, req);
    res.status(500).json({ message: 'Failed to fetch filter options' });
  }
}

module.exports = {
  searchEvents,
  getFilterOptions
};
