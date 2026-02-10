# 🎓 MCQ Exam Portal with Live Proctoring

A modern, secure online examination platform with real-time proctoring capabilities built with React, Node.js, Express, PostgreSQL, Firebase Authentication, and Socket.io.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-19.x-61dafb.svg)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/postgresql-14%2B-336791.svg)](https://www.postgresql.org/)

---

## ✨ Key Features

### 🎯 Student Features
- 🔐 **Secure Authentication** via Firebase
- 📝 **Interactive Test Interface** with real-time timer
- 💾 **Manual Progress Saving** (Save & Next, Skip)
- ⏸️ **Resume Capability** - Continue from where you left off
- 🎬 **Fullscreen Enforcement** with warnings
- 👁️ **Tab Switch Detection** (3 warnings → auto-submit)
- 📊 **Instant Results** with detailed analysis
- 🎥 **Live Proctoring** - Camera monitoring during exams
- 🏫 **Institute-Based Access** - Tests assigned by institute

### 👨‍💼 Admin Features
- ✏️ **Create Tests** - Manual or Bulk Upload (CSV/Excel)
- 🔍 **Real-time Name Checker** - Prevent duplicate test names
- 📋 **Test Management** - Draft/Published/Archived status
- 🗑️ **Complete Deletion** - Removes all related data
- 📈 **Results Analytics** - Highest score per student
- 📥 **Excel Export** - Download results instantly
- 👥 **Student Tracking** - Monitor performance by institute
- 🎥 **Live Proctoring Dashboard** - Monitor all active exams in real-time
- 📹 **Multi-Student Monitoring** - View multiple students simultaneously
- 🔴 **Live Streaming** - Real-time video feeds with student info

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | React 19, Vite, Tailwind CSS, Lucide Icons |
| **Backend** | Node.js 16+, Express.js, Socket.io |
| **Database** | PostgreSQL 14+ |
| **Authentication** | Firebase Auth (Email/Password) |
| **Real-time** | Socket.io (WebSocket + Polling) |
| **File Processing** | Multer, ExcelJS, CSV Parser |

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- ✅ **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- ✅ **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)
- ✅ **Git** - [Download](https://git-scm.com/)
- ✅ **Firebase Account** - [Create Account](https://console.firebase.google.com/)

---

## 🚀 Installation Guide

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/mcq-exam-portal.git
cd mcq-exam-portal
```

---

### Step 2: Backend Setup

#### 2.1 Install Dependencies

```bash
cd backend
npm install
```

#### 2.2 Configure Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_USER=postgres
DB_HOST=localhost
DB_NAME=exam_portal
DB_PASSWORD=your_database_password
DB_PORT=5432

# JWT Secret (generate a strong random string)
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_random

# Firebase Service Account Path
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173
```

#### 2.3 Setup Firebase Admin SDK

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Navigate to **Project Settings** → **Service Accounts**
4. Click **Generate New Private Key**
5. Save the downloaded JSON file as `serviceAccountKey.json` in the `backend/` directory

> ⚠️ **Security Warning**: Never commit `serviceAccountKey.json` to version control!

#### 2.4 Create PostgreSQL Database

```bash
# Open PostgreSQL command line
psql -U postgres

# Create database
CREATE DATABASE exam_portal;

# Exit psql
\q
```

#### 2.5 Initialize Database Schema

```bash
npm run setup-db
```

This command will:
- ✅ Create all necessary tables
- ✅ Set up relationships and constraints
- ✅ Create a default admin account

---

### Step 3: Frontend Setup

#### 3.1 Install Dependencies

```bash
cd ../mcq-exam-portal
npm install
```

#### 3.2 Configure Environment Variables

Create a `.env` file in the `mcq-exam-portal` directory:

```env
# Backend API URL
VITE_API_URL=http://localhost:5000

# Firebase Configuration
# Get these values from Firebase Console → Project Settings → General → Your apps
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

#### 3.3 Get Firebase Web Configuration

1. In Firebase Console, go to **Project Settings** → **General**
2. Scroll to **Your apps** section
3. Click **Add app** → **Web** (</> icon)
4. Register your app with a nickname
5. Copy the configuration values
6. Paste them into your `.env` file

---

## ▶️ Running the Application

### Start Backend Server

Open a terminal in the `backend` directory:

```bash
npm run dev
```

✅ Server will start on `http://localhost:5000`

You should see:
```
Server running on port 5000
Environment: development
API: http://localhost:5000
Socket.io: Ready for proctoring connections
```

### Start Frontend Development Server

Open another terminal in the `mcq-exam-portal` directory:

```bash
npm run dev
```

✅ Application will open on `http://localhost:5173`

---

## 🔑 Default Login Credentials

### 👨‍💼 Admin Login

**URL:** `http://localhost:5173/admin/login`

```
Email: admin@example.com
Password: admin123
```

> ⚠️ **Important**: Change the default password after first login!

### 👨‍🎓 Student Registration

**URL:** `http://localhost:5173/register`

Students must register with:
- Full Name
- Institute/University Name
- Roll Number (unique)
- Email (unique)
- Password (minimum 8 characters)

---

## 📖 Usage Guide

### For Administrators

#### Creating a Test

**Option A: Manual Entry**
1. Login to admin dashboard
2. Click **Create Test** tab
3. Fill in test details:
   - Test Title (must be unique)
   - Description
   - Duration (minutes)
   - Passing Percentage
   - Max Attempts
   - Start/End DateTime (optional)
4. Choose **Manual Entry**
5. Add questions one by one
6. Click **Save Assessment**
7. Click **Publish Test** to make it available

**Option B: Bulk Upload (CSV/Excel)**
1. Login to admin dashboard
2. Click **Create Test** tab
3. Fill in test details
4. Choose **Bulk Upload**
5. Upload CSV/Excel file with questions
6. Click **Save Assessment**
7. Click **Publish Test**

**CSV Format:**
```csv
Question,Option A,Option B,Option C,Option D,Correct Option,Marks
What is 2+2?,3,4,5,6,B,1
Capital of France?,London,Paris,Berlin,Madrid,B,1
```

#### Assigning Tests to Students

1. Go to **Assign Tests** tab
2. Select a test from the dropdown
3. Choose students by:
   - **Institute**: Select all students from an institute
   - **Individual**: Select specific students
4. Click **Assign Test**
5. Students will see the test in their dashboard

#### Live Proctoring Dashboard

1. Click **Live Proctoring** in the navigation
2. View all active exam sessions
3. Monitor students in real-time:
   - Live video feed
   - Student name and ID
   - Test name
   - Session duration
   - Connection status
4. Multiple students displayed in a grid layout
5. Automatic updates when students join/leave

**Proctoring Features:**
- 🔴 Live indicator on active streams
- ⏱️ Session duration timer
- 📊 Connection status (Streaming/Connected)
- 🎥 Real-time video at 5 FPS
- 👥 Multi-student grid view

#### Managing Tests

- **View Tests**: See all tests with statistics
- **Publish/Unpublish**: Control test visibility
- **Delete Test**: Permanently remove test and all data
- **View Results**: Click on a test to see student results
- **Export Results**: Download as Excel file

### For Students

#### Taking a Test

1. Login to student dashboard
2. View assigned tests
3. Click **Start Test** on any available test
4. **Grant camera permission** when prompted (required for proctoring)
5. Read instructions carefully
6. Click **Enter Fullscreen Mode**
7. Click **Start Examination**
8. Answer questions:
   - Click **Save & Next** to save and move forward
   - Click **Skip** to skip current question
   - Click question numbers to navigate
   - Mark questions for review if needed
9. Click **Finish Test** (bottom-right corner) when done

**Important Notes:**
- ✅ Camera must be enabled for proctoring
- ✅ Stay in fullscreen mode
- ✅ Don't switch tabs (3 warnings → auto-submit)
- ✅ Progress saves only on Save & Next or Skip
- ✅ Timer continues if you leave and return
- ✅ Admin can see your live video feed

#### Viewing Results

- After submission, view your score immediately
- See detailed breakdown:
  - Total marks obtained
  - Percentage
  - Pass/Fail status
  - Correct/Incorrect answers
  - Time taken

---

## 🎥 Live Proctoring System

### How It Works

1. **Student Side:**
   - Camera permission requested at test start
   - Video captured at 5 frames per second
   - Frames sent to server via Socket.io
   - No video preview shown to student
   - Camera automatically stops when test ends

2. **Admin Side:**
   - Real-time dashboard shows all active sessions
   - Live video feeds displayed in grid layout
   - Student information overlay (name, ID, test)
   - Connection status indicators
   - Automatic session management

3. **Technical Details:**
   - Frame-based streaming (not WebRTC)
   - Base64 JPEG encoding at 60% quality
   - 640x480 resolution
   - Socket.io for real-time communication
   - Automatic reconnection handling

### Privacy & Security

- ✅ Video is streamed live only (no recording)
- ✅ No snapshots saved to disk
- ✅ Camera stops immediately when test ends
- ✅ Camera stops on tab switch or browser close
- ✅ Secure WebSocket connection
- ✅ Only admins can view proctoring dashboard

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | Student registration |
| POST | `/api/login` | Student login |
| POST | `/api/admin/login` | Admin login |

### Test Management (Admin)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tests` | List all tests |
| GET | `/api/tests/check-name/:name` | Check test name availability |
| POST | `/api/upload/manual` | Create test with questions |
| POST | `/api/upload/questions` | Bulk upload questions |
| PUT | `/api/tests/:id/status` | Update test status |
| DELETE | `/api/tests/:id` | Delete test |

### Test Assignment (Admin)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tests/institutes` | Get all institutes |
| GET | `/api/tests/institutes/:name/students` | Get students by institute |
| POST | `/api/tests/assign` | Assign test to students |
| GET | `/api/tests/:id/assignments` | View test assignments |

### Student Exam

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/student/tests` | Get assigned tests |
| GET | `/api/student/test/:id` | Get test details |
| POST | `/api/student/save-progress` | Save exam progress |
| POST | `/api/student/submit-exam` | Submit exam |

### Results & Export (Admin)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/export/all-results` | Get all results (JSON) |
| GET | `/api/export/results` | Export to Excel |

### Socket.io Events (Proctoring)

| Event | Direction | Description |
|-------|-----------|-------------|
| `student:join-proctoring` | Student → Server | Join proctoring session |
| `proctoring:frame` | Student → Server | Send video frame |
| `admin:join-monitoring` | Admin → Server | Join monitoring room |
| `student:joined` | Server → Admin | New student joined |
| `student:left` | Server → Admin | Student left |
| `proctoring:frame` | Server → Admin | Relay video frame |

---

## 📂 Project Structure

```
mcq-exam-portal/
│
├── backend/                          # Node.js + Express API
│   ├── config/
│   │   ├── db.js                     # PostgreSQL connection
│   │   ├── firebase.js               # Firebase Admin SDK
│   │   └── queries.js                # SQL query builders
│   │
│   ├── middleware/
│   │   ├── verifyToken.js            # Student JWT auth
│   │   └── verifyAdmin.js            # Admin JWT auth
│   │
│   ├── routes/
│   │   ├── auth.js                   # Student authentication
│   │   ├── adminAuth.js              # Admin authentication
│   │   ├── student.js                # Student exam routes
│   │   ├── test.js                   # Test management
│   │   ├── upload.js                 # Question upload
│   │   └── export.js                 # Results export
│   │
│   ├── services/
│   │   └── exportService.js          # Excel export
│   │
│   ├── server.js                     # Express + Socket.io server
│   ├── database.sql                  # Database schema
│   ├── setup-database.js             # DB initialization
│   ├── .env                          # Environment variables
│   └── package.json
│
├── mcq-exam-portal/                  # React + Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   └── CreateTestSection.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── FullscreenWarning.jsx
│   │   │
│   │   ├── config/
│   │   │   └── firebase.js           # Firebase client config
│   │   │
│   │   ├── hooks/
│   │   │   ├── useFullScreen.jsx
│   │   │   ├── useTabSwitch.jsx
│   │   │   ├── useTimer.jsx
│   │   │   └── useProctoringSimple.jsx  # Proctoring hook
│   │   │
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   └── LiveProctoring.jsx   # Proctoring dashboard
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Instructions.jsx
│   │   │   ├── TestScreen.jsx
│   │   │   ├── Results.jsx
│   │   │   └── Feedback.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── .env
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── sample_general_knowledge.csv      # Sample questions
├── sample_programming_test.csv       # Sample questions
└── README.md                         # This file
```

---

## 🗄️ Database Schema

### Main Tables

**students**
- `id` - Primary key
- `firebase_uid` - Firebase user ID
- `full_name` - Student name
- `email` - Unique email
- `roll_number` - Unique roll number
- `institute` - Institute/University name
- `created_at` - Registration timestamp

**admins**
- `id` - Primary key
- `email` - Unique email
- `password_hash` - Bcrypt hashed password
- `full_name` - Admin name
- `created_at` - Creation timestamp

**tests**
- `id` - Primary key
- `title` - Test name (unique, case-insensitive)
- `description` - Test description
- `duration` - Duration in minutes
- `passing_percentage` - Minimum percentage to pass
- `max_attempts` - Maximum attempts allowed
- `start_datetime` - Test start time (optional)
- `end_datetime` - Test end time (optional)
- `status` - draft/published/archived
- `created_at` - Creation timestamp

**questions**
- `id` - Primary key
- `test_id` - Foreign key to tests
- `question_text` - Question content
- `option_a`, `option_b`, `option_c`, `option_d` - Answer options
- `correct_option` - Correct answer (A/B/C/D)
- `marks` - Points for correct answer

**test_assignments**
- `id` - Primary key
- `test_id` - Foreign key to tests
- `student_id` - Foreign key to students
- `assigned_at` - Assignment timestamp
- Unique constraint on (test_id, student_id)

**exam_progress**
- `id` - Primary key
- `student_id` - Foreign key to students
- `test_id` - Foreign key to tests
- `answers` - JSONB object with answers
- `current_question` - Current question index
- `marked_for_review` - Array of question indices
- `visited_questions` - Array of visited indices
- `time_remaining` - Remaining time in seconds
- `warning_count` - Tab switch warning count
- `updated_at` - Last update timestamp

**results**
- `id` - Primary key
- `student_id` - Foreign key to students
- `test_id` - Foreign key to tests
- `marks_obtained` - Score achieved
- `total_marks` - Maximum possible score
- `percentage` - Percentage score
- `passed` - Pass/Fail status
- `submission_reason` - manual/time_up/tab_switch_violation
- `time_taken` - Time taken in seconds
- `created_at` - Submission timestamp

---

## 🐛 Troubleshooting

### Database Connection Error

**Error:** `Error: connect ECONNREFUSED 127.0.0.1:5432`

**Solution:**
```bash
# Check if PostgreSQL is running
# Windows:
services.msc  # Look for PostgreSQL service

# Linux/Mac:
sudo systemctl status postgresql

# Verify database exists
psql -U postgres -l

# Create database if missing
createdb exam_portal
```

### Firebase Authentication Error

**Error:** `Firebase app not initialized`

**Solution:**
- Verify `serviceAccountKey.json` exists in backend directory
- Check Firebase configuration in frontend `.env`
- Ensure all Firebase environment variables are set correctly
- Restart both backend and frontend servers

### Port Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution (Windows):**
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Solution (Linux/Mac):**
```bash
lsof -ti:5000 | xargs kill -9
```

### Camera Permission Denied

**Error:** Camera access denied during proctoring

**Solution:**
- Ensure HTTPS is used in production (required for camera access)
- Check browser permissions for camera access
- Allow camera permission when prompted
- Restart browser if permission was previously denied

### Socket.io Connection Failed

**Error:** WebSocket connection failed

**Solution:**
- This is normal - Socket.io automatically falls back to polling
- Verify backend server is running
- Check `VITE_API_URL` in frontend `.env`
- Ensure CORS is configured correctly in backend

### Proctoring Not Working

**Issue:** Admin not seeing student video

**Solution:**
1. Check browser console for errors
2. Verify Socket.io connection on both sides
3. Ensure student granted camera permission
4. Check backend logs for frame relay messages
5. Refresh admin dashboard
6. Restart both student test and admin dashboard

---

## 🚀 Deployment

### Backend Deployment (Render/Heroku)

1. Set environment variables in hosting platform
2. Ensure PostgreSQL database is provisioned
3. Upload `serviceAccountKey.json` securely
4. Set `NODE_ENV=production`
5. Configure CORS with production frontend URL

### Frontend Deployment (Vercel/Netlify)

1. Set all `VITE_*` environment variables
2. Update `VITE_API_URL` to production backend URL
3. Ensure HTTPS is enabled (required for camera access)
4. Build command: `npm run build`
5. Output directory: `dist`

### Important for Production

- ✅ Use HTTPS for both frontend and backend
- ✅ Enable secure WebSocket (wss://)
- ✅ Set strong JWT secret
- ✅ Change default admin password
- ✅ Configure proper CORS origins
- ✅ Set up database backups
- ✅ Monitor Socket.io connections
- ✅ Test camera permissions on HTTPS

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 🙏 Acknowledgments

- Firebase for authentication services
- PostgreSQL for robust database management
- Socket.io for real-time communication
- React and Vite for modern frontend development
- Tailwind CSS for beautiful UI components
- ExcelJS for Excel export functionality

---

## 📞 Support

For support:
- 📧 Email: your-email@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/mcq-exam-portal/issues)

---

## 🔮 Future Enhancements

- [ ] AI-based cheating detection
- [ ] Screen recording during exams
- [ ] Question bank management
- [ ] Randomized question order
- [ ] Image support in questions
- [ ] Multiple question types
- [ ] Advanced analytics dashboard
- [ ] Email notifications
- [ ] Mobile app version
- [ ] Certificate generation
- [ ] Multi-language support
- [ ] Dark mode theme

---

<div align="center">

### ⭐ Star this repo if you find it helpful!

**Made with ❤️ for better online education**

</div>
