# EventHub – MERN Event Management Platform

A full-stack event management platform built with the **MERN stack** (MongoDB, Express, React, Node.js). Create events, discover exciting activities, and RSVP with real-time synchronization across all pages.

**Live Demo:** https://eventhub-eight.vercel.app/

---

## ✨ Core Features

### 🛡️ User Authentication
- Email/password based registration and login
- JWT token-based authentication with HTTP-only cookies
- Secure password hashing using bcrypt
- Session persistence across pages
- Protected routes and API endpoints

### 📅 Event Management
- **Create Events** - Add detailed event information (title, description, date, time, location, category, capacity, image)
- **Browse Events** - View all upcoming events with pagination
- **Event Details** - See full event information, attendee count, and capacity status
- **Edit/Delete Events** - Modify or remove events you created
- **Category Filtering** - Filter by event types (Tech, Music, Sports, Food, Health, Education, Workshop, Social)
- **Search** - Find events by title or description
- **AI Event Description Generator** - Automatically generate professional event descriptions with one click
- **AI Event Poster Generator** - Create eye-catching event posters using AI

### 👥 RSVP System (Recently Enhanced)
- **Join Events** - RSVP to events with one click
- **Capacity Management** - Cannot RSVP if event is full
- **Real-time Sync** - RSVP status updates instantly across Dashboard, Event Details, and User Dashboard
- **Leave Events** - Cancel RSVP anytime to free up a spot
- **Attendee Tracking** - View real-time attendance count and available spots
- **Smart Button Display** - Button shows "RSVP" or "Leave Event" based on status

### 👤 User Dashboard
- **My Events Tab** - View all events you created
  - Quick access to edit or delete events
  - See attendee count for each event
  
- **Attending Tab** - View all events you've RSVP'd to
  - One-click access to leave events
  - Jump directly to event details
  - See upcoming events you plan to attend

- **Dashboard Stats** - See count of events created and events attending

### 🎨 UI/UX Features
- **Dark Mode** - Toggle between light and dark themes
- **Responsive Design** - Mobile-friendly interface (Works on all devices)
- **Real-time Toast Notifications** - Instant feedback for all actions
- **Loading States** - Skeleton loaders during data fetching
- **Event Cards** - Beautiful cards with event image, date, location, and RSVP button
- **Capacity Indicators** - Visual display of available spots (e.g., "12/50 attending")

### 🤖 AI-Powered Features
- **AI Event Description Generator** - Generate compelling event descriptions automatically
  - Click "Generate Description" while creating/editing an event
  - Powered by AI language models
  - Helps create professional descriptions instantly
  
- **AI Event Poster Generator** - Create attractive event posters with AI
  - Click "Generate Poster" to create visual event posters
  - AI-powered visual generation
  - Perfect for social media sharing

### 🔐 Security
- JWT-based stateless authentication
- HTTP-only cookies to prevent XSS attacks
- Rate limiting on API endpoints
- Input validation and sanitization
- NoSQL injection prevention

---

## 🏗️ Tech Stack

### Frontend
- **React 18** with Hooks for state management
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for responsive styling
- **React Router** for navigation
- **Axios** for API calls
- **Context API** for global state (Auth, Events, Theme, Toast)
- **Lucide React & React Icons** for UI icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** with Mongoose - NoSQL database
- **JWT** - Secure token authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **Cors & Helmet** - Security headers and CORS

---

## ⚡ Quick Start

### Prerequisites
- Node.js v18+ and npm
- MongoDB (Cloud Atlas or local)
- Git

### Setup (5 minutes)

**1. Clone and navigate:**
```bash
git clone https://github.com/Samiksha-Lone/event-platform.git
cd event-platform
```

**2. Backend setup:**
```bash
cd server
cp .env.example .env
# Edit .env and add your MongoDB URI and JWT_SECRET
npm install
npm run dev
```
Backend runs on `http://localhost:3000`

**3. Frontend setup (new terminal):**
```bash
cd client
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`

**Done!** Open http://localhost:5173 and start using the app.

### Environment Variables Needed

**Server `.env`:**
```env
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/eventdb
JWT_SECRET=your-secret-key-min-32-chars
CLIENT_URL=http://localhost:5173
```

**Client `.env`:**
```env
VITE_API_URL=http://localhost:3000
```

---

## 📂 Project Structure

```
event-platform/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/            # Full page components
│   │   ├── context/          # Global state (Auth, Events, Theme, Toast)
│   │   ├── hooks/            # Custom React hooks
│   │   ├── utils/            # Helper functions (API, RSVP helpers)
│   │   └── routes/           # Route definitions
│   └── package.json
│
├── server/                    # Express Backend
│   ├── src/
│   │   ├── controllers/       # Business logic
│   │   ├── models/           # MongoDB schemas
│   │   ├── routes/           # API endpoints
│   │   ├── middlewares/      # Auth, validation
│   │   ├── services/         # Helper services
│   │   └── db/               # Database connection
│   └── package.json
│
└── README.md
```

