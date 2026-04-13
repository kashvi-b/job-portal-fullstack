# 💼 Job Portal - Full Stack College Project

A full-stack job portal built with **React, Node.js, Express, and MongoDB**.

---

## 📁 Project Structure

```
job-portal/
├── backend/
│   ├── controllers/         # Business logic (what happens when API is called)
│   │   ├── authController.js
│   │   ├── jobController.js
│   │   ├── applicationController.js
│   │   └── profileController.js
│   ├── models/              # MongoDB database schemas (data structure)
│   │   ├── User.js
│   │   ├── Job.js
│   │   └── Application.js
│   ├── routes/              # URL patterns that map to controllers
│   │   ├── authRoutes.js
│   │   ├── jobRoutes.js
│   │   ├── applicationRoutes.js
│   │   └── profileRoutes.js
│   ├── middleware/          # Functions that run before routes
│   │   └── authMiddleware.js
│   ├── uploads/             # Uploaded resume files (auto-created)
│   ├── server.js            # Main entry point
│   ├── .env.example         # Environment variable template
│   └── package.json
│
└── frontend/
    └── src/
        ├── context/         # Global state (auth info)
        │   └── AuthContext.js
        ├── services/        # All API calls in one place
        │   └── api.js
        ├── components/      # Reusable UI components
        │   ├── Navbar.js
        │   └── JobCard.js
        ├── pages/           # Full page components
        │   ├── Home.js
        │   ├── Login.js
        │   ├── Signup.js
        │   ├── JobListings.js
        │   ├── JobDetails.js
        │   ├── SeekerDashboard.js
        │   ├── RecruiterDashboard.js
        │   ├── PostJob.js
        │   ├── Applications.js
        │   └── Profile.js
        ├── App.js           # Routes and layout
        └── App.css          # Global styles
```

---

## ⚙️ Setup & Installation

### Step 1: Clone / Download the project

### Step 2: Set up the Backend

```bash
cd job-portal/backend
npm install
```

Create a `.env` file (copy from `.env.example`):
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jobportal
JWT_SECRET=myverylongsecretkey12345
PORT=5000
```

> **How to get MongoDB URI:** Go to [MongoDB Atlas](https://www.mongodb.com/atlas) → Create free cluster → Connect → Get connection string

Start the backend:
```bash
npm run dev
```

### Step 3: Set up the Frontend

```bash
cd job-portal/frontend
npm install
npm start
```

The app opens at `http://localhost:3000`

---

## 🎓 VIVA EXPLANATION GUIDE

### 1. Project Overview

> "This is a full-stack job portal where two types of users — **Job Seekers** and **Recruiters** — can interact. Seekers can browse jobs and apply to them. Recruiters can post jobs and manage applications. The project uses React for the frontend, Node.js with Express for the backend API, MongoDB for the database, and JWT for authentication."

---

### 2. System Architecture

```
[React Frontend]  ←→  [Express Backend]  ←→  [MongoDB]
     :3000               :5000                (Cloud)

How it works:
- User opens the React app in their browser
- React app sends HTTP requests to the Express backend
- Express processes the request and reads/writes to MongoDB
- Express sends back a JSON response
- React displays the data to the user
```

---

### 3. Database Design

**Users Collection:**
```json
{
  "_id": "ObjectId",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "hashed_password",
  "role": "seeker",            // or "recruiter"
  "bio": "...",
  "skills": ["React", "Node"],
  "resumeLink": "...",
  "companyName": "...",        // for recruiters
  "createdAt": "2024-01-15"
}
```

**Jobs Collection:**
```json
{
  "_id": "ObjectId",
  "title": "Frontend Developer",
  "description": "...",
  "company": "Tech Corp",
  "location": "Remote",
  "salary": "$60,000",
  "jobType": "Full-time",
  "requirements": ["React", "CSS"],
  "postedBy": "ObjectId → User",   // Foreign key to recruiter
  "isActive": true
}
```

**Applications Collection:**
```json
{
  "_id": "ObjectId",
  "job": "ObjectId → Job",           // Which job
  "applicant": "ObjectId → User",    // Who applied
  "coverLetter": "...",
  "status": "Pending"                // Pending/Reviewed/Accepted/Rejected
}
```

---

### 4. How Authentication Works (JWT)

> "When a user logs in, the server verifies their email and password. If correct, it creates a **JWT (JSON Web Token)** — a digitally signed string containing the user's ID. This token is sent to the frontend and stored in `localStorage`. Every subsequent API request includes this token in the `Authorization` header. The backend's `authMiddleware` reads this header, verifies the token, and identifies the user. This way, we don't need to store session data on the server."

```
Login Request → Server checks password → Creates JWT token
                                               ↓
Frontend stores token in localStorage
                                               ↓
Next API Request → Sends "Authorization: Bearer <token>"
                                               ↓
Server verifies token → Identifies user → Processes request
```

---

### 5. How a User Applies for a Job (Complete Flow)

