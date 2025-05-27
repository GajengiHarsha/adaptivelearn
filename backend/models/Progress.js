const mongoose = require('mongoose');

// Progress Schema
const progressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  lessons: [
    {
      lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
      completed: { type: Boolean, default: false },
      quizScore: { type: Number, default: 0 },
    },
  ],
});

module.exports = mongoose.model('Progress', progressSchema);