# Jobtrix Frontend

React + Vite + Tailwind CSS (v4). Light, professional theme with a blue accent.

## Setup

```bash
npm install
cp .env.example .env
```

.env mein backend ka URL confirm kar:
```
VITE_API_URL=http://localhost:4000/api
```
(agar backend ka PORT alag hai to yahan wahi port likhna)

Run:
```bash
npm run dev
```
Default: http://localhost:5173

## Structure

```
src/
  api/axios.js              - axios instance (withCredentials: true for cookie auth)
  context/AuthContext.jsx   - login state, role-aware
  components/
    Navbar.jsx               - responsive nav with mobile menu
    Footer.jsx
    Logo.jsx
    JobCard.jsx
    ProtectedRoute.jsx
  pages/
    Home.jsx                 - hero, categories, featured jobs, stats
    Jobs.jsx                 - search + filter
    JobDetails.jsx           - apply flow
    Login.jsx                - candidate/employer/admin tabs
    Register.jsx             - candidate/employer tabs
    Contact.jsx
    Blog.jsx                 - static blog listing
    BlogDetail.jsx
    candidate/Dashboard.jsx  - profile, resume, applications
    employer/Dashboard.jsx   - post job, my jobs, applicants, edit/delete job
    employer/Profile.jsx     - company profile, logo/cover upload
    admin/Dashboard.jsx      - stats, block/unblock candidates/employers/jobs
```

## Important
- Backend must have `CLIENT_URL=http://localhost:5173` in its `.env` (CORS) and cookies must work.
- Auth uses httpOnly cookies (set by backend on login) — the frontend never touches the JWT directly.
- Responsive across mobile, tablet, laptop, and desktop breakpoints.
