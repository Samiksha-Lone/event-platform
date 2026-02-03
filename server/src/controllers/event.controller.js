const { v4: uuid } = require('uuid');

const Event = require('../models/event.model');
const eventModel = require('../models/event.model');
const storageService = require('../services/storage.service');
const cacheService = require('../services/cache.service');

 async function createEvent(req, res) {
  try {
    const { 
      title, 
      description, 
      category, 
      capacity, 
      date, 
      time, 
      eventType,
      location,
      meetingPlatform,
      meetingLink,
      meetingPassword,
      imageUrl 
    } = req.body;

    // Validation - all required fields
    if (!title || !description || !category || !capacity || !date || !time || !eventType) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate event type
    if (!['online', 'offline'].includes(eventType)) {
      return res.status(400).json({ message: 'Invalid event type. Must be online or offline.' });
    }

    // Event type specific validation
    if (eventType === 'offline' && !location) {
      return res.status(400).json({ message: 'Location is required for offline events' });
    }

    if (eventType === 'online') {
      if (!meetingPlatform || !meetingLink) {
        return res.status(400).json({ message: 'Meeting platform and link are required for online events' });
      }
      // Validate meeting link is a URL
      try {
        new URL(meetingLink);
      } catch (err) {
        return res.status(400).json({ message: 'Invalid meeting link URL' });
      }
    }

    let image;

    // CASE 1: File upload (multipart/form-data)
    if (req.file) {
      const imageBuffer = req.file.buffer;
      const fileUploadResult = await storageService.uploadFile(imageBuffer, uuid());
      image = fileUploadResult.url;
    } 
    // CASE 2: Image URL (JSON request)
    else if (imageUrl && imageUrl.startsWith('http')) {
      image = imageUrl;
    } 
    // CASE 3: No image provided
    else {
      return res.status(400).json({ 
        message: 'Event image required (upload file or provide image URL)' 
      });
    }

    // Create event with all fields
    const eventData = {
      title,
      description,
      category,
      capacity: parseInt(capacity),
      date,
      time,
      eventType,
      image,
      owner: req.user._id,
    };

    // Add type-specific fields
    if (eventType === 'offline') {
      eventData.location = location;
    } else {
      eventData.meetingPlatform = meetingPlatform;
      eventData.meetingLink = meetingLink;
      if (meetingPassword) {
        eventData.meetingPassword = meetingPassword;
      }
    }

    const newEvent = await eventModel.create(eventData);

    // Add audit log for creation
    newEvent.addAuditLog('created', req.user._id, { title, category, date });
    await newEvent.save();

    // Populate owner and rsvps for complete response
    const populatedEvent = await newEvent.populate('owner', 'name email _id');

    // Invalidate all event list caches
    await cacheService.delPattern('events:*');

    res.status(201).json({
      message: 'Event created successfully',
      event: populatedEvent,
    });
  } catch (err) {
    console.error('Create event error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// GET ALL EVENTS (for dashboard) - WITH PAGINATION AND CACHING
async function getEvents(req, res) {
  try {
    // Extract pagination parameters from query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const category = req.query.category;
    
    // Build query filter
    const filter = { isDeleted: false }; // Only fetch non-deleted events
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    // Filter by tag if provided
    if (req.query.tag) {
      filter.tags = req.query.tag.toLowerCase();
    }

    // Create cache key based on query parameters
    const cacheKey = `events:page:${page}:limit:${limit}:category:${category || 'all'}`;
    
    // Try to get from cache first
    try {
      const cachedData = await cacheService.get(cacheKey);
      if (cachedData) {
        console.log('✅ Returning cached events');
        return res.status(200).json(cachedData);
      }
    } catch (cacheErr) {
      console.warn('Cache error (ignoring):', cacheErr);
    }

    // If not in cache, fetch from database
    const [events, totalEvents] = await Promise.all([
      eventModel
        .find(filter)
        .sort({ createdAt: -1 }) // Sort by newest first
        .skip(skip)
        .limit(limit)
        .populate('owner', 'name email _id')
        .populate('rsvps', 'name email _id')
        .select('-auditLog'), // Exclude audit log from list view for performance
      eventModel.countDocuments(filter)
    ]);

    // Filter out events with null owners (if any) and log them
    const eventsWithOwners = events.filter(e => e.owner !== null);
    const eventsWithoutOwners = events.filter(e => e.owner === null);
    
    if (eventsWithoutOwners.length > 0) {
      console.warn('[Backend] WARNING: Events without owners:', {
        count: eventsWithoutOwners.length,
        eventIds: eventsWithoutOwners.map(e => ({
          _id: e._id,
          title: e.title,
          ownerField: e.owner
        }))
      });
    }

    const totalPages = Math.ceil(totalEvents / limit);
    const hasMore = page < totalPages;

    const responseData = {
      message: 'Events fetched successfully',
      events: eventsWithOwners.length > 0 ? eventsWithOwners : events,
      pagination: {
        currentPage: page,
        totalPages,
        totalEvents,
        eventsPerPage: limit,
        hasMore
      }
    };

    // Cache the response for 5 minutes (300 seconds)
    try {
      await cacheService.set(cacheKey, responseData, 300);
    } catch (cacheErr) {
      console.warn('Cache set error (ignoring):', cacheErr);
    }

    res.status(200).json(responseData);
  } catch (err) {
    console.error('Get events error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}


// GET EVENT BY ID
async function getEventById(req, res) {
  try {
    const { id } = req.params;
    const event = await eventModel
      .findById(id)
      .populate('owner', 'name email _id')
      .populate('rsvps', 'name email _id');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if event is soft deleted
    if (event.isDeleted) {
      // Allow specific role checks here if needed, or if req.user matches owner
      // For public view, we treat it as not found
      // Note: req.user might not be available if this route is public optional auth
      // For now, simpler to just hide it unless we implement specific "view deleted" logic
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({
      message: 'Event fetched successfully',
      event,
    });
  } catch (error) {
    console.error('Get event by id error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// RSVP JOIN
async function rsvpEvent(req, res) {
  try {
    const userId = req.user._id;
    const eventId = req.params.id;

    // First, check if event exists and is not full
    const event = await eventModel.findById(eventId);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.isDeleted) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if already RSVP'd
    if (event.rsvps.some(id => String(id) === String(userId))) {
      return res.status(400).json({ message: 'You already joined this event' });
    }

    // Check capacity
    if (event.rsvps.length >= event.capacity) {
      return res.status(400).json({ message: 'Event is full' });
    }

    // Add user to RSVP list
    const updatedEvent = await eventModel
      .findByIdAndUpdate(
        eventId,
        { $addToSet: { rsvps: userId } },
        { new: true }
      )
      .populate('owner', 'name email _id')
      .populate('rsvps', 'name email _id');


    res.json({ message: 'RSVP successful', event: updatedEvent });
  } catch (err) {
    console.error('RSVP error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

// RSVP LEAVE
async function unrsvpEvent(req, res) {
  try {
    const userId = req.user._id;
    const eventId = req.params.id;

    const updatedEvent = await eventModel
      .findByIdAndUpdate(
        eventId,
        { $pull: { rsvps: userId } },
        { new: true }
      )
      .populate('owner', 'name email _id')
      .populate('rsvps', 'name email _id');

    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (updatedEvent.isDeleted) {
      return res.status(404).json({ message: 'Event not found' });
    }


    res.json({ message: 'RSVP cancelled', event: updatedEvent });
  } catch (err) {
    console.error('Un-RSVP error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function updateEvent(req, res) {
  try {
    const eventId = req.params.id;
    const userId = req.user?._id;

    if (!eventId) {
      return res.status(400).json({ message: 'Event ID is required' });
    }

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const event = await eventModel.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (!event.owner) {
      return res.status(500).json({ message: 'Event owner missing' });
    }

    if (event.owner.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not allowed to edit this event' });
    }

    const { title, description, date, location, capacity, category, time, eventType, meetingPlatform, meetingLink, meetingPassword } = req.body;

    if (!title || !description || !date || !time || !capacity) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    event.title = title;
    event.description = description;
    event.date = new Date(date);
    event.capacity = parseInt(capacity);
    event.category = category || event.category;
    event.time = time;

    if (eventType !== undefined) {
      event.eventType = eventType;
      if (eventType === 'offline') {
        event.meetingPlatform = undefined;
        event.meetingLink = undefined;
        event.meetingPassword = undefined;
        event.location = location;
      } else {
        event.location = undefined;
        event.meetingPlatform = meetingPlatform;
        event.meetingLink = meetingLink;
        event.meetingPassword = meetingPassword || undefined;
      }
    } else {
      if (event.eventType === 'offline') {
        event.location = location || event.location;
      } else if (event.eventType === 'online') {
        event.meetingPlatform = meetingPlatform || event.meetingPlatform;
        event.meetingLink = meetingLink || event.meetingLink;
        if (meetingPassword !== undefined) event.meetingPassword = meetingPassword;
      }
    }

    if (req.file) {
      const fileUploadResult = await storageService.uploadFile(
        req.file.buffer,
        uuid()
      );
      event.image = fileUploadResult.url;
    }

    await event.save();

    const updatedEvent = await eventModel.findById(eventId)
      .populate('owner', 'name email _id')
      .populate('rsvps', 'name email _id');

    await cacheService.delPattern('events:*');
    await cacheService.del(`event:${eventId}`);

    return res.json({ 
      message: 'Event updated successfully', 
      event: updatedEvent 
    });
  } catch (err) {
    console.error('Update event error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function deleteEvent(req, res) {
  try {
    const eventId = req.params.id;
    const userId = req.user._id;

    const event = await eventModel.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.owner.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: 'Not allowed to delete this event' });
    }

    event.softDelete(userId);
    await event.save();

    await cacheService.delPattern('events:*');
    await cacheService.del(`event:${eventId}`);
    
    res.json({ message: 'Event deleted' });
  } catch (err) {
    console.error('Delete event error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  rsvpEvent,
  unrsvpEvent,
  updateEvent,
  deleteEvent,
};





