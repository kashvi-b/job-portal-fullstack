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

















   
