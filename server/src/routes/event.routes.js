const express = require('express');
const router = express.Router();
const multer = require('multer');

const eventController = require('../controllers/event.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const upload = multer({
    storage: multer.memoryStorage()
});

// CREATE EVENT
router.post('/create', 
    authMiddleware.authenticateToken, 
    upload.single('image'), 
    eventController.createEvent); // post /api/event

// GET ALL EVENTS
router.get('/', 
    // authMiddleware.authenticateToken,
    eventController.getEvents);

// GET SINGLE EVENT BY ID
router.get('/:id',
    // authMiddleware.authenticateToken,
    eventController.getEventById);

// RSVP JOIN
router.post(
  '/:id/rsvp',
  authMiddleware.authenticateToken,
  eventController.rsvpEvent
);

// RSVP LEAVE
router.delete(
  '/:id/rsvp',
  authMiddleware.authenticateToken,
  eventController.unrsvpEvent
);

// UPDATE EVENT (only owner)
router.put(
  '/:id',
  authMiddleware.authenticateToken,
  upload.single('eventImage'),
  eventController.updateEvent
);

// DELETE EVENT (only owner)
router.delete(
  '/:id',
  authMiddleware.authenticateToken,
  eventController.deleteEvent
);

module.exports = router;