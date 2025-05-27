// models/User.js

const mongoose = require('mongoose');

const enrolledCourseSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course', // ✅ This is what enables population!
  },
  progress: {
    completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
  },
});

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  rollNumber: { type: String },
  branch: { type: String },
  year: { type: String },
  enrolledCourses: [{
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    progress: {
      completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }]
    }
  }] // ✅ Use sub-schema
});

module.exports = mongoose.model('User', userSchema);
