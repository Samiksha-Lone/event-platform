# EventHub – MERN Event Platform

EventHub is a full-stack event management platform built with the MERN stack (MongoDB, Express, React, Node.js). It lets authenticated users create and manage events, browse all upcoming events, and RSVP to events while enforcing capacity and authentication rules.

**Live Demo:** https://eventhub-eight.vercel.app/
**Repository:** [GitHub](https://github.com/Samiksha-Lone/event-platform)

## 📑 Table of Contents
- [Features](#-features)
- [Quick Start](#-quick-start)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure-overview)
- [Authentication](#-authentication--authorization)
- [API Documentation](#-api-documentation)
- [Available Scripts](#-available-scripts)
- [Testing](#-testing-the-application)
- [Troubleshooting](#-troubleshooting)
- [Development](#-development-workflow)
- [Deployment](#-deployment-guide)
- [Contributing](#-contributing)
- [License](#-license)

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
- **Lucide React** for icons
- **React Icons** for additional icon sets
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

## ⚡ Quick Start

### Prerequisites
- **Node.js** v18+ and npm/yarn
- **MongoDB** (Atlas account or local instance)
- **Redis** (optional, for caching)
- **Git**

### One-Command Setup (Development)
```bash
# Clone the repository
git clone https://github.com/Samiksha-Lone/event-platform.git
cd event-platform

# Setup backend
cd server
cp .env.example .env              # Update with your credentials
npm install
npm run dev                        # Runs on http://localhost:3000

# In a new terminal, setup frontend
cd ../client
npm install
npm run dev                        # Runs on http://localhost:5173
```

Visit **http://localhost:5173** in your browser. That's it!

---

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

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (Atlas account or local instance)
- **Redis** (optional, for caching and sessions)
- **Git**

### Step-by-Step Setup Guide

#### 1. Clone the Repository

```bash
git clone https://github.com/Samiksha-Lone/event-platform.git
cd event-platform
```

#### 2. Backend Setup

Navigate to the server directory:

```bash
cd server
npm install
```

**Create a `.env` file** in the `server` directory using the `.env.example` as reference:

```bash
cp .env.example .env
# Then edit .env with your credentials
```

**Required `.env` variables:**
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database - REQUIRED
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/eventdb?retryWrites=true&w=majority

# Authentication - REQUIRED
JWT_SECRET=your-super-secret-jwt-key-min-32-chars

# Frontend URL - REQUIRED
CLIENT_URL=http://localhost:5173

# Email Service (Gmail with App Password) - REQUIRED for password resets
SMTP_USER=your_email@gmail.com
SMTP_PASS=your-16-char-app-password

# Image Upload Service - REQUIRED for event images
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_endpoint

# Redis (Optional, for caching)
REDIS_URL=redis://localhost:6379

# Logging
LOG_LEVEL=info
```

Start the backend server:

```bash
npm run dev    # Development with auto-reload
# or
npm start      # Production
```

The backend will be running at `http://localhost:3000`

#### 3. Frontend Setup

Open a new terminal and navigate to the client directory:

```bash
cd client
npm install
```

**Create a `.env` file** in the `client` directory:

```env
# API Base URL - REQUIRED
VITE_API_URL=http://localhost:3000
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Verification Checklist

- [ ] Backend server is running on port 3000
- [ ] Frontend is running on port 5173
- [ ] MongoDB connection is successful (check server logs)
- [ ] Redis is running (if using caching features)
- [ ] Environment variables are properly configured
- [ ] Can access the application at http://localhost:5173
- [ ] Can register and login successfully

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
- Rate limiting on all API endpoints (15 requests per 15 minutes)
- CSRF protection on state-changing requests
- Input validation and sanitization
- NoSQL injection prevention (mongo-sanitize)
- Security headers via Helmet.js
- Password strength requirements
- Token expiration and refresh
- Secure password reset with email verification

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

## � Available Scripts

### Frontend (client/)
```bash
npm run dev      # Start development server on port 5173
npm run build    # Build for production
npm run preview  # Preview production build locally
npm run lint     # Run ESLint to check code quality
```

### Backend (server/)
```bash
npm run dev      # Start with auto-reload (using --watch)
npm start        # Start production server
npm test         # Run tests (currently not implemented)
```

---

## 🧪 Testing the Application

### Create Test Account
1. Open http://localhost:5173
2. Click "Sign Up"
3. Register with any email and password
4. Verify backend logs show user creation
5. Login with your credentials

### Test RSVP Feature
1. Dashboard shows all events
2. Click on any event to see details
3. Click "RSVP Now" if capacity available
4. Your event appears in "Events I Joined"
5. Click "Cancel RSVP" to leave event

### Test 2FA Setup
1. After login, go to Account Settings (if implemented)
2. Click "Enable 2FA"
3. Scan QR code with Google Authenticator or Authy
4. Enter 6-digit OTP to verify
5. On next login, you'll be prompted for 2FA code

### Test Email Features
1. Click "Forgot Password"
2. Enter your registered email
3. Check console logs for reset link (if SMTP not configured)
4. Or check email inbox if SMTP is properly configured

### Test Image Upload
1. Create a new event
2. Upload an image
3. Verify image appears in event card
4. Check ImageKit console for uploaded images

---

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Failed**
```
Error: connect ECONNREFUSED
```
Solutions:
- Check `MONGO_URI` in `.env` is correct
- Verify MongoDB Atlas IP whitelist includes your IP
- Ensure database credentials are accurate
- Test connection: `mongosh "mongodb+srv://<user>:<pass>@<cluster>.mongodb.net"`

**Port Already in Use (3000)**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3000
kill -9 <PID>
```

**JWT Token Issues**
- Clear browser cookies: DevTools → Application → Cookies → Delete all
- Logout and login again
- Verify `JWT_SECRET` is set and consistent
- Check token expiration: Token valid for 7 days by default

**SMTP/Email Not Working**
- Verify Gmail App Password (not regular password): https://myaccount.google.com/apppasswords
- Enable 2FA on Gmail first
- Check `SMTP_USER` and `SMTP_PASS` are correct
- For development: reset links are logged to console if SMTP fails
- Alternative: Use SendGrid - set `SENDGRID_API_KEY`

**2FA QR Code Not Appearing**
- Check browser console for errors
- Verify `qrcode` package is installed: `npm list qrcode`
- Clear browser cache and reload
- Test with curl: `curl -X POST http://localhost:3000/2fa/setup -H "Authorization: Bearer <token>"`

**Redis Connection Failed**  
- Start Redis: `redis-server` (or `redis-server.exe` on Windows)
- Verify `REDIS_URL` in `.env`
- If not available, in-memory cache is used as fallback
- Check Redis is running: `redis-cli ping` (should return "PONG")

**Rate Limiting (429 Errors)**
- Wait for limit window to reset (default: 15 minutes)
- Reduce request frequency
- Check rate limiter config in `auth.middleware.js`

### Frontend Issues

**API Calls Failing**
```
Error: Network request failed / Cannot connect to server
```
Solutions:
- Verify backend is running: `curl http://localhost:3000`
- Check `VITE_API_URL` in `.env` matches backend URL
- Open DevTools Network tab to see requests
- Look for CORS errors (check backend CORS config)

**Build Errors**
```bash
# Clean and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev

# Clear Vite cache
rm -rf node_modules/.vite
```

**Login Not Working**
- Check browser console for errors
- Verify backend is running
- Check API response: DevTools → Network → Login request
- Clear cookies and try again
- Ensure `.env` has correct `VITE_API_URL`

**Images Not Loading**
- Verify ImageKit credentials in `.env`
- Check network requests for 403/401 errors
- Test ImageKit directly: `curl https://ik.imagekit.io/test`
- Verify image upload succeeded (check ImageKit dashboard)

**Styling Issues**
- Rebuild Tailwind CSS: `npm run build`
- Clear browser cache
- Check `tailwind.config.js` paths are correct
- Verify Tailwind CSS is installed: `npm list tailwindcss`

---
## 🔍 Project Structure Overview

The repository is organized into two main directories:

```
event-platform/
├── client/                 # React + Vite frontend
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── pages/          # Full page components
│       ├── context/        # Global state (Auth, Events, Theme, Toast)
│       ├── hooks/          # Custom React hooks
│       ├── routes/         # Route definitions
│       └── utils/          # Helper functions and API calls
│
├── server/                 # Express.js + Node.js backend
│   └── src/
│       ├── controllers/    # Request handlers
│       ├── models/         # MongoDB schemas (Mongoose)
│       ├── routes/         # API route definitions
│       ├── middlewares/    # Express middlewares
│       ├── services/       # Business logic services
│       ├── utils/          # Helper utilities
│       └── db/             # Database connection
│
└── README.md              # This file
```

---
## �‍💻 Development Workflow

### Creating New Features

**Adding a New API Endpoint:**
1. Create controller in `server/src/controllers/`
2. Add route in `server/src/routes/`
3. Add authentication middleware if needed
4. Test with curl or Postman
5. Add frontend call using `api.js` utilities

**Adding Frontend Pages:**
1. Create page component in `client/src/pages/`
2. Add route in `client/src/routes/AppRoutes.jsx`
3. Use Context API for state management (avoid prop drilling)
4. Add error boundaries for graceful failures

### Code Standards
- Frontend: ESLint enabled - run `npm run lint` before commits
- Backend: Input validation middleware on all endpoints
- Use environment variables for configuration
- Add error handling on all API calls
- Test authentication on protected routes

### Debugging Tips
- **Backend**: Check `server/logs/` for detailed logs
- **Frontend**: Use React DevTools browser extension
- **Database**: Use MongoDB Compass to inspect collections
- **API**: Use Postman to test endpoints directly
- **Networking**: DevTools → Network tab shows all requests/responses

---

## 📝 Environment Variables Reference

### Complete Server Configuration
See [`.env.example`](server/.env.example) for all available options.

### Complete Client Configuration
```env
# Required
VITE_API_URL=http://localhost:3000

# Optional (for future features)
VITE_APP_NAME=EventHub
VITE_DEBUG=false
```

### Getting Service Credentials

**MongoDB Atlas:**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Create database user
4. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/dbname`

**ImageKit:**
1. Sign up at https://imagekit.io
2. Get Public Key, Private Key, and URL Endpoint from dashboard
3. Create folder `/event-platform` for organized storage

**Gmail/SMTP:**
1. Enable 2FA on Google Account
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use 16-character password (remove spaces)

**Redis:**
- Local: Download from https://redis.io/download
- Cloud: Use Redis Cloud (https://app.redislabs.com) for production

---
## 🚀 Deployment Guide

### Frontend Deployment (Vercel - Recommended)

**Prerequisites:**
- GitHub account with repository pushed
- Vercel account (free tier available)

**Steps:**
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Select your GitHub repository
4. Framework Preset: **Vite**
5. Root Directory: **./client**
6. Build Command: `npm run build`
7. Output Directory: `dist`
8. Environment Variables:
   ```
   VITE_API_URL=https://your-backend-url.com
   ```
9. Click "Deploy"

**Alternative Platforms:**
- **Netlify**: Drag & drop dist folder or connect GitHub
- **GitHub Pages**: Configure `vite.config.js` with `base: '/event-platform/'`

### Backend Deployment (Render or Railway)

**Render.com (Recommended - Free tier):**
1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect GitHub repository
4. Settings:
   - **Name**: `event-platform-server`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `server`
5. Add Environment Variables (copy from `.env`):
   - `PORT`, `NODE_ENV`, `MONGO_URI`, `JWT_SECRET`, etc.
6. Click "Deploy"

**Railway.app:**
1. Connect GitHub repository
2. Select `server` directory
3. Auto-detects Node.js
4. Add variables: Database URL, JWT secret, etc.
5. Deploy automatically

**Deploy to Your Own Server:**
```bash
# SSH into your server
ssh user@your-server.com

# Clone repository
git clone https://github.com/Samiksha-Lone/event-platform.git
cd event-platform/server

# Install dependencies
npm install

# Create .env file
nano .env  # Add all required variables

# Start with PM2 (for background execution)
npm install -g pm2
pm2 start server.js --name "event-platform"
pm2 save
```

### Database Setup

**MongoDB Atlas (Cloud Database - Recommended):**
1. Create account at [mongodb.com](https://www.mongodb.com/cloud/atlas)
2. Create a free shared cluster
3. Create database user
4. Whitelist all IPs (0.0.0.0/0 for testing, restrict in production)
5. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/eventdb`
6. Use this as `MONGO_URI` in production `.env`

**For Self-Hosted MongoDB:**
1. Install MongoDB on your server
2. Configure connection string: `mongodb://localhost:27017/eventdb`

### Domain & DNS Setup

1. Purchase domain from GoDaddy, Namecheap, etc.
2. Update DNS records to point to deployment service:
   - **Vercel**: Add CNAME records (Vercel provides specific ones)
   - **Render**: Similar process with provided DNS records
3. Wait for DNS propagation (24-48 hours typically)

### Environment Variables for Production

**Backend `.env` Production Checklist:**
```env
NODE_ENV=production
PORT=3000
JWT_SECRET=<strong-secret-min-32-chars>
MONGO_URI=<atlas-cloud-connection>
CLIENT_URL=https://your-domain.com
SMTP_USER=<verified-email>
SMTP_PASS=<app-password>
IMAGEKIT_PUBLIC_KEY=<key>
IMAGEKIT_PRIVATE_KEY=<key>
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/<endpoint>
REDIS_URL=<redis-cloud-url>
LOG_LEVEL=info
```

**Frontend Production Checklist:**
- [ ] Change `VITE_API_URL` to production backend URL
- [ ] Enable minification and code splitting
- [ ] Test build locally: `npm run build && npm run preview`
- [ ] Set up analytics (optional)
- [ ] Configure error tracking (Sentry, etc.)

---
## � License

This project is open source and available under the **ISC License** - see [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author & Maintainer

**Samiksha Lone**
- 📧 Email: [samikshalone2@gmail.com](mailto:samikshalone2@gmail.com)
- 🐙 GitHub: [@Samiksha-Lone](https://github.com/Samiksha-Lone)
- 💼 LinkedIn: [Samiksha Lone](https://linkedin.com/in/samiksha-lone)

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Please feel free to submit a pull request or open an issue.

### How to Contribute
1. **Fork** the repository
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and test thoroughly
4. **Commit with clear messages**: `git commit -m 'Add amazing feature'`
5. **Push to your branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request** with a clear description

### Contribution Guidelines
- Follow existing code style
- Add comments for complex logic
- Test your changes before submitting
- Update README if adding new features
- Ensure no secrets are committed
- Run linter before submitting: `npm run lint`

---

## 📞 Support & Community

- **Issues**: [GitHub Issues](https://github.com/Samiksha-Lone/event-platform/issues)
- **Email Support**: samikshalone2@gmail.com
- **Live Demo**: https://eventhub-eight.vercel.app/

---

## 🎯 Roadmap & Future Features

- [ ] Mobile app (React Native)
- [ ] Calendar view improvements
- [ ] Email digest notifications
- [ ] Social sharing features
- [ ] AI-powered event recommendations enhancement
- [ ] Payment integration for premium events
- [ ] Event livestreaming support
- [ ] Advanced analytics dashboard
- [ ] Integration with calendar apps (Google Calendar, Outlook)

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
