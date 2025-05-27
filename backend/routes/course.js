const express = require('express');
const router = express.Router();
const Course = require('../models/course');
const User = require('../models/User');
const Lesson = require('../models/Lesson');
const requireAuth = require('../middleware/requireAuth');

// --- GET ALL COURSES THE USER IS ENROLLED IN ---
router.get('/my', requireAuth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate({
            path: 'enrolledCourses.course',
            populate: { path: 'lessons' }
        });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const courses = (user.enrolledCourses || []).map(ec => {
            const course = ec.course;
            if (!course) return null;
            return {
                _id: course._id,
                title: course.title,
                description: course.description,
                lessons: course.lessons,
                progress: {
                    completedLessons: Array.isArray(ec.progress?.completedLessons) ? ec.progress.completedLessons : [],
                    totalLessons: Array.isArray(course.lessons) ? course.lessons.length : 0
                }
            };
        }).filter(Boolean);

        res.json({ user: { name: user.name, email: user.email }, courses });
    } catch (error) {
        console.error('Error fetching user courses:', error);
        res.status(500).json({ error: 'Failed to fetch user courses' });
    }
});

// --- GET ALL COURSES ---
router.get('/', async (req, res) => {
    try {
        console.log('Fetching all courses...');
        const courses = await Course.find().exec();
        console.log('Found courses:', courses.length);
        res.json(courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ error: 'Failed to fetch courses' });
    }
});

// --- ENROLL IN A COURSE ---
router.post('/enroll', requireAuth, async (req, res) => {
    const { courseId } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        if (user.enrolledCourses.some(ec => ec.course.toString() === courseId)) {
            return res.status(400).json({ error: 'Already enrolled' });
        }
        user.enrolledCourses.push({ course: courseId, progress: { completedLessons: [] } });
        await user.save();
        res.json({ message: 'Enrolled successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to enroll' });
    }
});

// --- UNENROLL FROM A COURSE ---
router.post('/unenroll', requireAuth, async (req, res) => {
    const { courseId } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        user.enrolledCourses = user.enrolledCourses.filter(ec => ec.course.toString() !== courseId);
        await user.save();
        res.json({ message: 'Unenrolled successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to unenroll' });
    }
});

// --- DEBUG ROUTE TO GET ALL COURSES WITH LESSONS POPULATED ---
router.get('/debug/courses', async (req, res) => {
    try {
        const courses = await Course.find().populate('lessons');
        res.json(courses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- GET COURSE BY ID ---
router.get('/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate('lessons');
        if (!course) return res.status(404).json({ error: 'Course not found' });
        res.json(course);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch course' });
    }
});

// --- GET LESSON BY ID ---
router.get('/lesson/:lessonId', async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.lessonId);
        if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
        res.json(lesson);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch lesson content' });
    }
});

// --- GET COURSE ID FROM URL ---
router.get('/getCourseId', (req, res) => {
    try {
        const courseId = new URLSearchParams(req.url.split('?')[1]).get('courseId');
        if (!courseId) return res.status(400).json({ error: 'Course ID not provided' });
        res.json({ courseId });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get course ID' });
    }
});

module.exports = router;
