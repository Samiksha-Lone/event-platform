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

module.exports = {
    createEvent,
    getEvents
}