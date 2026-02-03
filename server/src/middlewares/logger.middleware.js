const winston = require('winston');
const path = require('path');

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'event-platform' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
        })
      )
    }),
    
    new winston.transports.File({ 
      filename: path.join(__dirname, '../../logs/error.log'), 
      level: 'error',
      maxsize: 5242880, 
      maxFiles: 5,
    }),
    
    new winston.transports.File({ 
      filename: path.join(__dirname, '../../logs/combined.log'),
      maxsize: 5242880, 
      maxFiles: 5,
    })
  ]
});

const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  
  logger.info('Incoming request', {
    method: req.method,
    url: req.url,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('user-agent')
  });

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logLevel = res.statusCode >= 400 ? 'warn' : 'info';
    
    logger[logLevel]('Request completed', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip || req.connection.remoteAddress
    });
  });

  next();
};

const logSecurityEvent = (event, details) => {
  logger.warn('Security event', {
    event,
    ...details,
    timestamp: new Date().toISOString()
  });
};

const logAuthEvent = (event, userId, details = {}) => {
  logger.info('Authentication event', {
    event,
    userId,
    ...details,
    timestamp: new Date().toISOString()
  });
};

const logError = (error, req = null) => {
  logger.error('Application error', {
    message: error.message,
    stack: error.stack,
    url: req ? req.url : null,
    method: req ? req.method : null,
    ip: req ? (req.ip || req.connection.remoteAddress) : null
  });
};

module.exports = {
  logger,
  requestLogger,
  logSecurityEvent,
  logAuthEvent,
  logError
};
