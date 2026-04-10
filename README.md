# EventHub

A modern event platform for creating, discovering, and managing events with secure user access and RSVP workflows.

## 🔗 Links

- **Live Demo**: [https://eventhub-eight.vercel.app/](https://eventhub-eight.vercel.app/)
- **GitHub Repository**: [https://github.com/Samiksha-Lone/event-platform](https://github.com/Samiksha-Lone/event-platform)

## Problem Statement

Organizers and attendees need a reliable way to manage local and virtual events while keeping sign-ups, capacity, and event details synchronized across devices. Many event platforms are fragmented, lack real-time RSVP feedback, and do not support easy event marketing assets for organizers.

## Problem–Solution Mapping

To address fragmented event discovery, we provide a centralized event feed with category filters and search. For unclear RSVP status and unenforced capacity, we implement a RSVP system with capacity checks and live attendance counts. Event creation is streamlined with a structured flow including easy editing and image support. Secure registration uses JWT-based authentication with HTTP-only cookies and route protection. The UI is responsive across devices using React and Tailwind CSS with dark mode.

## System Architecture

- **Frontend:** React-based client with responsive design and dark mode support
- **Backend:** Express.js server providing REST API endpoints
- **Database:** MongoDB for storing user, event, and RSVP data
- **Authentication:** JWT-based system with secure HTTP-only cookies
- **Security:** Rate limiting, input validation, sanitization, and CORS protection

## Features

- User registration and secure login
- Event creation, update, and deletion
- Search and category filtering for event discovery
- RSVP management with attendance limits
- Personal dashboard for created and attending events
- Guided event creation with media upload support
- Real-time UI feedback with toast notifications
- Responsive design across devices

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, React Router, Axios
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Security:** JWT, bcryptjs, helmet, express-rate-limit, express-mongo-sanitize
- **Media:** Image upload support for event posters and galleries
- **Utilities:** Cookie parser, multer, nodemailer, csurf

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

## Screenshots

![Dashboard screenshot](outputs/dashboard.webp)

![Create event screenshot](outputs/create-event.webp)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Credit

If you use or build upon this project, please provide attribution:
Samiksha Lone
https://github.com/Samiksha-Lone