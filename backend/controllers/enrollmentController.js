const User = require('../models/User');
const Course = require('../models/course');
const Lesson = require('../models/Lesson');

// Enroll a user in a course
exports.enrollInCourse = async (req, res) => {
  const { courseId } = req.body;
  const userId = req.user.id;

  try {
    const course = await Course.findById(courseId).populate('lessons'); // Populate lessons
    if (!course) {
      return res.status(404).json({ error: 'Course not found.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Check if the user is already enrolled
    const isEnrolled = user.enrolledCourses.some(
      (enrolled) => enrolled.course.toString() === courseId
    );
    if (isEnrolled) {
      return res.status(400).json({ error: 'User is already enrolled in this course.' });
    }

    // Initialize progress as an empty array of completedLessons
    user.enrolledCourses.push({
      course: courseId,
      progress: { completedLessons: [] },
    });

    await user.save();
    res.status(200).json({ message: 'Successfully enrolled in the course.' });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    res.status(500).json({ error: 'An error occurred while enrolling in the course.' });
  }
};

exports.unenrollFromCourse = async (req, res) => {
  const { courseId } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Remove the course from the user's enrolledCourses
    user.enrolledCourses = user.enrolledCourses.filter(
      (enrolled) => enrolled.course.toString() !== courseId
    );

    await user.save();
    res.status(200).json({ message: 'Successfully unenrolled from the course.' });
  } catch (error) {
    console.error('Error unenrolling from course:', error);
    res.status(500).json({ error: 'An error occurred while unenrolling from the course.' });
  }
};
