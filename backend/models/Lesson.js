const mongoose = require('mongoose');

// Lesson Schema
const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  content: String,
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  order: {
    type: Number,
    required: true
  },
  duration: Number, // in minutes
  completedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  resources: [{
    title: String,
    type: {
      type: String,
      enum: ['video', 'document', 'link']
    },
    url: String
  }]
});

module.exports = mongoose.model('Lesson', lessonSchema);