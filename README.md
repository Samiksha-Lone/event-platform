# Event Platform

A simple event management platform with a React + Vite frontend and an Express.js, Node.js backend. Users can sign up, log in, create events, and view event details.

---

## Implemented Features

- **User authentication**
  - Signup and login flows (`client/src/pages/Signup.jsx`, `client/src/pages/Login.jsx`)
  - JWT-based auth in backend (`server/src/controllers/auth.controller.js`)
- **Event management**
  - Create, list, and view events
  - Backend event APIs completed in `server/src/controllers/event.controller.js`
  - Frontend pages: `client/src/pages/CreateEvent.jsx`, `client/src/pages/Dashboard.jsx`, `client/src/pages/EventDetails.jsx`
- **User dashboard**
  - User-specific event view (`client/src/pages/UserDashboard.jsx`)
- **UI components**
  - `Button`, `Card`, `EventCard`, `Input`, `Navbar` in `client/src/components`
- **Storage helper**
  - `server/src/services/storage.service.js` for handling event assets (e.g., images)
- **Theme Toggle (Light/Dark Mode)**
  - Theme state via React Context (`client/src/context/ThemeContext.jsx`, `client/src/context/AppProvider.jsx`)
  - Toggles `dark` class on `<html>` for Tailwind dark mode
  - Persists preference in `localStorage`
  - Smooth transitions using `transition-colors duration-500`
  - Light/dark variants added to main pages and most components

---

## Assignment Progress

**Completed**

- Backend APIs:
  - Auth: signup/login with JWT
  - Events: create, list, get-by-id (and basic structure for edit/delete/RSVP)
- Frontend:
  - Signup/Login forms with validation and API calls
  - Event creation form with image upload
  - Dashboard listing events (UI + layout)
  - Event details and user dashboard skeletons
  - Responsive layout with Tailwind
- Theming:
  - Global light/dark theme toggle with context + `localStorage`
  - Page wrappers updated with explicit `bg-white dark:bg-neutral-950` and smooth transitions

**In Progress**

- **Frontend integration with backend APIs**
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

