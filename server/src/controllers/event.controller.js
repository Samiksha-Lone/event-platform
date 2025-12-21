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
      location, 
      imageUrl 
    } = req.body;

    // Validation - all required fields
    if (!title || !description || !category || !capacity || !date || !time || !location) {
      return res.status(400).json({ message: 'Missing required fields' });
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
    const newEvent = await eventModel.create({
      title,
      description,
      category,
      capacity: parseInt(capacity),
      date,
      time,
      location,
      image,
      owner: req.user._id,
    });

    res.status(201).json({
      message: 'Event created successfully',
      event: newEvent,
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
      .populate('owner', 'name email')
      .populate('rsvps', 'name email');

    res.status(200).json({
      message: 'Events fetched successfully',
      events,
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
      .populate('owner', 'name email')
      .populate('rsvps', 'name email');

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

    const updatedEvent = await eventModel
      .findOneAndUpdate(
        {
          _id: eventId,
          $expr: { $lt: [{ $size: '$rsvps' }, '$capacity'] },
          rsvps: { $ne: userId },
        },
        { $addToSet: { rsvps: userId } },
        { new: true }
      )
      .populate('owner', 'name email')
      .populate('rsvps', 'name email');

    if (!updatedEvent) {
      return res
        .status(400)
        .json({ message: 'Event is full or you already joined' });
    }

    res.json({ message: 'RSVP successful', event: updatedEvent });
  } catch (err) {
    console.error('RSVP error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// RSVP LEAVE
async function unrsvpEvent(req, res) {
  try {
    const userId = req.user._id;
    const eventId = req.params.id;

    const updatedEvent = await eventModel
      .findOneAndUpdate(
        { _id: eventId },
        { $pull: { rsvps: userId } },
        { new: true }
      )
      .populate('owner', 'name email')
      .populate('rsvps', 'name email');

    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ message: 'RSVP cancelled', event: updatedEvent });
  } catch (err) {
    console.error('Un-RSVP error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// UPDATE EVENT (only owner)
// async function updateEvent(req, res) {
//   try {
//     const eventId = req.params.id;
//     const userId = req.user._id;

//     const event = await eventModel.findById(eventId);
//     if (!event) return res.status(404).json({ message: 'Event not found' });

//     if (event.owner.toString() !== userId.toString()) {
//       return res
//         .status(403)
//         .json({ message: 'Not allowed to edit this event' });
//     }

//     const { title, description, date, location, capacity } = req.body;

//     if (title !== undefined) event.title = title;
//     if (description !== undefined) event.description = description;
//     if (date !== undefined) event.date = date;
//     if (location !== undefined) event.location = location;
//     if (capacity !== undefined) event.capacity = capacity;

//     if (req.file) {
//       const fileUploadResult = await storageService.uploadFile(
//         req.file.buffer,
//         uuid()
//       );
//       event.image = fileUploadResult.url;
//     }

//     await event.save();

//     res.json({ message: 'Event updated', event });
//   } catch (err) {
//     console.error('Update event error:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// }

// async function updateEvent(req, res) {
//   try {
//     console.log('updateEvent called');
//     console.log('params:', req.params);
//     console.log('user on req:', req.user);
//     console.log('body:', req.body);

//     const eventId = req.params.id;
//     const userId = req.user?._id;

//     if (!eventId) {
//       console.log('Missing eventId in params');
//       return res.status(400).json({ message: 'Event ID is required' });
//     }

//     if (!userId) {
//       console.log('Missing user on request (auth middleware)');
//       return res.status(401).json({ message: 'Unauthorized' });
//     }

//     const event = await eventModel.findById(eventId);
//     console.log('Loaded event:', event);

//     if (!event) {
//       console.log('Event not found for id:', eventId);
//       return res.status(404).json({ message: 'Event not found' });
//     }

//     if (!event.owner) {
//       console.log('Event has no owner field');
//       return res.status(500).json({ message: 'Event owner missing' });
//     }

//     // ownership check
//     if (event.owner.toString() !== userId.toString()) {
//       console.log(
//         'Owner mismatch:',
//         'event.owner =', event.owner.toString(),
//         'userId =', userId.toString()
//       );
//       return res
//         .status(403)
//         .json({ message: 'Not allowed to edit this event' });
//     }

//     const { title, description, date, location, capacity } = req.body;

//     if (title !== undefined) event.title = title;
//     if (description !== undefined) event.description = description;
//     if (date !== undefined) event.date = date;
//     if (location !== undefined) event.location = location;
//     if (capacity !== undefined) event.capacity = capacity;

//     if (req.file) {
//       console.log('Updating image for event');
//       const fileUploadResult = await storageService.uploadFile(
//         req.file.buffer,
//         uuid()
//       );
//       console.log('File upload result:', fileUploadResult);
//       event.image = fileUploadResult.url;
//     }

//     await event.save();
//     console.log('Event updated successfully');

//     return res.json({ message: 'Event updated', event });
//   } catch (err) {
//     console.error('Update event error:', err);
//     return res.status(500).json({ message: 'Server error' });
//   }
// }

async function updateEvent(req, res) {
  try {
    console.log('updateEvent called');
    console.log('params:', req.params);
    console.log('user on req:', req.user);
    console.log('body:', req.body);

    const eventId = req.params.id;
    const userId = req.user?.id;          // <-- use id, not _id

    if (!eventId) {
      console.log('Missing eventId in params');
      return res.status(400).json({ message: 'Event ID is required' });
    }

    if (!userId) {
      console.log('Missing user on request (auth middleware)');
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const event = await eventModel.findById(eventId);
    console.log('Loaded event:', event);

    if (!event) {
      console.log('Event not found for id:', eventId);
      return res.status(404).json({ message: 'Event not found' });
    }

    if (!event.owner) {
      console.log('Event has no owner field');
      return res.status(500).json({ message: 'Event owner missing' });
    }

    // ownership check
    if (event.owner.toString() !== userId.toString()) {
      console.log(
        'Owner mismatch:',
        'event.owner =', event.owner.toString(),
        'userId =', userId.toString()
      );
      return res
        .status(403)
        .json({ message: 'Not allowed to edit this event' });
    }

    const { title, description, date, location, capacity } = req.body;

    if (title !== undefined) event.title = title;
    if (description !== undefined) event.description = description;
    if (date !== undefined) event.date = date;
    if (location !== undefined) event.location = location;
    if (capacity !== undefined) event.capacity = capacity;

    if (req.file) {
      const fileUploadResult = await storageService.uploadFile(
        req.file.buffer,
        uuid()
      );
      event.image = fileUploadResult.url;
    }

    await event.save();

    return res.json({ message: 'Event updated', event });
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





