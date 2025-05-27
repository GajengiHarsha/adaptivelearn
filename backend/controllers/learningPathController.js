const Progress = require('../models/Progress');
const Lesson = require('../models/Lesson');

async function getNextLesson(req, res) {
  try {
    const { userId, courseId } = req.query;

    // Fetch progress for the user and course
    const progress = await Progress.findOne({ user: userId, course: courseId }).populate('lessons.lessonId');
    if (!progress) {
      return res.status(404).json({ error: 'Progress not found' });
    }

    // Find the next incomplete lesson
    const nextLesson = progress.lessons.find(lesson => !lesson.completed);
    if (!nextLesson) {
      return res.json({ message: 'All lessons completed!' });
    }

    // Fetch lesson details
    const lesson = await Lesson.findById(nextLesson.lessonId);
    res.json({ nextLesson: lesson });
  } catch (error) {
    console.error('Error fetching next lesson:', error);
    res.status(500).json({ error: 'Failed to fetch next lesson' });
  }
}

module.exports = { getNextLesson };