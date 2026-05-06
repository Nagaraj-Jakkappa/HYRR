// require('dotenv').config();
// const express = require('express');
// const http = require('http');
// const { Server } = require('socket.io');
// const cors = require('cors');
// const helmet = require('helmet');
// const morgan = require('morgan');

// const connectDB = require('./config/db');
// const { connectRedis } = require('./config/redis');
// const errorHandler = require('./middleware/errorHandler');
// const { apiLimiter } = require('./middleware/rateLimiter');
// const startCronJobs = require('./utils/cronJobs');

// const authRoutes = require('./routes/authRoutes');
// const resumeRoutes = require('./routes/resumeRoutes');
// const scanRoutes = require('./routes/scanRoutes');
// const adminRoutes = require('./routes/adminRoutes');

// const app = express();
// const server = http.createServer(app);

// // Socket.io setup
// const io = new Server(server, {
//   cors: {
//     origin: process.env.CLIENT_URL || 'http://localhost:5173',
//     methods: ['GET', 'POST'],
//     credentials: true,
//   },
// });

// app.set('io', io);

// // Socket.io auth middleware + room setup
// io.use((socket, next) => {
//   const token = socket.handshake.auth?.token;
//   if (!token) return next(new Error('Authentication error'));
//   try {
//     const jwt = require('jsonwebtoken');
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     socket.userId = decoded.id;
//     next();
//   } catch {
//     next(new Error('Authentication error'));
//   }
// });

// io.on('connection', (socket) => {
//   console.log(`🔌 Socket connected: ${socket.userId}`);
//   socket.join(socket.userId); // each user in their own room

//   socket.on('disconnect', () => {
//     console.log(`🔌 Socket disconnected: ${socket.userId}`);
//   });
// });

// // Middleware
// app.use(helmet());
// app.use(cors({
//   origin: process.env.CLIENT_URL || 'http://localhost:5173',
//   credentials: true,
// }));
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true }));
// if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));
// app.use('/api', apiLimiter);

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/resumes', resumeRoutes);
// app.use('/api/scans', scanRoutes);
// app.use('/api/admin', adminRoutes);

// app.get('/api/health', (req, res) => res.json({ status: 'OK', time: new Date().toISOString() }));

// // Error handler
// app.use(errorHandler);

// // Start
// const PORT = process.env.PORT || 5000;
// const start = async () => {
//   await connectDB();
//   connectRedis();
//   startCronJobs();
//   server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
// };

// start();


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
app.use((req, res, next) => {
  res.setHeader('ngrok-skip-browser-warning', 'true')
  next()
})

// --- UPDATED: ALLOW MULTIPLE ORIGINS ---
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'https://glider-donation-mace.ngrok-free.dev' // Added your ngrok URL
];

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: allowedOrigins, // Updated to use the list
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.set('io', io);

// Socket.io auth middleware + room setup
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
  contentSecurityPolicy: false, // Recommended if using ngrok to avoid CSP issues
}));

// --- UPDATED: DYNAMIC CORS MIDDLEWARE ---
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS policy block'), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));
app.use('/api', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/scans', scanRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'OK', time: new Date().toISOString() }));

// Error handler
app.use(errorHandler);

// Start
const PORT = process.env.PORT || 5000;
const start = async () => {
  await connectDB();
  connectRedis();
  startCronJobs();
  server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
};

start();