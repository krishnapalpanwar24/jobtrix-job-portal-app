# Jobtrix — Full-Stack Job Portal

A MERN-stack job portal with three roles — Candidate, Employer, and Admin. Built with Node.js/Express/MongoDB on the backend and React/Vite/Tailwind on the frontend, with ImageKit for file storage and httpOnly-cookie based JWT auth.

# 🔗 [Jobtrix App](https://jobtrix-job-portal-app.vercel.app/)

> Note: Backend is hosted on Render's free tier — first request after inactivity may take 30-50 seconds to load (cold start).

## Project structure

```
fullStack mern project/
├── backend   — API server
└── frontend           — React client
```

Each folder has its own README with detailed setup and API/component docs.

## Quick start

**1. Backend**
```bash
cd backend
npm install
cp .env.example .env   # fill in MongoDB URI, JWT secret, ImageKit keys, etc.
npm run dev
```
Runs on `http://localhost:4000` (or whatever `PORT` you set).

**2. Frontend**
```bash
cd frontend
npm install
cp .env.example .env   # confirm VITE_API_URL matches your backend URL/port
npm run dev
```
Runs on `http://localhost:5173`.

Both need to be running at the same time for the app to work.

## Features

- **Auth** — Candidate / Employer / Admin, JWT via httpOnly cookies
- **File uploads** — profile photo, resume, company logo, cover image — all stored on ImageKit, not the server disk
- **Jobs** — post, edit, delete, search & filter (keyword, category, job type, city, salary range, experience)
- **Applications** — candidates apply and track status; employers review applicants and update status (shortlisted / rejected / hired)
- **Admin panel** — dashboard stats, block/unblock candidates, employers, and jobs
- **Frontend** — light, responsive UI (mobile/tablet/laptop/desktop), search, dashboards for all three roles, blog, contact form

## Tech stack

| Layer | Stack |
|---|---|
| Backend | Node.js, Express 5, MongoDB (Mongoose), JWT, bcrypt, Multer, ImageKit |
| Frontend | React 19, Vite, Tailwind CSS v4, React Router, Axios, lucide-react |
| Deployment | Vercel (frontend), Render (backend) |

## Security notes for deployment
`.env` files are git-ignored on purpose — never commit real secrets. Use `.env.example` as the template. Before going to production, consider adding rate limiting, Helmet, and input sanitization (not included by default here to keep the project simple for learning/portfolio use).
