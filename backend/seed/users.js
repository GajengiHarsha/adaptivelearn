const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Course = require('../models/course');

dotenv.config();

const seedUsers = async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const courses = await Course.find();
  const user = new User({
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123', // Ensure this is hashed in production
    enrolledCourses: courses.map(course => ({
      course: course._id,
      progress: course.lessons.map(lesson => ({ moduleId: lesson._id, completed: false })),
    })),
  });

  await user.save();
  console.log('✅ User seeded');
  mongoose.disconnect();
};

seedUsers();