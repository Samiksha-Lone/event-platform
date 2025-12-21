# EventHub – MERN Event Platform

EventHub is a full‑stack event management platform built with the MERN stack. It lets authenticated users create and manage events, browse all upcoming events, and RSVP or leave events while enforcing capacity and authentication rules.

---

## 🌐 Live Demo

- Frontend: https://event-platform-client-beryl.vercel.app
- Backend API: https://event-platform-upf6.onrender.com

## ✨ Features

- **User authentication**
  - Email/password registration and login using JWT‑based authentication
  - Protected API routes for event creation, editing, deletion, and RSVP
  - Secure password hashing with bcrypt

- **Event management**
  - Create, read, update, and delete events
  - Event fields: title, description, date, time, location, category, capacity, and image
  - Only the event owner can edit or delete their events

- **RSVP system**
  - Join and leave events with a single click
  - Capacity enforcement: users cannot RSVP if the event is full
  - A user can only RSVP once per event

- **User dashboard**
  - View events created by the logged‑in user
  - View events the user has joined via RSVP
  - Quick actions to edit events or leave joined events

- **Password flows**
  - Forgot‑password page to request a reset link
  - Secure reset‑password page with token verification
  - Strong password rules with a visual strength meter

- **UI & UX**
  - Responsive React interface built with Tailwind CSS
  - Clean event cards, filters, and dashboard layout
  - Inline validation errors and toast‑style feedback instead of blocking alerts

---

## 🏗️ Tech Stack

**Frontend**

- React + Vite  
- React Router DOM  
- Context or custom hooks for auth and global state  
- Tailwind CSS for styling  
- Fetch / Axios for API calls

**Backend**

- Node.js  
- Express.js  
- MongoDB with Mongoose  
- JSON Web Tokens (JWT) for authentication  
- Bcrypt for password hashing  
- Multer / custom storage service for image uploads  
- CORS middleware

**Infrastructure**

- MongoDB Atlas for database (local MongoDB also supported)
- Designed for deployment on platforms like Render (backend) and Vercel / Netlify (frontend)

---

## 📂 Project Structure

```
event_platform/
├── client/                # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components (buttons, inputs, cards)
│   │   ├── pages/         # Login, Register, Dashboard, UserDashboard, EditEvent, etc.
│   │   ├── context/       # Auth and app providers
│   │   ├── utils/         # Helpers (password strength, API helpers)
│   │   └── main.jsx
│   └── vite.config.js
└── server/                # Node/Express backend
    ├── src/
    │   ├── controllers/   # auth.controller.js, event.controller.js
    │   ├── middleware/    # authMiddleware (JWT verification)
    │   ├── models/        # user.model.js, event.model.js
    │   ├── routes/        # auth.routes.js, event.routes.js
    │   ├── services/      # storageService for images
    │   └── app.js / server.js
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (LTS)  
- npm or yarn  
- MongoDB Atlas URI or local MongoDB instance

### 1. Clone the repository

```
git clone https://github.com/Samiksha-Lone/event-platform
cd event_platform
```

### 2. Backend setup

```
cd server
npm install
```

Create a `.env` file in the `server` folder:

```
PORT=3000
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
CLIENT_URL=http://localhost:5173
```

Run the backend:

```
npm run dev   # or: npm start
```

The server will start on `http://localhost:3000`.

### 3. Frontend setup

```
cd ../client
npm install
```

Create a `.env` file in `client`:

```
VITE_API_URL=http://localhost:3000
```

Run the frontend:

```
npm run dev
```

The React app will be available at `http://localhost:5173`.

---

## 🔐 Authentication & Authorization

- Users sign up and log in with email and password.  
- On login, a JWT is returned and stored on the client (for example, in `localStorage`).  
- All protected requests (create/edit/delete event, RSVP, leave) send `Authorization: Bearer <token>` in headers.  
- The backend middleware validates the token and attaches the user to `req.user` before hitting controllers.

---

## 📅 Core User Flows

1. **Browse events**
   - Open the dashboard to see all upcoming events.
   - Optionally filter events by category and view details on a dedicated page.

2. **Create and manage events**
   - Authenticated users can create new events with capacity and image.
   - Owners can edit event details or delete their events.

3. **RSVP to events**
   - Logged‑in users can RSVP to join events if capacity allows.
   - Users can leave events they joined, freeing a slot.
   - User dashboard shows "My Events" and "Events I joined".

4. **Password reset**
   - Users who forget their password can request a reset link.
   - Using the emailed token, they can set a strong new password that passes the strength rules.

---

## 🧪 Development Notes

- Backend logs include detailed messages for authentication, RSVP, and event update flows to make debugging easier.
- Error responses follow a simple JSON structure:

```
{ "message": "Human readable error message" }
```

- The frontend shows validation and server errors inline on the page instead of blocking alerts.

---

## 🧑‍💻 Project Owner

**Samiksha Lone**

- Email: `samikshalone2@gmail.com`
- GitHub: `https://github.com/Samiksha-Lone`
