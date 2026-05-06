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

// --- ALLOWED ORIGINS CONFIGURATION ---
const allowedOrigins = [
  process.env.CLIENT_URL, // Dynamic URL from Railway Environment Variables
  'https://hyrr-blue.vercel.app', // Your specific Vercel production URL
  'http://localhost:5173' // Local development
].filter(Boolean); // Removes undefined/null values

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
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

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, 
}));

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      return callback(null, true);
    } else {
      return callback(new Error('CORS policy block'), false);
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

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