const {v4: uuid} = require("uuid");

const eventModel = require("../models/event.model");
const storageService = require("../services/storage.service");

async function createEvent(req, res) {

    const {title, description, date, location, capacity, image} = req.body;

    // Replace req.file.buffer with safe access
    const imageBuffer = req.file ? req.file.buffer : null;
    if (!imageBuffer) {
        return res.status(400).json({ message: 'Image required' });
    }

    const fileUploadResult = await storageService.uploadFile(imageBuffer, uuid())

    const newEvent = await eventModel.create({
        title,
        description,
        date,
        location,
        capacity,
        image: fileUploadResult.url,
        owner: req.user._id
    })

    res.status(201).json({
        message: "Event created successfully",
        event: newEvent
    });

}

async function getEvents(req, res) {
    const events = await eventModel.find({});
    res.status(200).json({
        message: "Events fetched successfully",
        events: events
    });
}

async function getEventById(req, res) {
    try {
        const { id } = req.params;
        const event = await eventModel.findById(id).populate('owner', 'name email').populate('rsvps', 'name email');
        
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        
        res.status(200).json({
            message: "Event fetched successfully",
            event: event
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

// RSVP JOIN
async function rsvpEvent(req, res) {
  try {
    const userId = req.user._id; // from auth middleware
    const eventId = req.params.id;

    const updatedEvent = await eventModel
      .findOneAndUpdate(
        {
          _id: eventId,
          // capacity not exceeded
          $expr: { $lt: [{ $size: "$rsvps" }, "$capacity"] },
          // user not already in rsvps
          rsvps: { $ne: userId },
        },
        { $addToSet: { rsvps: userId } }, // avoid duplicates
        { new: true }
      )
      .populate("owner", "name email")
      .populate("rsvps", "name email");

    if (!updatedEvent) {
      return res
        .status(400)
        .json({ message: "Event is full or you already joined" });
    }

    res.json({ message: "RSVP successful", event: updatedEvent });
  } catch (err) {
    console.error("RSVP error:", err);
    res.status(500).json({ message: "Server error" });
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
      .populate("owner", "name email")
      .populate("rsvps", "name email");

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ message: "RSVP cancelled", event: updatedEvent });
  } catch (err) {
    console.error("Un-RSVP error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

// UPDATE EVENT (only owner)
async function updateEvent(req, res) {
  try {
    const eventId = req.params.id;
    const userId = req.user._id;

    const event = await eventModel.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.owner.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Not allowed to edit this event" });
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

    res.json({ message: "Event updated", event });
  } catch (err) {
    console.error("Update event error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

// DELETE EVENT (only owner)
async function deleteEvent(req, res) {
  try {
    const eventId = req.params.id;
    const userId = req.user._id;

    const event = await eventModel.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.owner.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Not allowed to delete this event" });
    }

    await event.deleteOne();
    res.json({ message: "Event deleted" });
  } catch (err) {
    console.error("Delete event error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
    createEvent,
    getEvents,
    getEventById,
    rsvpEvent,
    unrsvpEvent,
    updateEvent,
    deleteEvent
}