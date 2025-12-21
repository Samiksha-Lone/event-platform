const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

router.post('/register', authController.registerUser); 
router.post('/login', authController.loginUser);
router.get('/logout', authController.logoutUser);

router.get('/me', authenticateToken, authController.getMe);

router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);

module.exports = router;