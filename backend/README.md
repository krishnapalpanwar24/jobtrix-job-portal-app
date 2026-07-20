# Jobtrix Backend

Job portal API — Candidate, Employer, Admin roles. Built with Node.js, Express, MongoDB (Mongoose), JWT auth, and ImageKit for file storage (images + resumes).

## Setup

```bash
cd backend
npm install
cp .env.example .env
```

Fill in `.env`:
- `MONGO_URI` — your MongoDB connection string (Atlas or local)
- `JWT_SECRET` — any long random string
- `IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, `IMAGEKIT_URL_ENDPOINT` — from ImageKit dashboard → Developer Options
- `ADMIN_SIGNUP_CODE` — a secret string only you know, needed to register an admin account
- `CLIENT_URL` — your frontend URL (for CORS), e.g. `http://localhost:5173`

Run:
```bash
npm run dev
```

## API Overview

### Candidate (`/api/user`)
- `POST /register`, `POST /login`, `POST /logout`
- `GET /getprofile` (auth)
- `PUT /update-personal-info` (auth, multipart: profileImage)
- `PUT /update-resume` (auth, multipart: resume)

### Employer (`/api/employer`)
- `POST /register`, `POST /login`, `POST /logout`
- `GET /profile` (auth)
- `PUT /update` (auth, multipart: logo, coverImage)
- `GET /:id` (public — view company)

### Jobs (`/api/job`)
- `GET /all` — search/filter/paginate: `?keyword=&category=&jobType=&city=&minSalary=&maxSalary=&experience=&page=&limit=`
- `GET /:id` — public single job
- `POST /create` (employer)
- `PUT /:id` (employer)
- `DELETE /:id` (employer)
- `GET /employer/my-jobs` (employer)

### Applications (`/api/application`)
- `POST /apply` (candidate) — body: `{ jobId }`
- `GET /my-applications` (candidate)
- `GET /job/:jobId` (employer) — see applicants
- `PUT /:id/status` (employer) — body: `{ status: "shortlisted" | "rejected" | "hired" | "applied" }`

### Admin (`/api/admin`)
- `POST /register` — body needs `signupCode` matching `ADMIN_SIGNUP_CODE`
- `POST /login`, `POST /logout`
- `GET /dashboard-stats`
- `GET /candidates`, `PUT /candidates/:id/toggle-block`, `DELETE /candidates/:id`
- `GET /employers`, `PUT /employers/:id/toggle-block`, `DELETE /employers/:id`
- `GET /jobs`, `PUT /jobs/:id/toggle-block`, `DELETE /jobs/:id`
- `GET /contacts`

### Contact (`/api/contact`)
- `POST /` — body: `{ name, email, subject, message }`

## Notes
- All file uploads (profile pics, resumes, logos, covers) go straight to ImageKit — nothing is stored on local disk.
- **Auth is httpOnly-cookie based** — on login, the server sets a `token` cookie automatically. The frontend never touches the JWT directly; it just needs `withCredentials: true` on requests.
