const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('../models/course');

dotenv.config();

const seedCourses = async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const courses = [
    { title: 'JavaScript Basics', description: 'Learn the basics of JavaScript', instructor: 'John Doe' },
    { title: 'Python for Beginners', description: 'Introduction to Python programming', instructor: 'Jane Smith' },
  ];

  await Course.insertMany(courses);
  console.log('✅ Courses seeded');
  mongoose.disconnect();
};

seedCourses();
