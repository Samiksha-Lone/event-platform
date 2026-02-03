const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { authLimiter, passwordResetLimiter } = require('../middlewares/rate-limiter.middleware');
const { 
  validateRegister, 
  validateLogin, 
  validateForgotPassword, 
  validateResetPassword 
} = require('../middlewares/validation.middleware');

router.post('/register', authLimiter, validateRegister, authController.registerUser); 
router.post('/login', authLimiter, validateLogin, authController.loginUser);
router.get('/logout', authController.logoutUser);

router.get('/me', authenticateToken, authController.getMe);

router.post('/forgot-password', passwordResetLimiter, validateForgotPassword, authController.forgotPassword);
router.post('/reset-password/:token', passwordResetLimiter, validateResetPassword, authController.resetPassword);

module.exports = router;