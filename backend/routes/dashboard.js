const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Course = require('../models/course');
const requireAuth = require('../middleware/requireAuth'); // <-- Use this

router.get('/', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('enrolledCourses');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Filter out null courses before using .toObject()
    const validCourses = (user.enrolledCourses || []).filter(course => course !== null);

    const coursesWithProgress = validCourses.map(course => {
      const courseObj = course.toObject();
      const totalLessons = courseObj.lessons?.length || 0;
      const completedLessons = courseObj.lessons?.filter(lesson =>
        lesson.completedBy && lesson.completedBy.includes(req.user.id)
      ).length || 0;

      return {
        ...courseObj,
        progress: {
          completedLessons,
          totalLessons
        }
      };
    });

    res.json({
      user: {
        name: user.name,
        email: user.email
      },
      courses: coursesWithProgress
    });

  } catch (err) {
    console.error('Error fetching dashboard data:', err);
    res.status(500).json({ error: 'Dashboard fetch failed' });
  }
});

module.exports = router;
