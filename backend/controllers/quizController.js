const Lesson = require('../models/Lesson');

async function generateQuiz(req, res) {
  try {
    const { lessonId, performance } = req.body;

    // Fetch the lesson
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    // Determine difficulty based on performance
    const difficulty = performance < 50 ? 'easy' : performance < 80 ? 'medium' : 'hard';

    // Filter questions by difficulty
    const questions = lesson.quiz.filter(q => q.difficulty === difficulty);

    // Select up to 5 questions
    const selectedQuestions = questions.slice(0, 5);

    res.json({ questions: selectedQuestions });
  } catch (error) {
    console.error('Error generating quiz:', error);
    res.status(500).json({ error: 'Failed to generate quiz' });
  }
}

module.exports = { generateQuiz };