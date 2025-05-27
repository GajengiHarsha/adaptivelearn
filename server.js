require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const schedule = require('node-schedule');

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    console.log('Connection details:', {
      host: mongoose.connection.host,
      name: mongoose.connection.name
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Scheduled job to clean expired tokens every hour
schedule.scheduleJob('0 * * * *', async () => {
  const Token = require('./backend/models/Token');
  try {
    await Token.deleteMany({ expiresAt: { $lt: Date.now() } });
    console.log('✅ Expired tokens cleaned up');
  } catch (error) {
    console.error('❌ Error cleaning up expired tokens:', error);
  }
});

// API Routes
app.use('/api/auth', require('./backend/routes/auth'));
app.use('/api/courses', require('./backend/routes/course'));
app.use('/api/enrollment', require('./backend/routes/enrollment'));
app.use('/api/progress', require('./backend/routes/progress'));
app.use('/api/dashboard', require('./backend/routes/dashboard'));
app.use('/api/quiz', require('./backend/routes/quiz'));
app.use('/api/learning-path', require('./backend/routes/learningPath'));
app.use('/api/profile', require('./backend/routes/profile'));

// Serve static frontend files without serving index.html by default
app.use(express.static(path.join(__dirname, 'frontend'), { index: false }));

// Health check
app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

// 404 for API routes that don’t match
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Serve login.html at the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'login.html'));
});

// Fallback for any unknown non-API routes (serve login.html for SPA routing)
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    // Return JSON 404 for unknown API routes
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  res.sendFile(path.join(__dirname, 'frontend', 'login.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

