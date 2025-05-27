// cleanup.js
const mongoose = require('mongoose');
const User = require('./backend/models/User');
const Course = require('./backend/models/course');
require('dotenv').config();

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const users = await User.find();

    for (const user of users) {
      const validCourses = [];
      for (const courseId of user.enrolledCourses) {
        const exists = await Course.exists({ _id: courseId });
        if (exists) validCourses.push(courseId);
      }
      user.enrolledCourses = validCourses;
      await user.save();
    }

    console.log('✅ Cleaned up enrolledCourses');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during cleanup:', err);
    process.exit(1);
  }
})();
