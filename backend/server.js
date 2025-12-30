const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('backend/uploads'));

// Route Files
const auditRoutes = require('./routes/auditRoutes');
const taskRoutes = require('./routes/taskRoutes');
const escalationRoutes = require('./routes/escalationRoutes');
const authRoutes = require('./routes/authRoutes');
const venuesRoutes = require('./routes/venues');
const templateRoutes = require('./routes/templateRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const reportRoutes = require('./routes/reportRoutes');
const { verifyToken } = require('./middlewares/auth.middleware');

// Mount Routers
// Public routes
app.use('/api/v1/auth', authRoutes);
// Protected routes - require auth
app.use('/api/v1/banquet/audits', verifyToken, auditRoutes);
app.use('/api/v1/tasks', verifyToken, taskRoutes);
app.use('/api/v1/escalations', verifyToken, escalationRoutes);
app.use('/api/venues', verifyToken, venuesRoutes);
app.use('/api/v1/templates', verifyToken, templateRoutes);
app.use('/api/v1/notifications', verifyToken, notificationRoutes);
app.use('/api/v1/reports', verifyToken, reportRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.send('Asyncotel PMS API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});