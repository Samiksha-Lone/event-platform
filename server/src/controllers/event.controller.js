const { v4: uuid } = require('uuid');

const Event = require('../models/event.model');
const eventModel = require('../models/event.model');
const storageService = require('../services/storage.service');

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

    // Populate owner and rsvps for complete response
    const populatedEvent = await newEvent.populate('owner', 'name email _id');

    res.status(201).json({
      message: 'Event created successfully',
      event: populatedEvent,
    });
  } catch (err) {
    console.error('Create event error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// GET ALL EVENTS (for dashboard)
async function getEvents(req, res) {
  try {
    const events = await eventModel
      .find({})
      .populate('owner', 'name email _id')
      .populate('rsvps', 'name email _id');


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

    res.status(200).json({
      message: 'Events fetched successfully',
      events: eventsWithOwners.length > 0 ? eventsWithOwners : events, // Return all even if some missing owners
    });
  } catch (err) {
    console.error('Get events error:', err);
    res.status(500).json({ message: 'Server error' });
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

    // ownership check
    if (event.owner.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: 'Not allowed to edit this event' });
    }

    const { title, description, date, location, capacity, category, time, eventType, meetingPlatform, meetingLink, meetingPassword } = req.body;

    if (title !== undefined) event.title = title;
    if (description !== undefined) event.description = description;
    if (date !== undefined) event.date = date;
    if (capacity !== undefined) event.capacity = capacity;
    if (category !== undefined) event.category = category;
    if (time !== undefined) event.time = time;

    // Handle event type changes
    if (eventType !== undefined) {
      if (!['online', 'offline'].includes(eventType)) {
        return res.status(400).json({ message: 'Invalid event type' });
      }
      event.eventType = eventType;

      // Clear opposite type fields
      if (eventType === 'offline') {
        event.meetingPlatform = undefined;
        event.meetingLink = undefined;
        event.meetingPassword = undefined;
        if (location !== undefined) {
          event.location = location;
        }
      } else {
        event.location = undefined;
        if (meetingPlatform !== undefined) event.meetingPlatform = meetingPlatform;
        if (meetingLink !== undefined) event.meetingLink = meetingLink;
        if (meetingPassword !== undefined) event.meetingPassword = meetingPassword;
      }
    } else {
      // Update only the relevant fields based on current event type
      if (event.eventType === 'offline' && location !== undefined) {
        event.location = location;
      } else if (event.eventType === 'online') {
        if (meetingPlatform !== undefined) event.meetingPlatform = meetingPlatform;
        if (meetingLink !== undefined) event.meetingLink = meetingLink;
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

    // Populate and return full event data
    const updatedEvent = await event.populate('owner', 'name email _id').populate('rsvps', 'name email _id');

    return res.json({ message: 'Event updated', event: updatedEvent });
  } catch (err) {
    console.error('Update event error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

// DELETE EVENT (only owner)
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

    await event.deleteOne();
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





