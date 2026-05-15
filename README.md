# Tourism Platform

A full-stack tourism marketplace for travelers, guides, agencies, and administrators. The platform lets travelers explore tours, book trips, interact with the community, and manage their profiles. Agencies and guides can manage tour programs, bookings, reviews, employees, and premium offers, while administrators can review verification requests and manage reports.

## Features

- **Traveler experience**
  - Browse and search tours
  - View tour details
  - Book tours
  - Discover guides and agencies
  - Manage traveler profile
  - Use community posts and notifications

- **Agency and guide dashboard**
  - Dashboard overview
  - Manage agency or guide profile
  - Create, edit, and delete tour programs
  - Manage bookings
  - Review customer feedback
  - Manage settings and employees
  - Access premium offers

- **Admin dashboard**
  - View platform overview
  - Manage verification requests
  - Review report details

- **Authentication**
  - Email/password authentication
  - Google OAuth integration
  - Role-based navigation for travelers, agencies, guides, and admins

## Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Axios
- Lucide React
- Motion
- Google OAuth

### Backend

- Node.js
- Express
- Supabase
- JWT
- bcryptjs
- cookie-parser
- CORS
- Multer

## Project Structure

```text
Tourism_platform/
├── backend/
│   ├── config/
│   ├── routes/
│   ├── package.json
│   └── server.js
├── src/
│   └── frontend/
│       ├── components/
│       ├── contexts/
│       ├── pages/
│       ├── services/
│       ├── types/
│       ├── utils/
│       ├── AdminApp.tsx
│       ├── AgencyApp.tsx
│       ├── TravelerApp.tsx
│       ├── App.tsx
│       └── main.tsx
├── package.json
├── vite.config.ts
└── README.md
```

## Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- A Supabase project or access to the existing configured Supabase backend
- A Google OAuth client ID if you want Google authentication to work

## Environment Variables

Create a frontend environment file in the project root if Google OAuth is enabled:

```env
VITE_CLIENT_ID=your_google_oauth_client_id
```

The backend loads environment variables from `backend/.env` using `dotenv`. Add backend secrets there when needed, for example:

```env
PORT=5000
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret
```

Do not commit real API keys, service role keys, or secrets to version control.

## Installation

Install frontend dependencies from the project root:

```bash
npm install
```

Install backend dependencies:

```bash
cd backend
npm install
```

## Running the Project Locally

### 1. Start the backend

From the `backend` directory:

```bash
node server.js
```

By default, the backend runs on:

```text
http://localhost:5000
```

### 2. Start the frontend

From the project root:

```bash
npm run dev
```

By default, the Vite development server runs on:

```text
http://localhost:5173
```

The frontend API client is configured to call the backend at:

```text
http://localhost:5000
```

## Available Frontend Scripts

From the project root, you can run:

```bash
npm run dev
```

Starts the Vite development server.

```bash
npm run build
```

Builds the TypeScript project and generates the production Vite build.

```bash
npm run lint
```

Runs ESLint on the project.

```bash
npm run preview
```

Previews the production build locally.

## Main Application Routes

### Traveler routes

- `/` - Traveler app entry
- `/traveler` - Traveler home
- `/traveler/explore` - Explore tours
- `/traveler/guides` - Browse guides
- `/traveler/community` - Community page
- `/traveler/requests` - Traveler requests
- `/traveler/profile` - Traveler profile
- `/traveler/signin` - Sign in
- `/traveler/signup` - Sign up
- `/traveler/details/:tourId` - Tour details
- `/traveler/booking/:tourId` - Booking page

### Agency and guide routes

- `/agency` - Agency dashboard overview
- `/agency/profile` - Edit profile
- `/agency/tour-programs` - Manage tour programs
- `/agency/bookings` - Manage bookings
- `/agency/reviews` - Reviews
- `/agency/settings` - Settings
- `/agency/admin` - Agency admin page
- `/agency/add-tour` - Add tour program
- `/agency/edit-tour/:tourId` - Edit tour program
- `/agency/premium` - Premium offers

### Admin routes

- `/admin` - Admin dashboard overview
- `/admin/verifications` - Verification requests
- `/admin/verifications/:type/:id` - Verification request details
- `/admin/reports` - Reports management
- `/admin/reports/:type/:id` - Report details

## Backend API Mount Points

The Express server mounts these route groups:

- `/auth` - Authentication routes
- `/api` - Booking, tours browsing, reviews, agencies, and guides API routes
- `/pst` - Post routes
- `/tour` - Tour routes
- `/profile1` - Profile routes
- `/manager` - Manager and employee routes
- `/report` - Report routes
- `/verification` - Verification routes

## Build for Production

Run the frontend production build:

```bash
npm run build
```

The compiled frontend assets will be generated by Vite in the build output directory.

## Notes

- The frontend expects the backend to be running on `http://localhost:5000`.
- Backend CORS allows `http://localhost:5173`, `http://127.0.0.1:5173`, `http://localhost:3000`, and `http://127.0.0.1:3000`.
- The backend currently does not define a `start` script in `backend/package.json`, so use `node server.js` unless a script is added later.
