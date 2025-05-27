const Course = require('../models/course');
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');

// Fetch all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
};

// Fetch a specific course by ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('lessons');
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.status(200).json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
};

// Enroll in a course
exports.enrollInCourse = async (req, res) => {
  const { courseId } = req.body;
  const userId = req.user.id;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isEnrolled = user.enrolledCourses.some((enrolled) => enrolled.course.toString() === courseId);
    if (isEnrolled) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }

    user.enrolledCourses.push({ course: courseId });
    await user.save();

    res.status(200).json({ message: 'Successfully enrolled in the course' });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    res.status(500).json({ error: 'Failed to enroll in course' });
  }
};

// Unenroll from a course
exports.unenrollFromCourse = async (req, res) => {
  const { courseId } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const isEnrolled = user.enrolledCourses.some(c => c.course.toString() === courseId);
    if (!isEnrolled) {
      return res.status(400).json({ error: 'Not enrolled in this course.' });
    }

    user.enrolledCourses = user.enrolledCourses.filter(c => c.course.toString() !== courseId);
    await user.save();

    res.status(200).json({ message: 'Unenrolled successfully' });
  } catch (err) {
    console.error('Error unenrolling from course:', err);
    res.status(500).json({ error: 'Unenrollment failed' });
  }
};

// Get lessons for a specific course
exports.getCourseLessons = async (req, res) => {
  const { courseId } = req.params;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found.' });
    }

    res.status(200).json(course.lessons);  // Return lessons of the course
  } catch (error) {
    console.error('Error fetching course lessons:', error);
    res.status(500).json({ error: 'An error occurred while fetching course lessons.' });
  }
};


// controllers/courseController.js

exports.updateLessonCompletion = async (req, res) => {
  const { courseId, lessonId, completed } = req.body;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const lesson = course.lessons.id(lessonId); // Find the lesson by ID
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    // Update lesson completion status
    lesson.completed = completed;
    await course.save();

    res.json({ message: 'Lesson completion updated', lesson });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update lesson completion' });
  }
};
