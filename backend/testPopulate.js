const mongoose = require('mongoose');
const User = require('./models/User');
const Course = require('./models/course');  // <-- Import the Course model here

async function test() {
  await mongoose.connect('mongodb+srv://harshagajengi24:thegamer123@cluster0.hw7fg8e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

  const userId = '683318efd9070a2d61971a7f';

  const user = await User.findById(userId)
    .populate('enrolledCourses.course')
    .lean();

  console.log(JSON.stringify(user.enrolledCourses, null, 2));

  await mongoose.disconnect();
}

test().catch(console.error);
