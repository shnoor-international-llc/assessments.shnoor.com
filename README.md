# MCQ Exam Portal

A full-stack MCQ Exam Portal built with React, Node.js, Express, PostgreSQL, and Firebase Authentication.

## Features
- **Student Portal**: Take exams, view results, and track progress.
- **Admin/Instructor Dashboard**: Create and manage exams, view student performance, and manage users.
- **Secure Authentication**: Firebase Auth for Students, JWT for Admins.

## Prerequisites

Before setup, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **PostgreSQL** (v12 or higher)
- **Git**

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. Firebase Setup (CRITICAL STEP)
You need a Firebase Project for authentication. **Both Backend and Frontend MUST use the SAME project.**

1.  Go to [Firebase Console](https://console.firebase.google.com/).
2.  Create a new project (e.g., `exam-portal-dev`).
3.  **Enable Authentication**:
    - Go to Build -> Authentication -> Get Started.
    - Select **Google** as the Sign-in provider and enable it.
4.  **Get Frontend Config**:
    - Project Settings -> General -> "Your apps" -> Add app (Web `</>`).
    - Register app (e.g., `frontend`).
    - Copy the `firebaseConfig` object values (apiKey, authDomain, etc.).
5.  **Get Backend Service Account**:
    - Project Settings -> Service accounts.
    - Click **Generate new private key**.
    - Save the file as `serviceAccountKey.json`.

### 3. Backend Setup

Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

#### Environment Configuration
1.  **Service Account**: Place the `serviceAccountKey.json` downloaded in step 2 into the `backend/` root folder.
2.  **Environment Variables**: Create `.env` from example:
    ```bash
    cp .env.example .env
    ```
    Update `.env` with your PostgreSQL credentials:
    ```env
    PORT=5000
    NODE_ENV=development
    
    # Database Configuration
    DB_USER=postgres
    DB_HOST=localhost
    DB_NAME=exam_portal
    DB_PASSWORD=your_password
    DB_PORT=5432
    
    # Path to the file you placed in step 1
    FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
    
    CLIENT_URL=http://localhost:5173
    ```

#### Database Initialization
Run the setup script. This will automatically create the database `exam_portal` if it doesn't exist, create tables, and seed a default admin.
```bash
# Ensure PostgreSQL service is running
npm run setup-db
```

### 4. Frontend Setup

Navigate to the frontend directory:
```bash
cd ../mcq-exam-portal
npm install
```

#### Environment Configuration
Create `.env` from example:
```bash
cp .env.example .env 2>/dev/null || copy .env.example .env
```

**IMPORTANT**: Fill in the Firebase config values from "Firebase Setup" Step 4.
```env
VITE_API_URL=http://localhost:5000/api

# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=exam-portal-dev.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=exam-portal-dev
VITE_FIREBASE_STORAGE_BUCKET=exam-portal-dev.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

## Running the Application

### Start Backend
In `backend/`:
```bash
npm run dev
# Server running on http://localhost:5000
```

### Start Frontend
In `mcq-exam-portal/`:
```bash
npm run dev
# App running on http://localhost:5173
```

## Login Credentials

### Admin Login
- **URL**: `http://localhost:5173/admin/login`
- **Email**: `admin@example.com`
- **Password**: `admin123`

### Student Login
- **URL**: `http://localhost:5173/login`
- **Method**: Sign in via Google.
- **Note**: If getting "Token Verify Error", ensure `serviceAccountKey.json` and Frontend `.env` keys belong to the **same** Firebase project.

## Troubleshooting

### "Database does not exist"
- The `npm run setup-db` script tries to create it automatically. If it fails, create it manually: `createdb exam_portal` (Mac/Linux) or via pgAdmin.

### "Token verification failed" or "Registration Failed"
- This usually means **Firebase Project Mismatch**.
- Check `backend/serviceAccountKey.json`: Look for `project_id`.
- Check `mcq-exam-portal/.env`: Look for `VITE_FIREBASE_PROJECT_ID`.
- **They must match.**

### "Firebase: Error (auth/configuration-not-found)"
- You enabled Google Auth in the console but didn't wait a few minutes, or missed adding the support email.
- Ensure "Google" is enabled in Authentication -> Sign-in method.
