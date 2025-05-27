const express = require('express');
const router = express.Router();
const User = require('../models/User');
const requireAuth = require('../middleware/requireAuth');

// Get user profile and stats
router.get('/', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('enrolledCourses.course')
      .populate('enrolledCourses.progress.completedLessons');
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Calculate stats
    const coursesEnrolled = user.enrolledCourses.length;
    const lessonsCompleted = user.enrolledCourses.reduce(
      (sum, ec) => sum + (ec.progress?.completedLessons?.length || 0), 0
    );
    // Optionally: Add quiz stats here

    res.json({
      name: user.name,
      email: user.email,
      rollNumber: user.rollNumber,
      branch: user.branch,
      year: user.year,
      coursesEnrolled,
      lessonsCompleted,
      // Add more stats as needed
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update profile (name, etc.)
router.put('/', requireAuth, async (req, res) => {
  try {
    const { name, rollNumber, branch, year, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, rollNumber, branch, year, email },
      { new: true }
    );
    res.json({
      name: user.name,
      email: user.email,
      rollNumber: user.rollNumber,
      branch: user.branch,
      year: user.year,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;