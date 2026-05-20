require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const connectDB = require('./config/db');
const { connectRedis } = require('./config/redis');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');
const startCronJobs = require('./utils/cronJobs');

const authRoutes = require('./routes/authRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const scanRoutes = require('./routes/scanRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// --- TRUST PROXY SETTING ---
// Required for express-rate-limit to work behind Railway's load balancer
app.set('trust proxy', 1);

const server = http.createServer(app);

// --- CORS CONFIGURATION ---
const allowedOrigins = [
  'https://hyrr-blue.vercel.app',
  'http://localhost:5173'
];

if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL.replace(/\/$/, ""));
}

const corsOptions = {
  origin: function (origin, callback) {
    // Allow non-browser requests (e.g., Postman/Mobile) or dev mode
    if (!origin || process.env.NODE_ENV === 'development') return callback(null, true);

    // Check if origin is allowed or is a Vercel preview branch
    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200
};

// --- MIDDLEWARE ---
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors(corsOptions));
// Handle Preflight requests explicitly for all routes
app.options('*', cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// --- SOCKET.IO ---
const io = new Server(server, {
  cors: corsOptions
});

app.set('io', io);

// Socket.io auth middleware
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error('Authentication error'));
  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch {
    next(new Error('Authentication error'));
  }
});

// --- ROUTES ---
app.use('/api', apiLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/scans', scanRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', environment: process.env.NODE_ENV });
});

// Error handling
app.use(errorHandler);

// --- SERVER INITIALIZATION ---
const PORT = process.env.PORT || 8080;
const start = async () => {
  try {
    await connectDB();
    await connectRedis();
    startCronJobs();

    server.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ MongoDB & Redis Connected`);
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

start();