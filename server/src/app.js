const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');

const authRoutes = require('./routes/auth.routes');
const eventRoutes = require('./routes/event.routes');
const { apiLimiter } = require('./middlewares/rate-limiter.middleware');
const { requestLogger } = require('./middlewares/logger.middleware');

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173', 
];

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    }
  },
  crossOriginEmbedderPolicy: false,
}));

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.some(allowed => allowed instanceof RegExp ? allowed.test(origin) : origin === allowed)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(requestLogger);

app.use(apiLimiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('Hello, World!');
})

app.use('/auth', authRoutes);
app.use('/event', eventRoutes);

const twoFARoutes = require('./routes/2fa.routes');
app.use('/2fa', twoFARoutes);

const reviewRoutes = require('./routes/review.routes');
app.use('/review', reviewRoutes);

const userRoutes = require('./routes/user.routes');
app.use('/user', userRoutes);

const apiRoutes = require('./routes/api.routes');
app.use('/api', apiRoutes);

module.exports = app;