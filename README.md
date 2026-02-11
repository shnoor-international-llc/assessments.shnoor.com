# 🎓 MCQ Exam Portal with Live Proctoring

A modern, scalable online examination platform with real-time proctoring, built with React, Node.js, PostgreSQL, and Firebase Authentication.

[![Node.js](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-19.x-61dafb.svg)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/postgresql-14%2B-336791.svg)](https://www.postgresql.org/)

**Capacity:** Handles 500-800 concurrent students with PM2 clustering

---

## ✨ Key Features

### For Students
- 🔐 Secure Firebase authentication
- 📝 Interactive test interface with timer
- 💾 Auto-save progress & resume capability
- 🎬 Fullscreen enforcement
- 👁️ Tab switch detection (3 warnings → auto-submit)
- 🎥 Camera-based proctoring
- 📊 Instant results with detailed analysis

### For Admins
- ✏️ Create tests (manual or bulk CSV/Excel upload)
- 📋 Test management (draft/published/archived)
- 👥 Assign tests by institute or individual students
- 🎥 Live proctoring dashboard (monitor multiple students)
- 📈 Results analytics & Excel export
- 🔴 Real-time video monitoring

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- PostgreSQL 14+
- Firebase account

### Installation

```bash
# Clone repository
git clone <your-repo-url>
cd mcq-exam-portal

# Backend setup
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run setup-db
npm run dev

# Frontend setup (new terminal)
cd ../mcq-exam-portal
npm install
cp .env.example .env
# Edit .env with Firebase config
npm run dev
```

### Access
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5000
- **Admin Login:** admin@example.com / admin123

---

## 📊 System Capacity

| Mode | Max Students | Setup |
|------|--------------|-------|
| **Development** | 300 | `npm run dev` |
| **Production (PM2)** | 500-800 | `pm2 start ecosystem.config.js` |
| **Enterprise (PM2 + Nginx)** | 1000+ | PM2 + Nginx load balancer |

---

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS
- **Backend:** Node.js, Express.js, Socket.io
- **Database:** PostgreSQL
- **Auth:** Firebase Authentication
- **Process Manager:** PM2 (clustering)
- **Logging:** Pino (structured logging)
- **Monitoring:** Health check endpoints

---

## 📦 Production Features

### Phase 1: Critical Scaling (300 Students)
- ✅ Database connection pool (100 connections)
- ✅ Sample-based proctoring (15% monitoring)
- ✅ Performance indexes (32 indexes)
- ✅ Rate limiting
- ✅ Camera enforcement

### Phase 2: Production Ready (500-800 Students)
- ✅ PM2 clustering (4 instances)
- ✅ Health monitoring (6 endpoints)
- ✅ Structured logging with Pino
- ✅ Nginx load balancer config
- ✅ Graceful shutdown
- ✅ Prometheus metrics

---

## 🎥 Live Proctoring

- **Sample-based monitoring:** Only 15% of students monitored at any time
- **Frame rate:** 2 FPS (reduced bandwidth)
- **Automatic rotation:** Every 5 minutes
- **Deterrent effect:** All students think they're being monitored
- **Camera enforcement:** Exam exits if camera disabled

---

## 🔧 Configuration

### Environment Variables

**Backend (.env):**
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_NAME=exam_portal
DB_USER=postgres
DB_PASSWORD=your_password
DB_POOL_MAX=100
JWT_SECRET=your_secret
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
CLIENT_URL=http://localhost:5173
PROCTORING_SAMPLE_RATE=0.15
PROCTORING_FRAME_RATE=2
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
```

---

## 📈 Production Deployment

### Using PM2 Clustering

```bash
# Install PM2 globally
npm install -g pm2

# Start with clustering
cd backend
pm2 start ecosystem.config.js

# Monitor
pm2 monit

# View logs
pm2 logs

# Restart
pm2 restart mcq-backend
```

### Health Monitoring

```bash
# Basic health
curl http://localhost:5000/health

# Detailed health (database, memory, CPU)
curl http://localhost:5000/health/detailed

# Prometheus metrics
curl http://localhost:5000/metrics
```

---

## 📁 Project Structure

```
mcq-exam-portal/
├── backend/                    # Node.js + Express API
│   ├── config/                 # Database, Firebase, Logger
│   ├── routes/                 # API routes
│   ├── middleware/             # Auth, rate limiting
│   ├── migrations/             # Database migrations
│   ├── ecosystem.config.js     # PM2 configuration
│   └── server.js               # Main server file
│
├── mcq-exam-portal/            # React + Vite Frontend
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── pages/              # Page components
│   │   ├── hooks/              # Custom hooks
│   │   └── config/             # Firebase config
│   └── vite.config.js
│
└── README.md                   # This file
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <pid> /F

# Linux/Mac
lsof -i :5000
kill -9 <pid>
```

### Database Connection Error
```bash
# Check PostgreSQL is running
# Windows: services.msc
# Linux/Mac: sudo systemctl status postgresql

# Create database if missing
createdb exam_portal
```

### PM2 Issues
```bash
# Check status
pm2 status

# View errors
pm2 logs mcq-backend --err

# Restart
pm2 restart mcq-backend

# Delete and restart
pm2 delete mcq-backend
pm2 start ecosystem.config.js
```

---

## 📚 API Endpoints

### Authentication
- `POST /api/register` - Student registration
- `POST /api/login` - Student login
- `POST /api/admin/login` - Admin login

### Tests (Admin)
- `GET /api/tests` - List all tests
- `POST /api/upload/manual` - Create test
- `POST /api/upload/questions` - Bulk upload
- `DELETE /api/tests/:id` - Delete test

### Student Exam
- `GET /api/student/tests` - Get assigned tests
- `GET /api/student/test/:id` - Get test details
- `POST /api/student/save-progress` - Save progress
- `POST /api/student/submit-exam` - Submit exam

### Health & Monitoring
- `GET /health` - Basic health check
- `GET /health/detailed` - Full system health
- `GET /health/db` - Database health
- `GET /metrics` - Prometheus metrics

---

## 🔒 Security Features

- Firebase authentication
- JWT token validation
- Rate limiting on all endpoints
- Helmet.js security headers
- CORS configuration
- Environment variable protection
- SQL injection prevention
- XSS protection

---

## 📄 License

MIT License

---

## 🙏 Acknowledgments

- Firebase for authentication
- PostgreSQL for database
- Socket.io for real-time communication
- React & Vite for frontend
- PM2 for process management

---

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Check documentation in `/docs` folder
- Review health endpoints for system status

---

**Made with ❤️ for better online education**

**Current Version:** 3.0 (Production Ready)
**Last Updated:** February 2026