**Step 1:** Seeker browses to `/jobs` — React calls `GET /api/jobs`  
**Step 2:** Backend queries MongoDB for active jobs and returns JSON  
**Step 3:** React renders job cards  
**Step 4:** Seeker clicks a job → goes to `/jobs/:id` → React calls `GET /api/jobs/:id`  
**Step 5:** Seeker clicks "Apply Now" → a form appears  
**Step 6:** Seeker writes cover letter and clicks Submit  
**Step 7:** React calls `POST /api/applications` with `{ jobId, coverLetter }` and JWT token in header  
**Step 8:** Backend's `authMiddleware` verifies the JWT token  
**Step 9:** Backend checks if seeker already applied (no duplicate applications)  
**Step 10:** Backend creates an `Application` document in MongoDB  
**Step 11:** Backend returns success response  
**Step 12:** React shows "Application submitted!" message  
**Step 13:** Recruiter logs in and visits `/applications/:jobId`  
**Step 14:** React calls `GET /api/applications/job/:jobId`  
**Step 15:** Backend returns all applications for that job  
**Step 16:** Recruiter can click Accept/Reject → `PUT /api/applications/:id/status`  
**Step 17:** Status updates in MongoDB and seeker can see it in their dashboard  

---

### 6. REST API Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/signup` | Public | Create account |
| POST | `/api/auth/login` | Public | Login |
| GET | `/api/auth/me` | Protected | Get logged-in user |
| GET | `/api/jobs` | Public | Get all jobs |
| GET | `/api/jobs/:id` | Public | Get single job |
| POST | `/api/jobs` | Recruiter | Post a job |
| PUT | `/api/jobs/:id` | Recruiter | Update job |
| DELETE | `/api/jobs/:id` | Recruiter | Delete job |
| POST | `/api/applications` | Seeker | Apply to job |
| GET | `/api/applications/my-applications` | Seeker | View own applications |
| GET | `/api/applications/job/:jobId` | Recruiter | View job's applicants |
| PUT | `/api/applications/:id/status` | Recruiter | Accept/Reject |
| GET | `/api/profile` | Protected | Get profile |
| PUT | `/api/profile` | Protected | Update profile |

---

### 7. Key Concepts Explained

**Why MongoDB?**  
MongoDB stores data as JSON-like documents, making it easy to work with JavaScript. No complex table relationships — just store what you need.

**Why JWT instead of sessions?**  
Sessions store data on the server (needs more memory). JWT is stateless — the token itself contains user info. Perfect for APIs used by multiple frontends.

**Why React Context?**  
Instead of passing the logged-in user as a prop through every component, Context acts as global state — any component can access `user`, `login()`, `logout()` directly.

**What is Mongoose?**  
Mongoose is an ODM (Object Document Mapper) that provides a nice JavaScript API to interact with MongoDB. We define schemas (blueprints) and Mongoose handles the database queries.

**What is middleware?**  
Middleware is code that runs between the request and the response. Our `authMiddleware` checks the JWT token before allowing access to protected routes.

---

## 🚀 Deployment Guide

### Backend → Deploy on Render (Free)

1. Push your code to **GitHub**
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your GitHub repo
4. Settings:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `node server.js`
5. Add Environment Variables (same as your `.env` file):
   - `MONGODB_URI` = your Atlas connection string
   - `JWT_SECRET` = your secret key
   - `PORT` = 5000
6. Click **Deploy** → You get a URL like `https://jobportal-api.onrender.com`

### Frontend → Deploy on Vercel (Free)

1. In your frontend, create a `.env` file:
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com/api
   ```
2. Go to [vercel.com](https://vercel.com) → Import Project from GitHub
3. Settings:
   - Root Directory: `frontend`
   - Framework Preset: Create React App
4. Add Environment Variable:
   - `REACT_APP_API_URL` = your Render backend URL + `/api`
5. Click **Deploy** → You get a URL like `https://jobportal.vercel.app`

> ⚠️ **Important:** After deploying the backend, update `CORS` in `server.js` to allow your Vercel domain:
> ```js
> app.use(cors({ origin: "https://your-app.vercel.app" }));
> ```

---

## 🧪 Testing the API (using Thunder Client or Postman)

**Test Signup:**
```
POST http://localhost:5000/api/auth/signup
Body: { "name": "John", "email": "john@test.com", "password": "123456", "role": "seeker" }
```

**Test Login:**
```
POST http://localhost:5000/api/auth/login
Body: { "email": "john@test.com", "password": "123456" }
→ Copy the token from the response
```

**Test Protected Route:**
```
GET http://localhost:5000/api/profile
Header: Authorization: Bearer <paste token here>
```

---

## 📝 Technologies Used

| Technology | Purpose |
|------------|---------|
| React 18 | Frontend UI library |
| React Router v6 | Client-side page navigation |
| Axios | HTTP requests from frontend to backend |
| Node.js | JavaScript runtime for backend |
| Express.js | Web framework for building APIs |
| MongoDB Atlas | Cloud database (free tier) |
| Mongoose | MongoDB ODM for Node.js |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT creation and verification |
| multer | File uploads (resumes) |
| dotenv | Environment variable management |
| cors | Allow cross-origin requests |
