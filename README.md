# Full Stack Job Portal

## Overview

This project is a **Full Stack Job Portal** that allows job seekers to search and apply for jobs while recruiters can post job openings and manage applications.
The system is designed to demonstrate the implementation of **frontend, backend, authentication, and database integration** in a full stack web application.

The project is built using **React for the frontend, Node.js and Express for the backend, and MongoDB for the database.**

---

## Features

### Job Seeker

* User registration and login
* Create and update profile
* Search available jobs
* View job details
* Apply for jobs
* Track applied jobs

### Recruiter

* Recruiter registration and login
* Post job openings
* Manage job listings
* View job applications
* Accept or reject candidates

### General Features

* Secure authentication using JWT
* REST API architecture
* Responsive frontend UI
* Database storage using MongoDB

---

## Tech Stack

### Frontend

* React
* JavaScript
* HTML
* CSS

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### Authentication

* JSON Web Token (JWT)
* Password hashing using bcrypt

---

## Project Structure

```
job-portal
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   └── App.js
│
├── backend
│   ├── models
│   ├── routes
│   ├── controllers
│   ├── middleware
│   └── server.js
│
└── README.md
```

---

## System Workflow

1. User registers and logs into the system.
2. Job seekers can search and apply for jobs.
3. Recruiters can post job listings.
4. Applications are stored in the database.
5. Recruiters can review and manage job applications.

---

## Installation

### Clone the repository

```
git clone https://github.com/yourusername/job-portal-fullstack.git
```

### Navigate to the project folder

```
cd job-portal-fullstack
```

---

### Install backend dependencies

```
cd backend
npm install
```

Start backend server

```
npm start
```

---

### Install frontend dependencies

```
cd frontend
npm install
```

Run frontend

```
npm start
```

---

## Environment Variables

Create a `.env` file in the backend folder.

Example:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

---

## Future Improvements

* Resume upload feature
* Job recommendation system
* Email notifications
* Admin dashboard
* Advanced job filtering

---

## Learning Outcomes

This project helped in understanding:

* Full Stack Development workflow
* REST API development
* Authentication and security
* Database integration
* Frontend and backend communication

---

## Author

Kashvi Bhardwaj




















   
