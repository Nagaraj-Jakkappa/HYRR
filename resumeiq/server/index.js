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
const server = http.createServer(app);

// --- DYNAMIC CORS CONFIGURATION ---
const isVercelPreview = (origin) => {
  if (!origin) return false;
  // Allows any vercel.app domain that contains your project name
  return origin.endsWith('.vercel.app') && origin.includes('hyrr');
};

const allowedOrigins = [
  'https://hyrr-blue.vercel.app',  // Main Production URL
  'http://localhost:5173'          // Local development
];

// Clean trailing slash from environment variable if it exists
if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL.replace(/\/$/, ""));
}

const corsOptions = {
  origin: function (origin, callback) {
    // 1. Allow requests with no origin (like mobile apps or server-to-server health checks)
    if (!origin) return callback(null, true);

    // Clean trailing slash from the browser's incoming origin string
    const cleanOrigin = origin.replace(/\/$/, "");

    // 2. Allow if in static list, vercel preview, or development mode
    if (
      allowedOrigins.includes(cleanOrigin) || 
      isVercelPreview(cleanOrigin) || 
      process.env.NODE_ENV === 'development'
    ) {
      callback(null, true);
    } else {
      console.error(`Blocked by CORS: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200 // Ensures seamless preflight completion status code handling
};

// --- MIDDLEWARE ---
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Socket.io setup with the same CORS options
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

io.on('connection', (socket) => {
  console.log(`🔌 Socket connected: ${socket.userId}`);
  socket.join(socket.userId);
  socket.on('disconnect', () => {
    console.log(`🔌 Socket disconnected: ${socket.userId}`);
  });
});

// Global API Limiter
app.use('/api', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/scans', scanRoutes);
app.use('/api/admin', adminRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

// Error handling
app.use(errorHandler);

// Server initialization
const PORT = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB();
    console.log('✅ MongoDB Connection Established');
    
    await connectRedis();
    console.log('✅ Redis Connection Established');
    
    startCronJobs();
    
    server.listen(PORT, () => {
      console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

start();