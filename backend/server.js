/**
 * CampusFind 2.0 - Server Entry Point
 * Smart Campus Lost & Found Management Platform
 * Serves both the REST API backend and the Frontend web application
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Fail fast if JWT_SECRET is missing
if (!process.env.JWT_SECRET) {
  console.error('====================================================');
  console.error('[FATAL CONFIG ERROR]: JWT_SECRET is not defined!');
  console.error('Fix: Set a secure JWT_SECRET in your backend/.env file.');
  console.error('Example: JWT_SECRET=campusfind_super_secure_jwt_secret_key_change_in_production_2026');
  console.error('====================================================');
  process.exit(1);
}

// Ensure backend uploads directory exists automatically on startup
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Import database connection
const { testConnection, pool } = require('./config/db');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const itemRoutes = require('./routes/itemRoutes');
const matchingRoutes = require('./routes/matchingRoutes');
const claimRoutes = require('./routes/claimRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const userRoutes = require('./routes/userRoutes');

// Import Middleware
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Trust reverse proxy (Render, Cloudflare, etc.) for HTTPS detection & cookies
app.set('trust proxy', 1);
const PORT = process.env.PORT || 5000;

// Middleware: Cross-Origin Resource Sharing (CORS) with Credentials
const defaultOrigins = [
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://localhost:5000',
  'http://127.0.0.1:5000',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];

const envOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map(o => o.trim()).filter(Boolean)
  : (process.env.FRONTEND_URL && process.env.FRONTEND_URL !== '*'
      ? process.env.FRONTEND_URL.split(',').map(o => o.trim()).filter(Boolean)
      : []);

const allowedOrigins = Array.from(new Set([...defaultOrigins, ...envOrigins]));

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser agents (Postman, curl), file:// origins ('null')
    if (!origin || origin === 'null') {
      return callback(null, true);
    }
    if (
      allowedOrigins.includes(origin) ||
      origin.startsWith('http://localhost') ||
      origin.startsWith('http://127.0.0.1') ||
      origin.endsWith('.onrender.com')
    ) {
      return callback(null, true);
    }
    return callback(new Error(`CORS error: Origin '${origin}' is not allowed by CORS configuration.`));
  },
  credentials: true
}));

// Middleware: Request Body & Cookie Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve uploaded item images as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve Frontend Web Application as static files
const frontendDir = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendDir));

// API Overview Endpoint
app.get('/api', (req, res) => {
  res.status(200).json({
    project: 'CampusFind 2.0',
    description: 'Smart Campus Lost & Found Management Platform API',
    status: 'online',
    version: '2.0.0',
    timestamp: new Date().toISOString()
  });
});

// Health-Check API Endpoint: GET /api/health
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    message: 'CampusFind 2.0 API and Database connection are operational.',
    uptime: `${Math.floor(process.uptime())}s`,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/matches', matchingRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);

// Fallback for frontend root: serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendDir, 'index.html'));
});

// 404 Handler for undefined API routes
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found.`
  });
});

// Global Error Handler Middleware
app.use(errorHandler);

// ─── Graceful Shutdown ───────────────────────────────────────────────────────
let isShuttingDown = false;

function gracefulShutdown(signal) {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.log(`\n[CampusFind] ${signal} received — shutting down gracefully...`);

  // Force-exit if shutdown hangs beyond 5 seconds
  const forceTimer = setTimeout(() => {
    console.error('[CampusFind] Force-exit after 5 s timeout.');
    process.exit(1);
  }, 5000);
  forceTimer.unref(); // Don't block the event loop

  server.close(() => {
    console.log('[CampusFind] HTTP server closed. Releasing MySQL pool...');
    pool.end(() => {
      console.log('[CampusFind] MySQL pool closed. Goodbye!');
      clearTimeout(forceTimer);
      process.exit(0);
    });
  });
}

process.on('SIGINT',  () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGUSR2', () => gracefulShutdown('SIGUSR2')); // nodemon restart

process.on('uncaughtException', (err) => {
  console.error('[CampusFind] Uncaught Exception:', err.message);
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason) => {
  console.error('[CampusFind] Unhandled Promise Rejection:', reason);
  gracefulShutdown('unhandledRejection');
});

// ─── Start the Express Server ─────────────────────────────────────────────────
const server = app.listen(PORT, async () => {
  console.log(`====================================================`);
  console.log(` CampusFind 2.0 Web Application & API Running!`);
  console.log(` Web App URL : http://localhost:${PORT}`);
  console.log(` Environment : ${process.env.NODE_ENV || 'development'}`);
  console.log(` Health API  : http://localhost:${PORT}/api/health`);
  console.log(` Auth APIs   : http://localhost:${PORT}/api/auth`);
  console.log(` Items API   : http://localhost:${PORT}/api/items`);
  console.log(` Matches API : http://localhost:${PORT}/api/matches`);
  console.log(` Claims API  : http://localhost:${PORT}/api/claims`);
  console.log(` Notifs API  : http://localhost:${PORT}/api/notifications`);
  console.log(` Dash API    : http://localhost:${PORT}/api/dashboard`);
  console.log(` Users API   : http://localhost:${PORT}/api/users`);
  console.log(`====================================================`);

  // Verify MySQL Connection Pool
  await testConnection();
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n[CampusFind] ERROR: Port ${PORT} is already in use.`);
    console.error(`  Stop the other process first, then restart.`);
    console.error(`\n  Windows (PowerShell):`);
    console.error(`    netstat -ano | findstr :${PORT}`);
    console.error(`    taskkill /PID <pid> /F`);
    console.error(`\n  macOS / Linux:`);
    console.error(`    lsof -i :${PORT}   # find the PID`);
    console.error(`    kill -9 <pid>`);
    console.error(`\n  Or just run:  npm run free-port\n`);
    process.exit(1);
  } else if (err.code === 'EACCES') {
    console.error(`\n[CampusFind] ERROR: Permission denied on port ${PORT}.`);
    console.error(`  Use a port number above 1024 (set PORT in backend/.env).\n`);
    process.exit(1);
  } else {
    console.error(`\n[CampusFind] Server listen error (${err.code}): ${err.message}\n`);
    process.exit(1);
  }
});

module.exports = app;





