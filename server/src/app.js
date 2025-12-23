const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const eventRoutes = require('./routes/event.routes');

const app = express();

app.use(express.json());
app.use(cookieParser());
// Configure CORS to allow the configured client URL, localhost and Vercel deployments
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({
    origin: (origin, callback) => {
        // Allow non-browser requests like curl/postman (no origin)
        if (!origin) return callback(null, true);

        try {
            // quick allow if matches configured client URL exactly
            if (origin === clientUrl) return callback(null, true);

            // normalize host and allow both http/https localhost
            if (origin.startsWith('http://localhost') || origin.startsWith('https://localhost') || origin.startsWith('http://127.0.0.1') || origin.startsWith('https://127.0.0.1')) {
                return callback(null, true);
            }

            // If the origin belongs to vercel.app (any preview/production), allow it
            if (origin.includes('.vercel.app') || origin.includes('vercel.app')) return callback(null, true);

            // Deny others
            return callback(new Error('Not allowed by CORS'));
        } catch (err) {
            return callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
}));

app.get('/', (req, res) => {
    res.send('Hello, World!');
})

app.use('/auth', authRoutes);
app.use('/event', eventRoutes);

module.exports = app;