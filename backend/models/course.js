const express = require('express');
const router = express.Router();
const Course = require('../models/course');
const User = require('../models/User');
const requireAuth = require('../middleware/requireAuth');

// Get course by ID
router.get('/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate('lessons');
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        res.json(course);
    } catch (error) {
        console.error('Error fetching course:', error);
        res.status(500).json({ error: 'Failed to fetch course' });
    }
});

// Get all courses
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

// Enroll in a course
router.post('/enroll', requireAuth, async (req, res) => {
    try {
        const { courseId } = req.body;
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isEnrolled = user.enrolledCourses.some(ec => 
            ec.course && ec.course.toString() === courseId
        );

        if (isEnrolled) {
            return res.status(400).json({ error: 'Already enrolled in this course' });
        }

        user.enrolledCourses.push({
            course: courseId,
            progress: { completedLessons: 0, totalLessons: 0 }
        });

        await user.save();
        res.status(200).json({ message: 'Successfully enrolled in course' });
    } catch (error) {
        console.error('Error enrolling:', error);
        res.status(500).json({ error: 'Failed to enroll in course' });
    }
});

// Unenroll from a course
router.post('/unenroll', requireAuth, async (req, res) => {
    try {
        const { courseId } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        user.enrolledCourses = user.enrolledCourses.filter(
            ec => ec.course && ec.course.toString() !== courseId
        );
        await user.save();

        res.json({ message: 'Successfully unenrolled from course' });
    } catch (error) {
        console.error('Error unenrolling:', error);
        res.status(500).json({ error: 'Failed to unenroll from course' });
    }
});

module.exports = router;
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    lessons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Course', courseSchema);