const { body, param, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: 'Validation failed', 
      errors: errors.array() 
    });
  }
  next();
};

const validateRegister = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain uppercase, lowercase, and number'),
  handleValidationErrors
];

const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required'),
  handleValidationErrors
];

const validateForgotPassword = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  handleValidationErrors
];

const validateResetPassword = [
  param('token')
    .notEmpty().withMessage('Reset token is required'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain uppercase, lowercase, and number'),
  handleValidationErrors
];

const validateCreateEvent = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3, max: 100 }).withMessage('Title must be 3-100 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 10, max: 2000 }).withMessage('Description must be 10-2000 characters'),
  body('category')
    .notEmpty().withMessage('Category is required')
    .isIn(['tech', 'music', 'sports', 'food', 'other']).withMessage('Invalid category'),
  body('eventType')
    .notEmpty().withMessage('Event type is required')
    .isIn(['online', 'offline']).withMessage('Event type must be online or offline'),
  body('date')
    .notEmpty().withMessage('Date is required')
    .isISO8601().withMessage('Invalid date format')
    .custom((value) => {
      if (new Date(value) < new Date()) {
        throw new Error('Event date must be in the future');
      }
      return true;
    }),
  body('time')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid time format (HH:MM)'),
  body('capacity')
    .notEmpty().withMessage('Capacity is required')
    .isInt({ min: 1, max: 10000 }).withMessage('Capacity must be between 1 and 10000'),
  body('location')
    .if(body('eventType').equals('offline'))
    .notEmpty().withMessage('Location is required for offline events')
    .isLength({ min: 3, max: 200 }).withMessage('Location must be 3-200 characters'),
  body('meetingPlatform')
    .if(body('eventType').equals('online'))
    .notEmpty().withMessage('Meeting platform is required for online events')
    .isIn(['zoom', 'google-meet', 'microsoft-teams', 'webex', 'other']).withMessage('Invalid meeting platform'),
  body('meetingLink')
    .if(body('eventType').equals('online'))
    .notEmpty().withMessage('Meeting link is required for online events')
    .isURL().withMessage('Invalid meeting link URL'),
  body('meetingPassword')
    .optional()
    .isLength({ max: 50 }).withMessage('Meeting password too long'),
  handleValidationErrors
];

const validateUpdateEvent = [
  param('id')
    .notEmpty().withMessage('Event ID is required')
    .isMongoId().withMessage('Invalid event ID'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 }).withMessage('Title must be 3-100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 }).withMessage('Description must be 10-2000 characters'),
  body('category')
    .optional()
    .isIn(['tech', 'music', 'sports', 'food', 'other']).withMessage('Invalid category'),
  body('eventType')
    .optional()
    .isIn(['online', 'offline']).withMessage('Event type must be online or offline'),
  body('date')
    .optional()
    .isISO8601().withMessage('Invalid date format'),
  body('capacity')
    .optional()
    .isInt({ min: 1, max: 10000 }).withMessage('Capacity must be between 1 and 10000'),
  handleValidationErrors
];

const validateEventId = [
  param('id')
    .notEmpty().withMessage('Event ID is required')
    .isMongoId().withMessage('Invalid event ID'),
  handleValidationErrors
];

const validate2FAToken = [
  body('token')
    .notEmpty().withMessage('2FA token is required')
    .isLength({ min: 6, max: 6 }).withMessage('2FA token must be 6 digits')
    .isNumeric().withMessage('2FA token must be numeric'),
  handleValidationErrors
];

module.exports = {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validateCreateEvent,
  validateUpdateEvent,
  validateEventId,
  validate2FAToken,
  handleValidationErrors
};
