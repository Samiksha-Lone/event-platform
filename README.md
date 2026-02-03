# EventHub – MERN Event Platform

EventHub is a full-stack event management platform built with the MERN stack (MongoDB, Express, React, Node.js). It lets authenticated users create and manage events, browse all upcoming events, and RSVP to events while enforcing capacity and authentication rules.

**Live Demo:** https://eventhub-eight.vercel.app/
**Repository:** [GitHub](https://github.com/Samiksha-Lone/event-platform)

---

## ✨ Features

### User Authentication
- Email/password registration and login using JWT-based authentication
- Secure password hashing with bcrypt
- Protected API routes for authenticated actions
- Session persistence with cookies
- Password reset via email link

### Event Management
- Create, read, update, and delete events
- Event fields: title, description, date, time, location, category, capacity, and image
- Only the event owner can edit or delete their events
- Category filtering (tech, music, sports, food, other)
- Image upload with automatic optimization

### RSVP System
- Join and leave events with a single click
- Capacity enforcement: users cannot RSVP if the event is full
- Real-time RSVP count updates
- Users can only RSVP once per event
- Cancel RSVP at any time

### User Dashboard
- View events created by the logged-in user
- View events the user has joined via RSVP
- Quick actions to edit events or cancel RSVPs
- Organized by "My Events" and "Events I Joined" tabs

### Password Management
- Forgot-password page to request a reset link
- Secure reset-password page with token verification
- Strong password rules with visual strength meter
- Email verification for password resets

### Two-Factor Authentication (2FA)
- QR code-based 2FA setup using authenticator apps
- Enable/disable 2FA with token verification
- Secure OTP validation using Speakeasy
- One-time passwords for enhanced security

### Event Reviews & Ratings
- Create, read, update, and delete reviews for events
- Rate events with helpful feedback
- Mark reviews as helpful
- View aggregated reviews and ratings

### Advanced Search & Filtering
- Search events by title and description
- Filter by multiple categories (tech, music, sports, food, health, education, workshop, social)
- Get available filter options
- Real-time search results

### Recommendations Engine
- Personalized event recommendations based on user preferences
- Trending events discovery
- Smart suggestions based on interest categories
- User preference-based filtering

### User Preferences & Profiles
- Customizable user profiles with preferences
- Interest categories selection
- Email and push notification settings
- Privacy controls
- User follow/unfollow functionality

### Analytics Dashboard
- Organizer-specific analytics (event performance, attendee insights)
- Event-level analytics (RSVP trends, demographics)
- Performance metrics and insights
- Data visualization for event creators

### UI/UX
- Fully responsive React interface built with Tailwind CSS
- Dark mode support with theme toggle
- Clean event cards with visual capacity indicators
- Real-time toast notifications for feedback
- Skeleton loaders for better UX
- Mobile-optimized layout
- AI-powered event description generation
- AI-powered event poster generation

---

## 🏗️ Tech Stack

### Frontend
- **React 18** with Hooks for component state management
- **Vite** for fast development and optimized builds
- **React Router DOM** for client-side routing
- **Axios** for API communication with credentials support
- **Tailwind CSS** for responsive styling
- **Context API** for global state (Auth, Events, Theme, Toast)
- **Error Boundaries** for graceful error handling

### Backend
- **Node.js** runtime (v18+)
- **Express.js** (v5.2) for HTTP server and middleware
- **MongoDB** with Mongoose ODM for data persistence
- **JSON Web Tokens (JWT)** for stateless authentication
- **bcryptjs** for secure password hashing
- **Multer** for file uploads
- **CORS** middleware for cross-origin requests
- **dotenv** for environment configuration
- **Nodemon** for development auto-reload
- **Helmet.js** for security HTTP headers
- **Express Rate Limiter** for API rate limiting
- **Express Validator** for input validation
- **Express Mongo Sanitize** for NoSQL injection prevention
- **Winston** for structured logging
- **Speakeasy** for Two-Factor Authentication (2FA)
- **QR Code** for generating 2FA QR codes
- **Redis/IORedis** for caching and session management
- **CSRF** (csurf) middleware for CSRF protection
- **UUID** for unique identifier generation

### Infrastructure & Services
- **MongoDB Atlas** for cloud database (optional: local MongoDB)
- **ImageKit** for image optimization and CDN (v6.0)
- **SendGrid Mail** for transactional emails
- **Nodemailer** for SMTP email configuration
- **Redis** for caching, sessions, and real-time features
- **Email service** for password reset and notifications (SMTP + SendGrid)
- **CORS** enabled for frontend-backend communication

---

## 📂 Project Structure

```
event-platform/
├── client/                           # React Frontend
│   ├── public/
│   │   └── manifest.json
│   ├── src/
│   │   ├── components/               # Reusable UI components
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── EventCard.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ErrorBoundary.jsx
│   │   │   ├── Skeleton.jsx
│   │   │   ├── AiPosterModal.jsx
│   │   │   └── AiDescriptionModal.jsx
│   │   ├── pages/                    # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── EventDetails.jsx
│   │   │   ├── CreateEvent.jsx
│   │   │   ├── EditEvent.jsx
│   │   │   ├── UserDashboard.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   └── NotFound.jsx
│   │   ├── context/                  # Global state management
│   │   │   ├── AuthContext.jsx
│   │   │   ├── EventContext.jsx
│   │   │   ├── ThemeContext.jsx
│   │   │   ├── ToastContext.jsx
│   │   │   └── AppProvider.jsx
│   │   ├── hooks/                    # Custom React hooks
│   │   │   ├── useEvents.js
│   │   │   └── useKeyboardShortcuts.js
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx         # Route definitions
│   │   ├── utils/                    # Helper functions
│   │   │   ├── api.js
│   │   │   ├── validation.js
│   │   │   └── rsvpHelper.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── eslint.config.js
│   └── .gitignore
│
├── server/                           # Node/Express Backend
│   ├── src/
│   │   ├── controllers/              # Business logic
│   │   │   ├── auth.controller.js    # Authentication logic
│   │   │   ├── event.controller.js   # Event management
│   │   │   ├── 2fa.controller.js     # Two-factor authentication
│   │   │   ├── review.controller.js  # Event reviews
│   │   │   ├── user.controller.js    # User profiles & preferences
│   │   │   ├── search.controller.js  # Search & filtering
│   │   │   └── analytics.controller.js # Analytics & insights
│   │   ├── middlewares/              # Express middlewares
│   │   │   ├── auth.middleware.js    # JWT verification
│   │   │   ├── rate-limiter.middleware.js # Rate limiting
│   │   │   ├── csrf.middleware.js    # CSRF protection
│   │   │   ├── logger.middleware.js  # Request logging
│   │   │   └── validation.middleware.js # Input validation
│   │   ├── models/                   # Mongoose schemas
│   │   │   ├── user.model.js         # User schema
│   │   │   ├── event.model.js        # Event schema
│   │   │   ├── review.model.js       # Review schema
│   │   │   └── userPreferences.model.js # User preferences
│   │   ├── routes/                   # API endpoints
│   │   │   ├── auth.routes.js        # Auth endpoints
│   │   │   ├── event.routes.js       # Event endpoints
│   │   │   ├── 2fa.routes.js         # 2FA endpoints
│   │   │   ├── review.routes.js      # Review endpoints
│   │   │   ├── user.routes.js        # User endpoints
│   │   │   └── api.routes.js         # Search, recommendations, analytics
│   │   ├── services/                 # Utility services
│   │   │   ├── storage.service.js    # Image uploads (ImageKit)
│   │   │   ├── email.service.js      # Email notifications
│   │   │   ├── cache.service.js      # Redis caching
│   │   │   └── recommendation.service.js # Recommendation engine
│   │   ├── utils/
│   │   │   └── mailer.js             # Email sender (SMTP & SendGrid)
│   │   ├── db/
│   │   │   └── db.js                 # MongoDB connection
│   │   └── app.js                    # Express app setup
│   ├── logs/                         # Application logs
│   ├── server.js                     # Server entry point
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
├── .gitignore                        # Root gitignore
├── README.md                         # This file
└── package.json                      # Root package.json (optional)
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (Atlas account or local instance)
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/Samiksha-Lone/event-platform.git
cd event-platform
```

### 2. Backend Setup

Navigate to the server directory:

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/event-platform

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_here_change_this

# Client URL (for CORS and redirects)
CLIENT_URL=http://localhost:5173

# Email Configuration (SMTP for password reset)
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# SendGrid Email Service (Alternative to SMTP)
SENDGRID_API_KEY=your_sendgrid_api_key

# Image Upload (ImageKit)
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_endpoint

# Redis Configuration (for caching and sessions)
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=your_redis_password

# Logging
LOG_LEVEL=info
```

Start the backend server:

```bash
npm run dev    # Development with nodemon
# or
npm start      # Production
```

The backend will be running at `http://localhost:3000`

### 3. Frontend Setup

Open a new terminal and navigate to the client directory:

```bash
cd client
npm install
```

Create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:3000
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

---

## 🔐 Authentication & Authorization

### How It Works
1. Users register with email and password
2. Password is hashed using bcrypt before storage
3. On login, JWT token is generated and stored in an HTTP-only cookie
4. Token is automatically sent with all authenticated requests
5. Backend middleware validates token and attaches user to request object
6. Optional 2FA via QR code and authenticator apps

### Security Features
- JWT-based stateless authentication
- HTTP-only cookies for XSS protection
- Rate limiting on all API endpoints
- CSRF protection on state-changing requests
- Input validation and sanitization
- NoSQL injection prevention
- Security headers via Helmet.js
- Password strength requirements
- Token expiration and refresh

---

## 📅 Core User Flows

### 1. Browse & Discover Events
- Open the dashboard to view all upcoming events
- Search events by title, description, or keywords
- Filter by multiple categories (tech, music, sports, food, health, education, workshop, social)
- View trending events
- Get personalized recommendations based on your interests
- View detailed event information on event details page
- See available spots and event capacity

### 2. Create and Manage Events
- Authenticate to access event creation
- Fill in event details: title, description, date, time, location, category, capacity
- Use AI-powered event description generator (optional)
- Use AI-powered event poster generator (optional)
- Upload event image
- Edit event details (only as owner)
- Delete event (only as owner)
- View analytics for your events (attendance, RSVP trends, demographics)
- View all events you've created in user dashboard

### 3. RSVP to Events
- Browse events and view details
- Click "RSVP Now" to join an event
- System checks capacity before confirming
- View list of attendees
- Cancel RSVP anytime to free up a spot
- View all events you've joined in user dashboard

### 4. Event Reviews & Ratings
- Leave reviews and ratings on events you've attended
- View reviews from other attendees
- Mark helpful reviews
- Update your review if needed
- Delete your review
- See aggregated ratings on event details page

### 5. User Profile & Preferences
- Create and customize your user profile
- Set interest categories for event recommendations
- Configure notification preferences (email, push)
- Manage privacy settings
- Follow other users
- View your event history

### 6. Two-Factor Authentication (2FA)
- Enable 2FA from account settings
- Scan QR code with authenticator app (Google Authenticator, Authy, etc.)
- Verify setup with generated token
- Use 2FA on future logins for enhanced security
- Disable 2FA if needed

### 7. Password Recovery
- Click "Forgot Password" on login page
- Enter your email address
- Receive reset link via email
- Click link (valid for 1 hour)
- Set new password with strength requirements
- Login with new password

---

## 🛠️ API Documentation

### Authentication Endpoints
```
POST   /auth/register           - Register new user
POST   /auth/login              - Login user (with 2FA support)
POST   /auth/logout             - Logout user
GET    /auth/me                 - Get current user
POST   /auth/forgot-password    - Request password reset
POST   /auth/reset-password     - Reset password with token
```

### Two-Factor Authentication (2FA) Endpoints
```
POST   /2fa/setup               - Generate 2FA QR code (protected)
POST   /2fa/enable              - Enable 2FA with verification (protected)
POST   /2fa/disable             - Disable 2FA (protected)
```

### Event Endpoints
```
GET    /event                   - Get all events with pagination (public)
GET    /event/:id               - Get single event details (public)
POST   /event/create            - Create new event (protected)
PUT    /event/:id               - Update event (protected, owner only)
DELETE /event/:id               - Delete event (protected, owner only)
POST   /event/:id/rsvp          - Join event (protected)
DELETE /event/:id/rsvp          - Leave event (protected)
GET    /event/:id/attendees     - Get event attendees (public)
```

### Review Endpoints
```
POST   /review/event/:eventId   - Create review (protected)
GET    /review/event/:eventId   - Get event reviews (public)
PUT    /review/:reviewId        - Update review (protected, author only)
DELETE /review/:reviewId        - Delete review (protected, author only)
POST   /review/:reviewId/helpful - Mark review as helpful (protected)
```

### User Profile & Preferences Endpoints
```
GET    /user/profile/:userId    - Get user profile (public)
PUT    /user/profile            - Update user profile (protected)
GET    /user/preferences        - Get user preferences (protected)
PUT    /user/preferences        - Update user preferences (protected)
POST   /user/follow/:userId     - Follow a user (protected)
DELETE /user/follow/:userId     - Unfollow a user (protected)
```

### Search & Discovery Endpoints
```
GET    /api/search              - Search events by title/description
GET    /api/filters             - Get available filter options
GET    /api/recommendations     - Get personalized recommendations (protected)
GET    /api/trending            - Get trending events
```

### Analytics Endpoints
```
GET    /api/analytics/organizer - Get organizer analytics (protected)
GET    /api/analytics/event/:eventId - Get event analytics (protected, owner only)
```

---

## 🐛 Troubleshooting

### Backend Issues

**Port already in use**
```bash
# Find process using port 3000
lsof -i :3000
# Kill process
kill -9 <PID>
```

**MongoDB connection error**
- Verify `MONGO_URI` in `.env`
- Check MongoDB Atlas IP whitelist
- Ensure credentials are correct

**JWT token issues**
- Clear browser cookies
- Logout and login again
- Check `JWT_SECRET` is set correctly
- Verify token hasn't expired

**2FA issues**
- Ensure authenticator app is synced with correct time
- Regenerate QR code and re-scan if needed
- Check backup codes if available

**Redis connection error**
- Verify Redis server is running
- Check `REDIS_URL` in `.env`
- Ensure Redis credentials are correct

**Rate limiting errors (429 responses)**
- Wait for rate limit window to reset (typically 15 minutes)
- Check API rate limit configuration in `.env`

### Frontend Issues

**API calls failing**
- Verify `VITE_API_URL` in `.env`
- Check backend is running on correct port
- Clear browser cache and cookies
- Open DevTools Network tab to debug

**Build issues**
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## 📝 Environment Variables Reference

### Server (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` or `production` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret for JWT signing | `your-super-secret-key-min-32-chars` |
| `CLIENT_URL` | Frontend URL | `http://localhost:5173` |
| `SMTP_USER` | Email for password resets (SMTP) | `email@gmail.com` |
| `SMTP_PASS` | App password for SMTP | `xxxx xxxx xxxx xxxx` |
| `SENDGRID_API_KEY` | SendGrid API key (alternative to SMTP) | `SG.xxxxxxxxxxxxx` |
| `IMAGEKIT_PUBLIC_KEY` | ImageKit public key | `your_public_key` |
| `IMAGEKIT_PRIVATE_KEY` | ImageKit private key | `your_private_key` |
| `IMAGEKIT_URL_ENDPOINT` | ImageKit URL endpoint | `https://ik.imagekit.io/endpoint` |
| `REDIS_URL` | Redis connection URL | `redis://localhost:6379` |
| `REDIS_PASSWORD` | Redis password (if required) | `your_redis_password` |
| `LOG_LEVEL` | Logging level | `info` or `debug` or `error` |

### Client (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:3000` |

---

## 🚀 Deployment

### Frontend (Vercel)
```bash
npm install -g vercel
vercel login
vercel deploy
```

### Backend (Render/Railway)
1. Create account on Render or Railway
2. Connect GitHub repository
3. Set environment variables
4. Deploy

---

## 📄 License

This project is open source and available under the MIT License.

---

## 👨‍💻 Author

**Samiksha Lone**

- Email: [samikshalone2@gmail.com](mailto:samikshalone2@gmail.com)
- GitHub: [@Samiksha-Lone](https://github.com/Samiksha-Lone)
- LinkedIn: [Samiksha Lone](https://linkedin.com/in/samiksha-lone)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and enhancement requests.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📞 Support

For support, please open an issue on GitHub or reach out via email.

---

## 🔄 Recent Features (Latest)

- **Two-Factor Authentication (2FA)** - Enhanced account security with authenticator apps
- **Event Reviews & Ratings** - Community feedback system for events
- **Advanced Search & Filtering** - Powerful search with multiple filter options
- **Recommendation Engine** - Personalized event suggestions
- **User Preferences** - Customizable user settings and interests
- **Analytics Dashboard** - Insights for event organizers
- **Caching Layer** - Redis-based caching for improved performance
- **Enhanced Logging** - Winston-based request and error logging
- **Security Hardening** - CSRF protection, rate limiting, input validation
- **AI Features** - Event description and poster generation

---

**Last Updated:** February 2026
