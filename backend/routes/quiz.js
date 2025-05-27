const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const requireAuth = require('../middleware/requireAuth');

// Get quiz for a lesson
router.get('/:lessonId', requireAuth, async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ lesson: req.params.lessonId });
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch quiz' });
  }
});

// Submit quiz answers
router.post('/submit', requireAuth, async (req, res) => {
  const { lessonId, answers } = req.body; // answers: [userSelectedIndex, ...]
  try {
    const quiz = await Quiz.findOne({ lesson: lessonId });
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

    let score = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) score++;
    });

    // Optionally: Save result to user progress here

    res.json({ score, total: quiz.questions.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit quiz' });
  }
});

module.exports = router;