---

## 🚀 How to Use

### Register & Login
1. Visit http://localhost:5173
2. Click "Sign Up" and create an account
3. Login with your email and password
4. You're in! 

### Create an Event
1. Click "+ Create Event" button (on dashboard or user dashboard)
2. Fill in event details:
   - Title, description, date, time
   - Event type (Online/In-Person)
   - Location (for in-person) or meeting link (for online)
   - Category and capacity
   - Event image
3. **Optional: Use AI Generators** (while creating/editing):
   - Click **"✨ Generate Description"** - AI will create a professional event description for you
   - Click **"🎨 Generate Poster"** - AI will create an attractive event poster
4. Click "Create Event"
5. Event appears on dashboard and your "My Events" tab

### Find & Join Events
1. Browse events on the **Dashboard**
2. Use search bar to find specific events
3. Filter by category or view all events
4. Click "View" to see event details
5. Click "RSVP" to join the event
6. Event now appears in your **Attending Tab** in User Dashboard

### Manage Events
- **View Your Events**: Go to User Dashboard → "My Events" tab
- **View Events Attending**: Go to User Dashboard → "Attending" tab
- **Edit Your Event**: Click "Edit" on any event you created
- **Delete Your Event**: Click "Delete" on any event you created
- **Leave Event**: Click "Leave Event" on any attending event

---

## 🔑 Key Improvements Made

### RSVP System Enhancements (Latest)
- **Optimistic Updates**: RSVP changes appear instantly without waiting for server
- **Cross-page Sync**: RSVP status stays consistent across Dashboard, Event Details, and User Dashboard
- **Smart Error Handling**: Failed RSVP reverts to original state
- **Better ID Handling**: Robust comparison of user IDs (handles strings and ObjectIDs)
- **Reliable Attendance Counts**: `attending` count always matches `rsvps` array length

### Event Data Normalization
- Every event guaranteed to have valid `rsvps` array
- Consistent `attending` count across all pages
- Proper user ID extraction for RSVP verification

### UI/UX Enhancements
- "Leave Event" button shows correctly when user has RSVP'd
- Real-time capacity updates
- Toast notifications for all actions
- Smooth loading states

---

## 📝 API Endpoints

### Authentication
```
POST   /auth/register          - Create new account
POST   /auth/login             - Login with email & password
POST   /auth/logout            - Logout user
GET    /auth/me                - Get current user info
```

### Events
```
GET    /event                  - Get all events (with pagination)
GET    /event/:id              - Get single event details
POST   /event/create           - Create new event (protected)
PUT    /event/:id              - Update event (protected, owner only)
DELETE /event/:id              - Delete event (protected, owner only)
POST   /event/:id/rsvp         - Join event (protected)
DELETE /event/:id/rsvp         - Leave event (protected)
```

---

## 🛠️ Available Scripts

### Frontend
```bash
npm run dev      # Start development server (port 5173)
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Check code quality
```

### Backend
```bash
npm run dev      # Start with auto-reload
npm start        # Start production server
```

---

## 🐛 Common Issues & Solutions

### MongoDB Connection Error
**Problem**: `Error: connect ECONNREFUSED`
- Check `MONGO_URI` in `.env` is correct
- Verify IP is whitelisted in MongoDB Atlas
- Ensure credentials are accurate

### Port Already in Use
**Problem**: `Error: listen EADDRINUSE: address already in use :::3000`
```bash
# Windows: Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3000
kill -9 <PID>
```

### Login Not Working
1. Check backend is running: `curl http://localhost:3000`
2. Verify `VITE_API_URL` in client `.env`
3. Check browser console for errors
4. Clear browser cookies and try again

### RSVP Button Not Updating
- Clear browser cache
- Check that backend is running
- Verify MongoDB connection is working

---

## 📞 Support

- **Issues**: Open on GitHub
- **Questions**: Check existing issues or create a new one
- **Contact**: Create an issue with label "question"

---

## 🎯 Future Features (Roadmap)

- [ ] User profiles with bio and avatar
- [ ] Event reviews and ratings
- [ ] Advanced search and filtering
- [ ] Email notifications
- [ ] User preferences and recommendations
- [ ] Two-factor authentication (2FA)
- [ ] Analytics dashboard for organizers
- [ ] Mobile app (React Native)

---

## 📄 License

This project is open source under the **ISC License**.

---

**Happy event planning! 🎉**
