# EventHub

A full-stack MERN event management platform for creating, discovering, and managing both online and offline events with RSVP workflows, secure authentication, and community-focused features.

## 🔗 Links

- 🚀 **Live Demo**: [https://eventhub-eight.vercel.app/](https://eventhub-eight.vercel.app/)
- 💻 **GitHub Repository**: [https://github.com/Samiksha-Lone/event-platform](https://github.com/Samiksha-Lone/event-platform)

## Problem Statement

Event organizers struggle with fragmented platforms for managing local and online events. Attendees need centralized event discovery with filtered categories. Both parties require reliable RSVP capacity enforcement, attendance tracking, and a simple interface without payment complexity.

## Problem–Solution Mapping

EventHub provides centralized event discovery via category-based filtering and full-text search. RSVP capacity is enforced in real-time with automatic availability checks. Event organizers use a structured creation form supporting both online (Zoom, Google Meet, Teams, Webex) and offline (location-based) events. Users authenticate securely via JWT tokens in HTTP-only cookies with login attempt limiting (5 attempts = 2-hour lockout). Attendees can review events post-attendance, and organizers access basic analytics. The responsive UI supports dark mode and works across devices.

## 🚀 Features

Core platform features include:

- 🔐 **User Authentication**: Secure registration, login, and password reset via email with JWT tokens and 2FA support
- 📅 **Event Management**: Create, edit, and delete events with image uploads and comprehensive details
- 🌐 **Online & Offline Events**: Support for online events (Zoom, Google Meet, Teams, Webex) and location-based offline events
- 🔍 **Smart Discovery**: Real-time search and category filtering (tech, music, sports, food, other)
- 📝 **RSVP System**: Real-time capacity enforcement with automatic availability checks
- ⭐ **Reviews & Ratings**: Attendees can review and rate events post-attendance
- 🤖 **Personalized Recommendations**: Intelligent recommendations based on user interests and preferences
- 🔥 **Trending Events**: Discover what's popular and trending in your community
- 📊 **Organizer Dashboard**: Analytics and attendee management for event creators
- 👥 **Social Features**: Follow/unfollow users for networking and community building
- 🌙 **Dark Mode**: Premium UI/UX with responsive design and dark/light mode support
- 🔔 **Notifications**: Toast notifications for user feedback and real-time updates

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite 7, Tailwind CSS 4, React Router 7, Axios, Lucide & React Icons
- **Backend:** Node.js, Express 5, MongoDB 9, Mongoose 9
- **Auth:** JWT, bcryptjs (10 salt rounds), speakeasy (TOTP/2FA), qrcode
- **Security:** Helmet.js, express-rate-limit, express-mongo-sanitize, csurf, cookie-parser
- **Media & Email:** ImageKit (file storage), SendGrid (email notifications)
- **Utilities:** Winston (logging), Redis (caching support), uuid, multer

## Installation / Setup

1. Clone the repository:

```bash
git clone https://github.com/Samiksha-Lone/event-platform.git
cd event-platform
```

2. Install server dependencies:

```bash
cd server
npm install
```

3. Create and configure server environment variables:

```env
PORT=3000
NODE_ENV=development
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key
CLIENT_URL=http://localhost:5173
```

4. Start the backend:

```bash
npm run dev
```

5. Install frontend dependencies in a second terminal:

```bash
cd ../client
npm install
npm run dev
```

6. Open the app at:

```bash
http://localhost:5173
```

## 📸 Screenshots

### Dashboard
![Dashboard screenshot](outputs/dashboard.webp)

### Create Event
![Create event screenshot](outputs/create-event.webp)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Credit

If you use or build upon this project, please provide attribution:
Samiksha Lone
https://github.com/Samiksha-Lone