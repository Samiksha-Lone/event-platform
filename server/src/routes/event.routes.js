const express = require('express');
const router = express.Router();
const multer = require('multer');

const eventController = require('../controllers/event.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { createEventLimiter } = require('../middlewares/rate-limiter.middleware');
const { 
  validateCreateEvent, 
  validateUpdateEvent, 
  validateEventId 
} = require('../middlewares/validation.middleware');

const upload = multer({
    storage: multer.memoryStorage()
});

router.post('/create', 
    authMiddleware.authenticateToken,
    createEventLimiter,
    upload.single('image'),
    eventController.createEvent); 

router.get('/', 
    eventController.getEvents);

router.get('/:id',
    validateEventId,
    eventController.getEventById);

router.post(
  '/:id/rsvp',
  authMiddleware.authenticateToken,
  validateEventId,
  eventController.rsvpEvent
);
router.delete(
  '/:id/rsvp',
  authMiddleware.authenticateToken,
  validateEventId,
  eventController.unrsvpEvent
);

router.put(
  '/:id',
  authMiddleware.authenticateToken,
  upload.single('image'),
  validateUpdateEvent,
  eventController.updateEvent
);

router.delete(
  '/:id',
  authMiddleware.authenticateToken,
  validateEventId,
  eventController.deleteEvent
);

module.exports = router;