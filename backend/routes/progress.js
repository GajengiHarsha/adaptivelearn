const express = require('express');
const { updateProgress, getCourseProgress } = require('../controllers/progressController');
const requireAuth = require('../middleware/requireAuth');
const User = require('../models/User');

const router = express.Router();

// POST /api/progress/update - Update user progress
router.post('/update', requireAuth, updateProgress);

// GET /api/progress - Get user progress
router.get('/', requireAuth, getCourseProgress);

router.post('/complete', requireAuth, async (req, res) => {
    const { courseId, lessonId, completed } = req.body;
    try {
        const user = await User.findById(req.user.id);
        const enrolled = user.enrolledCourses.find(ec => ec.course.toString() === courseId);
        if (!enrolled) return res.status(400).json({ error: 'Not enrolled in this course' });

        if (!enrolled.progress.completedLessons) enrolled.progress.completedLessons = [];
        const idx = enrolled.progress.completedLessons.findIndex(id => id.toString() === lessonId);
        if (completed) {
            if (idx === -1) enrolled.progress.completedLessons.push(lessonId);
        } else {
            if (idx !== -1) enrolled.progress.completedLessons.splice(idx, 1);
        }
        await user.save();
        res.json({ message: 'Lesson progress updated' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update progress' });
    }
});

module.exports = router;
