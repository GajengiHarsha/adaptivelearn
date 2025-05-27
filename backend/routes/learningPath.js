const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Course = require('../models/course');
const Quiz = require('../models/Quiz');
const requireAuth = require('../middleware/requireAuth');

// Recommend next lessons for the user in a course
router.get('/recommendations/:courseId', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const course = await Course.findById(req.params.courseId).populate('lessons');
    if (!user || !course) return res.status(404).json({ error: 'User or course not found' });

    const enrolled = user.enrolledCourses.find(ec => ec.course.toString() === course._id.toString());
    const completedLessons = enrolled?.progress?.completedLessons?.map(id => id.toString()) || [];

    // Find the first incomplete lesson
    const nextLesson = course.lessons.find(lesson => !completedLessons.includes(lesson._id.toString()));

    // Optionally: Check last quiz score and recommend remedial if needed (pseudo-code)
    // const lastQuizScore = ... (fetch from user progress)
    // if (lastQuizScore < 60) { recommend remedial lesson }

    res.json({ recommended: nextLesson ? [nextLesson] : [] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
});

module.exports = router;