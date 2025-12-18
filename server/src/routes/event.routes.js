const express = require('express');
const router = express.Router();
const multer = require('multer');

const eventController = require('../controllers/event.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const upload = multer({
    storage: multer.memoryStorage()
});

router.post('/create', 
    authMiddleware.authenticateToken, 
    upload.single('eventImage'), 
    eventController.createEvent); // post /api/event

router.get('/', 
    authMiddleware.authenticateToken,
    eventController.getEvents);

module.exports = router;