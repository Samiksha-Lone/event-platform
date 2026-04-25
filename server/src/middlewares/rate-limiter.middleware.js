const rateLimit = require('express-rate-limit');

// Skip rate limiting for localhost in development
const skipLocalhost = (req) => {
  const isDev = process.env.NODE_ENV !== 'production';
  const isLocalhost = req.ip === '127.0.0.1' || req.ip === '::1' || req.hostname === 'localhost';
  return isDev && isLocalhost;
};

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000, // Increased for development
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipLocalhost,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50, // Increased for development 
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  skip: skipLocalhost,
});

const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10, // Increased for development
  message: 'Too many password reset attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipLocalhost,
});

const createEventLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 50, // Increased for development
  message: 'Too many events created, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipLocalhost,
});

module.exports = {
  apiLimiter,
  authLimiter,
  passwordResetLimiter,
  createEventLimiter
};
