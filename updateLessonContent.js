const mongoose = require('mongoose');
require('dotenv').config();

const Lesson = require('./backend/models/Lesson');

async function updateLessons() {
  await mongoose.connect(process.env.MONGODB_URI);
  const lessons = await Lesson.find();
  for (const lesson of lessons) {
    lesson.content = lesson.content || `This is the study material for "${lesson.title}". Add your real content here.`;
    await lesson.save();
    console.log(`Updated lesson: ${lesson.title}`);
  }
  console.log('All lessons updated!');
  process.exit(0);
}

updateLessons();