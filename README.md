# Event Platform

MERN Stack event management platform with JWT auth, event CRUD, RSVP system with capacity enforcement.

## 🚀 Live Deployment
- **Frontend**: https://your-vercel-app.vercel.app
- **Backend**: https://your-render-app.onrender.com  
- **Database**: MongoDB Atlas

## 🛠 Local Setup

```bash
# Clone repo
git clone <your-github-repo-url>
cd Event_platform

# Backend
cd server
cp .env.example .env  # Add your keys
npm install
npm run dev           # http://localhost:3000

# Frontend (new terminal)
cd ../client
npm install
npm run dev           # http://localhost:5173
```

**.env required**: `MONGODB_URI`, `JWT_SECRET`, `IMAGEKIT_*` keys

## 🔒 RSVP Concurrency Solution

MongoDB atomic operations prevent race conditions:
```js
// server/src/controllers/event.controller.js ~line 120
await Event.findOneAndUpdate(
  { _id: eventId, 'rsvps': { $ne: userId }, $expr: { $lt: [{ $size: '$rsvps' }, '$capacity'] } },
  { $addToSet: { rsvps: userId } }
)
```
- Checks capacity AND user absence atomically
- `$addToSet` prevents duplicates
- No transactions needed

## ✅ Features Implemented
- [x] User auth (JWT, bcrypt, httpOnly cookies)
- [x] Event CRUD + ImageKit image upload
- [x] RSVP system (capacity enforcement, no duplicates)
- [x] Owner-only edit/delete
- [x] Responsive UI + dark/light theme toggle
- [x] User dashboard (created/RSVP'd events)
- [x] Form validation + error handling
- [x] Production deployment (Vercel/Render/Atlas)

## 📱 Tech Stack
**Frontend**: React 19 + Vite + Tailwind CSS + Context API  
**Backend**: Node.js + Express + MongoDB/Mongoose + ImageKit

---
**Last Updated**: Dec 20, 2025


## 🎯 Overview

Event Platform is a modern web application designed to help users discover, create, and manage events. The platform features a responsive React frontend with Tailwind CSS styling, a robust Node.js backend with MongoDB database, and secure JWT-based authentication.

### Tech Stack

**Frontend:**
- React 19.2.0
- Vite 7.2.4
- Tailwind CSS 4.1.18
- React Router DOM 7.11.0
- Axios for API calls
- Lucide React & React Icons for UI icons

**Backend:**
- Node.js + Express.js
- MongoDB with Mongoose ODM
- JWT (JSON Web Tokens) for authentication
- ImageKit for image storage/CDN
- Bcrypt for password hashing
- Multer for file uploads

---

## ✨ Implemented Features

### 1. **User Authentication** ✅
- **Signup/Registration** (`client/src/pages/Signup.jsx`)
  - User registration with name, email, and password
  - Password validation (minimum 6 characters, uppercase, number)
  - Confirmation password verification
  - Password strength indicator
  - Duplicate email detection

- **Login** (`client/src/pages/Login.jsx`)
  - Email and password validation
  - JWT token generation and storage in secure cookies
  - Remember user session
  - Error handling and user feedback

- **Backend Authentication** (`server/src/controllers/auth.controller.js`)
  - Bcrypt password hashing (salt rounds: 10)
  - JWT token signing and verification
  - Cookie-based token storage with httpOnly flag
  - Email uniqueness validation
  - Comprehensive error handling

### 2. **Event Management** ✅
- **Create Events** (`client/src/pages/CreateEvent.jsx`)
  - Form with fields: title, description, category, date, time, location, capacity, image
  - Image upload with validation (max 2MB, formats: PNG, JPEG, WEBP)
  - Client-side validation
  - Image storage via ImageKit
  - Owner-only access control

- **View Events** (`client/src/pages/Dashboard.jsx`)
  - List all events with event cards
  - Event details include: title, image, location, date, capacity, attendees
  - EventCard component with responsive grid layout
  - Filter and search capabilities (structure prepared)

- **Event Details** (`client/src/pages/EventDetails.jsx`)
  - Full event information display
  - Owner and attendee information
  - RSVP participant list
  - Event edit/delete options (for owner)

- **User Dashboard** (`client/src/pages/UserDashboard.jsx`)
  - User profile information
  - User-created events
  - Events user has RSVP'd to
  - Event management options

### 3. **RSVP System** ✅
- **Join Event** (`POST /event/:id/rsvp`)
  - Add user to event RSVP list
  - Check event capacity before adding
  - Prevent duplicate RSVPs
  - Real-time attendee count update

- **Leave Event** (`DELETE /event/:id/rsvp`)
  - Remove user from RSVP list
  - Update attendee count
  - Support for changing mind

### 4. **Event Operations** ✅
- **Update Event** (`PUT /event/:id`)
  - Edit event details (title, description, date, location, capacity)
  - Update event image
  - Owner-only access validation
  - Atomic updates

- **Delete Event** (`DELETE /event/:id`)
  - Remove event from database
  - Owner-only access
  - Cascade delete with RSVP cleanup

### 5. **Theme Management** ✅
- **Light/Dark Mode Toggle** (`client/src/context/ThemeContext.jsx`)
  - Toggle button in Navbar (`client/src/components/Navbar.jsx`)
  - Persistent theme preference in localStorage
  - Smooth transitions with `transition-colors duration-500`
  - Tailwind dark mode support via `dark:` classes
  - System preference detection

- **Dark Mode Styling**
  - Navbar: `dark:bg-neutral-900/95 dark:border-neutral-800`
  - Pages: `dark:bg-neutral-950 dark:text-neutral-50`
  - Components: Consistent dark variants for all elements
  - Icons: Sun icon for dark mode, Moon icon for light mode

### 6. **Validation & Error Handling** ✅
- **Email Validation** (`validateEmail()`)
  - Format validation with regex
  - Required field check

- **Password Validation** (`validatePassword()`)
  - Minimum length enforcement (default 6)
  - Uppercase letter requirement
  - Number requirement
  - Configurable validation options

- **Event Validation** (`validateEvent()`)
  - Title minimum 5 characters
  - Required date and time
  - Location minimum 3 characters
  - Positive integer capacity

- **Image Validation** (`validateImage()`)
  - File type check (PNG, JPEG, WEBP)
  - Maximum size 2MB
  - File presence validation

- **Password Strength Indicator** (`passwordStrength()`)
  - 5-level strength scoring: Very weak → Very strong
  - Visual color feedback (red → green)
  - Percentage calculation

### 7. **Database Schema** ✅
- **User Model** (`server/src/models/user.model.js`)
  - Fields: name, email, password (hashed), timestamps
  - Email unique constraint
  - Automatic created/updated timestamps

- **Event Model** (`server/src/models/event.model.js`)
  - Fields: title, description, date, location, capacity, image URL, owner, rsvps array
  - Owner reference to User model
  - RSVP list with User references
  - Automatic timestamps for creation/updates

### 8. **UI Components** ✅
- **Button** (`client/src/components/Button.jsx`) - Reusable action button with variants
- **Card** (`client/src/components/Card.jsx`) - Container component for content
- **EventCard** (`client/src/components/EventCard.jsx`) - Event display card with image, title, location, attendees
- **Input** (`client/src/components/Input.jsx`) - Text input field with icon support
- **Navbar** (`client/src/components/Navbar.jsx`) - Navigation bar with logo, theme toggle, user menu

### 9. **Routing** ✅
- **Route Structure** (`client/src/routes/AppRoutes.jsx`)
  - `/` → Redirects to login
  - `/user/register` → Signup page
  - `/user/login` → Login page
  - `/dashboard` → Events listing
  - `/create-event` → Create event form
  - `/event/:id` → Event details
  - `/user-dashboard` → User profile & events

### 10. **State Management** ✅
- **App Context** (`client/src/context/AppProvider.jsx`)
  - User state management (login/logout)
  - Events state management (add, edit, delete)
  - RSVP tracking
  - LocalStorage persistence

- **Theme Context** (`client/src/context/ThemeContext.jsx`)
  - Global theme state
  - Theme toggle function
  - LocalStorage persistence

### 11. **API Integration** ✅
- **Auth APIs** (`server/src/routes/auth.routes.js`)
  - `POST /auth/register` - User signup
  - `POST /auth/login` - User login
  - `GET /auth/logout` - User logout

- **Event APIs** (`server/src/routes/event.routes.js`)
  - `POST /event/create` - Create new event
  - `GET /event` - List all events
  - `GET /event/:id` - Get event details
  - `PUT /event/:id` - Update event
  - `DELETE /event/:id` - Delete event
  - `POST /event/:id/rsvp` - RSVP to event
  - `DELETE /event/:id/rsvp` - Cancel RSVP

### 12. **Image Storage** ✅
- **ImageKit Integration** (`server/src/services/storage.service.js`)
  - Cloud image upload with ImageKit SDK
  - File naming with UUID
  - Direct URL responses for frontend
  - Supports multiple image formats

### 13. **Authentication Middleware** ✅
- **Token Verification** (`server/src/middlewares/auth.middleware.js`)
  - JWT token extraction from cookies
  - Token validation against JWT_SECRET
  - User data injection into request object
  - Protected route enforcement

---

## 📁 Project Structure

```
Event_platform/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── EventCard.jsx
│   │   │   ├── Input.jsx
│   │   │   └── Navbar.jsx
│   │   ├── context/                 # State management
│   │   │   ├── AppProvider.jsx      # App state (user, events)
│   │   │   └── ThemeContext.jsx     # Theme state
│   │   ├── pages/                   # Route pages
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx        # Events listing
│   │   │   ├── CreateEvent.jsx
│   │   │   ├── EventDetails.jsx
│   │   │   └── UserDashboard.jsx
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx        # Route definitions
│   │   ├── utils/
│   │   │   └── validation.js        # Form validation functions
│   │   ├── App.jsx                  # App wrapper with providers
│   │   ├── main.jsx                 # Entry point
│   │   └── index.css                # Global styles
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── index.html
│
└── server/                          # Express Backend
    ├── src/
    │   ├── controllers/             # Request handlers
    │   │   ├── auth.controller.js   # Auth logic
    │   │   └── event.controller.js  # Event logic
    │   ├── models/                  # Mongoose schemas
    │   │   ├── user.model.js
    │   │   └── event.model.js
    │   ├── routes/                  # API routes
    │   │   ├── auth.routes.js
    │   │   └── event.routes.js
    │   ├── middlewares/
    │   │   └── auth.middleware.js   # JWT verification
    │   ├── services/
    │   │   └── storage.service.js   # ImageKit integration
    │   ├── db/
    │   │   └── db.js                # MongoDB connection
    │   └── app.js                   # Express app setup
    ├── server.js                    # Server entry point
    └── package.json
```

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- ImageKit account (for image storage)
- Environment variables configured

### Backend Setup

1. **Install dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Configure environment variables** (create `.env` file):
   ```env
   MONGODB_URI=mongodb://localhost:27017/event_platform
   JWT_SECRET=your_jwt_secret_key_here
   IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
   IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
   IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
   PORT=3000
   ```

3. **Start the backend server:**
   ```bash
   npm start
   # or with nodemon for development:
   npm run dev
   ```
   Server will run on `http://localhost:3000`

### Frontend Setup

1. **Install dependencies:**
   ```bash
   cd client
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

3. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🔐 Security Features

- **Password Security**
  - Bcrypt hashing with salt rounds (10)
  - Password strength validation
  - Confirmation password verification

- **Authentication**
  - JWT token-based authentication
  - HttpOnly cookies for token storage
  - CORS configured for trusted origins
  - Token verification on protected routes

- **Data Validation**
  - Client-side form validation
  - Server-side validation on all endpoints
  - File type and size validation for images

- **Authorization**
  - Owner-only event edit/delete
  - User-specific RSVP management
  - Protected API endpoints with auth middleware

---

## 📱 Responsive Design

- **Mobile-First Approach**
  - Tailwind CSS responsive grid layout
  - Flexible component sizing
  - Touch-friendly buttons and inputs
  - Optimized Navbar for mobile

- **Dark Mode Support**
  - System preference detection
  - User-selectable theme toggle
  - Persistent theme preference
  - Smooth transitions between themes

---

## 🧪 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123"
}

Response: 201 Created
{
  "message": "User registered successfully",
  "newUser": { "id": "...", "name": "...", "email": "..." },
  "token": "eyJhbGc..."
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123"
}

Response: 200 OK
{
  "message": "User logged in successfully",
  "user": { "id": "...", "name": "...", "email": "..." },
  "token": "eyJhbGc..."
}
```

### Event Endpoints

#### Create Event
```http
POST /event/create
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "title": "Tech Conference 2025",
  "description": "Annual tech conference",
  "date": "2025-01-15",
  "location": "San Francisco",
  "capacity": 500,
  "image": <file>
}

Response: 201 Created
{
  "message": "Event created successfully",
  "event": { "id": "...", "title": "...", ... }
}
```

#### Get All Events
```http
GET /event
Authorization: Bearer {token}

Response: 200 OK
{
  "message": "Events fetched successfully",
  "events": [...]
}
```

#### Get Event by ID
```http
GET /event/:id
Authorization: Bearer {token}

Response: 200 OK
{
  "message": "Event fetched successfully",
  "event": { ... }
}
```

#### RSVP to Event
```http
POST /event/:id/rsvp
Authorization: Bearer {token}

Response: 200 OK
{
  "message": "RSVP successful",
  "event": { ... }
}
```

#### Cancel RSVP
```http
DELETE /event/:id/rsvp
Authorization: Bearer {token}

Response: 200 OK
{
  "message": "RSVP cancelled",
  "event": { ... }
}
```

#### Update Event
```http
PUT /event/:id
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "title": "Updated Title",
  "description": "Updated description",
  "date": "2025-02-15",
  "location": "New Location",
  "capacity": 600,
  "image": <file> (optional)
}

Response: 200 OK
{
  "message": "Event updated successfully",
  "event": { ... }
}
```

#### Delete Event
```http
DELETE /event/:id
Authorization: Bearer {token}

Response: 200 OK
{
  "message": "Event deleted successfully"
}
```

---

## ✅ Checklist of Completed Features

- [x] User authentication (signup/login)
- [x] JWT token-based authorization
- [x] Event creation with image upload
- [x] Event listing and filtering
- [x] Event details view
- [x] Event RSVP system
- [x] Event edit/delete (owner only)
- [x] User dashboard
- [x] Theme toggle (light/dark mode)
- [x] Form validation (client & server)
- [x] Image storage integration (ImageKit)
- [x] Responsive design
- [x] Error handling and user feedback
- [x] Protected API routes
- [x] MongoDB database integration
- [x] Reusable UI components
- [x] Context API for state management
- [x] React Router navigation

---

## 📝 Notes

- All images are stored via **ImageKit** for CDN delivery and optimization
- Authentication tokens are stored in **httpOnly cookies** for security
- The platform uses **Tailwind CSS** for styling and responsive design
- State is persisted in **localStorage** for theme and session data
- Password validation includes strength checking
- RSVP system prevents duplicates and respects event capacity

---

## 📧 Environment Variables Required

```
MONGODB_URI          # MongoDB connection string
JWT_SECRET           # Secret key for JWT signing
IMAGEKIT_PUBLIC_KEY  # ImageKit public key
IMAGEKIT_PRIVATE_KEY # ImageKit private key
IMAGEKIT_URL_ENDPOINT # ImageKit URL endpoint
PORT                 # Server port (default: 3000)
```

---

## 🎓 Learning Outcomes

This project covers:
- Full-stack JavaScript development
- React hooks and context API
- Express.js REST APIs
- MongoDB/Mongoose ODM
- JWT authentication
- File upload handling
- Image storage with CDN
- Responsive design with Tailwind CSS
- Form validation and error handling
- Client-server communication with Axios
- State management patterns

---

**Last Updated:** December 2025
  - Wiring Dashboard, EventDetails, UserDashboard to use live data from backend events API
  - Ensuring create-event page updates global event state after successful API calls
- **Shared component theming**
  - Finalizing light/dark styles for `Navbar`, `EventCard`, `Card`, `Button`, `Input` for consistent look

**Pending**

- Event **edit/delete** (owner-only) fully wired on frontend
- **RSVP system** integration:
  - Capacity enforcement (no overbooking)
  - Concurrency handling (atomic updates / transactions in MongoDB)
  - Frontend RSVP/Leave buttons connected to backend
- Full production deployment:
  - Finalizing environment variables and URLs for deployed frontend + backend
  - End-to-end testing of live app

---

## Deployment

- **Frontend:** Vercel (planned) — `https://event-platform.vercel.app`
- **Backend:** Render (planned) — `https://event-platform-backend.onrender.com`
- **Database & Assets:**
  - MongoDB Atlas
  - ImageKit for image storage (configured in `storage.service.js`)

---

## Recent Changes (Dec 19–20, 2025)

### Backend

- Completed core event APIs in `event.controller.js`:
  - `POST /events` (create event with image and owner)
  - `GET /events` (list events)
  - `GET /events/:id` (fetch single event)
- Ensured auth middleware protects event creation routes.
- Prepared structure for RSVP and capacity logic (to be integrated).

### Theme / UI

- **Theme Toggle Implementation**
  - `ThemeContext.jsx` and `useTheme()` hook created to manage dark mode.
  - Integrated theme state into `AppProvider.jsx` to provide theme globally.
  - All main pages (`Dashboard`, `UserDashboard`, `EventDetails`, `CreateEvent`, `Login`, `Signup`) now use:
    - `bg-white dark:bg-neutral-950` + `transition-colors duration-500`
    - Consistent `page-wrapper` containers.
  - `localStorage` persistence for theme preference.
  - `<html>` correctly receives/removes `dark` class for Tailwind’s dark mode.

- **Layout Refinements**
  - Login and Signup centered card layout with dark card on light background (and matching dark theme).
  - Dashboard cards show event info with “View” and “RSVP” actions only.

### Next Steps

- Connect Dashboard, EventDetails, and UserDashboard pages to the live backend endpoints using Axios and global context.
- Implement RSVP routes and ensure they enforce capacity and handle concurrency.
- Hook up edit/delete actions for event owners, both in backend routes and frontend UI.

---

## Concurrency Plan (RSVP)

For RSVP logic (to be implemented):

- Use MongoDB transactions or atomic updates to:
  - Check event capacity and current RSVP count in a single operation.
  - Ensure a user cannot RSVP twice for the same event.
  - Increment attendees only if capacity is not exceeded.
- This avoids race conditions when multiple users RSVP for the last available spot.

---

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB (configured in `server/src/db/db.js`)

---

## Repo Structure

- `client/` — React frontend  
  - `src/` — components, pages, routes, context  
  - `package.json` — frontend scripts and dependencies
- `server/` — Node/Express backend  
  - `src/` — controllers, models, routes, services  
  - `server.js` — server entry

---

## Prerequisites

- Node.js LTS (v18+ recommended)
- npm or yarn
- MongoDB connection (e.g., MongoDB Atlas)

---

## Setup & Run

1. **Install dependencies**

