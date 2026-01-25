const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const eventRoutes = require('./routes/event.routes');

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173', 
];

// Apply CORS before other middleware
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

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('Hello, World!');
})

app.use('/auth', authRoutes);
app.use('/event', eventRoutes);

module.exports = app;