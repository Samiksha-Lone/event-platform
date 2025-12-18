# Event Platform

A simple event management platform with a React + Vite frontend and an Express.js, Node.js backend. Users can sign up, log in, create events, and view event details.

## Implemented Features
- User authentication: signup and login flows (`/client/src/pages/Signup.jsx`, `/client/src/pages/Login.jsx`, `server/src/controllers/auth.controller.js`).
- Event management: create, list, and view events (`/client/src/pages/CreateEvent.jsx`, `/client/src/pages/Dashboard.jsx`, `/client/src/pages/EventDetails.jsx`, `server/src/controllers/event.controller.js`).
- User dashboard: user-specific event view (`/client/src/pages/UserDashboard.jsx`).
- Basic UI components: `Button`, `Card`, `EventCard`, `Input`, `Navbar` located in `client/src/components`.
- Server-side storage helper in `server/src/services/storage.service.js` for handling event assets.

## Assignment Progress
**Completed:** JWT auth (signup/login), event creation (title/desc/date/location/capacity/image?), responsive UI, event listing/viewing.  
**Pending:** Event edit/delete (owner-only), RSVP system (capacity enforcement, concurrency handling via MongoDB transactions/atomic updates), full backend integration.  
**Deployment:** 
Frontend: Deploying on Vercel (https://event-platform.vercel.app)
Backend: Deploying on Render (https://event-platform-backend.onrender.com)  
MongoDB Atlas + ImageKit configured


## Concurrency Plan (for RSVP)
Will use MongoDB transactions: check capacity + user RSVP count atomically, then $inc attendees if valid. Prevents race conditions.

## Tech stack
- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express
- Database: (configured in `server/src/db/db.js`) — likely MongoDB

## Repo structure
- `client/` — React frontend
  - `src/` — components, pages, routes, context
  - `package.json` — frontend scripts and deps
- `server/` — Node/Express backend
  - `src/` — controllers, models, routes, services
  - `server.js` — server entry

## Prerequisites
- Node.js LTS (v18+ recommended)
- npm or yarn
- A running database (e.g., MongoDB) if required by the server

## Setup & Run
1. Install dependencies for both projects:

```bash
# from repo root
cd client
npm install

# in separate terminal
cd ../server
npm install
```

2. Configure environment variables for the server. Create a `.env` in `server/` with values similar to:

```
PORT=3000
DATABASE_URL=<your_database_connection_string>
JWT_SECRET=<your_jwt_secret>
```

3. Run the server and client:

```bash
# start backend
cd server
npm run dev   # or: node server.js

# start frontend
cd ../client
npm run dev
```

Open the client URL reported by Vite (usually `http://localhost:5173`) and the backend on its configured port.

## API (overview)
Implemented server routes (see `server/src/routes`):
- `POST /auth/signup` — create account (`server/src/controllers/auth.controller.js`)
- `POST /auth/login` — authenticate (`server/src/controllers/auth.controller.js`)
- `GET /events` — list events (`server/src/controllers/event.controller.js`)
- `POST /events` — create event (auth required) (`server/src/controllers/event.controller.js`)
- `GET /events/:id` — event details (`server/src/controllers/event.controller.js`)

## Files/dirs to ignore (added to `.gitignore`)
- `node_modules/`
- `client/node_modules/`
- `server/node_modules/`
- `dist/`
- `build/`
- `.env`
- `.env.local`
- `.DS_Store`
- `*.log`
- `npm-debug.log*`
- `client/dist/`
- `client/.vite/`
- `.vscode/`
- `Thumbs.db`
