const mongoose = require('mongoose');
const User = require('./backend/models/User');

const cleanInvalidEnrollments = async () => {
  try {
    console.log('✅ Connecting to MongoDB Atlas...');
    await mongoose.connect('mongodb+srv://harshagajengi24:thegamer123@cluster0.hw7fg8e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const users = await User.find();
    for (const user of users) {
      const validEnrollments = user.enrolledCourses.filter(enrollment => enrollment.course !== null);
      const invalidEnrollments = user.enrolledCourses.filter(enrollment => enrollment.course === null);

      if (invalidEnrollments.length > 0) {
        console.log(`🗑 Removing invalid enrollments for user: ${user._id}`);
        user.enrolledCourses = validEnrollments;
        await user.save();
      }
    }

    console.log('✅ Invalid enrollments cleaned successfully.');
  } catch (error) {
    console.error('❌ Error cleaning invalid enrollments:', error);
  } finally {
    console.log('🔌 Closing database connection...');
    await mongoose.disconnect();
  }
};

cleanInvalidEnrollments();