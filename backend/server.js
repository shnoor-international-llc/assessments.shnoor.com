const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

// Import configurations
const { pool } = require('./config/db');
require('./config/firebase'); // Initialize Firebase Admin SDK
// Import routes
const authRoutes = require('./routes/auth');
const adminAuthRoutes = require('./routes/adminAuth');
const uploadRoutes = require('./routes/upload');
const studentRoutes = require('./routes/student');
const exportRoutes = require('./routes/export');
const testRoutes = require('./routes/test');

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        credentials: true,
    }
});
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(morgan('dev')); // HTTP request logger

// ... (health checks)

// API Routes
app.use('/api', authRoutes);
app.use('/api/admin', adminAuthRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/tests', testRoutes);

// Health check endpoints
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
    });
});

app.get('/health/db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.status(200).json({
            success: true,
            message: 'Database connection is healthy',
            timestamp: result.rows[0].now,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Database connection failed',
            error: error.message,
        });
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
});

// Start server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`API: http://localhost:${PORT}`);
    console.log(`Socket.io: Ready for proctoring connections`);
});

// Socket.io - Live Proctoring
const activeSessions = new Map(); // studentId -> { socketId, testId, studentName, startTime }
const adminSockets = new Set(); // Set of admin socket IDs

io.on('connection', (socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);

    // Student joins proctoring session
    socket.on('student:join-proctoring', (data) => {
        const { studentId, studentName, testId, testTitle } = data;
        
        activeSessions.set(studentId, {
            socketId: socket.id,
            studentId,
            studentName,
            testId,
            testTitle,
            startTime: new Date(),
        });

        socket.join(`student-${studentId}`);
        socket.studentId = studentId;

        console.log(`[Proctoring] Student joined: ${studentName} (ID: ${studentId}) for test: ${testTitle}`);

        // Notify all admins about new student
        io.to('admin-room').emit('student:joined', {
            studentId,
            studentName,
            testId,
            testTitle,
            startTime: new Date(),
        });
    });

    // Admin joins monitoring room
    socket.on('admin:join-monitoring', () => {
        socket.join('admin-room');
        adminSockets.add(socket.id);
        socket.isAdmin = true;

        console.log(`[Proctoring] Admin joined monitoring room: ${socket.id}`);

        // Send list of active sessions to admin
        const sessions = Array.from(activeSessions.values()).map(session => ({
            studentId: session.studentId,
            studentName: session.studentName,
            testId: session.testId,
            testTitle: session.testTitle,
            startTime: session.startTime,
        }));

        socket.emit('active-sessions', sessions);
    });

    // Frame-based proctoring - Receive frame from student
    socket.on('proctoring:frame', (data) => {
        const { studentId, studentName, testId, testTitle, frame, timestamp } = data;
        
        // Relay frame to all admins in monitoring room
        io.to('admin-room').emit('proctoring:frame', {
            studentId,
            studentName,
            testId,
            testTitle,
            frame,
            timestamp,
        });
    });

    // Student leaves proctoring
    socket.on('student:leave-proctoring', (data) => {
        if (data && data.studentId) {
            console.log(`[Proctoring] Student leaving: ${data.studentName || data.studentId}`);
            
            // Notify admins
            io.to('admin-room').emit('student:left', {
                studentId: data.studentId,
                studentName: data.studentName,
            });

            // Clean up session
            if (activeSessions.has(data.studentId)) {
                activeSessions.delete(data.studentId);
            }
        }
    });

    // Keepalive ping
    socket.on('ping', () => {
        socket.emit('pong');
    });

    // Disconnect handling
    socket.on('disconnect', () => {
        console.log(`[Socket.io] Client disconnected: ${socket.id}`);

        if (socket.isAdmin) {
            adminSockets.delete(socket.id);
            console.log(`[Proctoring] Admin left monitoring room`);
        } else if (socket.studentId) {
            const session = activeSessions.get(socket.studentId);
            if (session) {
                console.log(`[Proctoring] Student left: ${session.studentName}`);
                
                // Notify admins
                io.to('admin-room').emit('student:left', {
                    studentId: socket.studentId,
                    studentName: session.studentName,
                });

                activeSessions.delete(socket.studentId);
            }
        }
    });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, closing server gracefully');
    pool.end(() => {
        console.log('Database pool closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT received, closing server gracefully');
    pool.end(() => {
        console.log('Database pool closed');
        process.exit(0);
    });
});

module.exports = app;
