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
const courseRoutes = require('./backend/routes/course');
app.use('/api/courses', courseRoutes);
app.use('/api/enrollment', require('./backend/routes/enrollment'));
app.use('/api/progress', require('./backend/routes/progress'));
app.use('/api/dashboard', require('./backend/routes/dashboard'));
const quizRoutes = require('./backend/routes/quiz');
app.use('/api/quiz', quizRoutes);
const learningPathRoutes = require('./backend/routes/learningPath');
app.use('/api/learning-path', learningPathRoutes);
const profileRoutes = require('./backend/routes/profile');
app.use('/api/profile', profileRoutes);

// Serve static files from frontend folder at root
app.use(express.static(path.join(__dirname, 'frontend')));

// 404 handler
app.use((req, res) => {
  res.status(404).send('Page not found');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});