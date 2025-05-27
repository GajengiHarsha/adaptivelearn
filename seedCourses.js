import mongoose from 'mongoose';
import Course from './backend/models/course.js';

const seedCourses = async () => {
  try {
    console.log('✅ Connecting to MongoDB Atlas...');
    await mongoose.connect('mongodb+srv://harshagajengi24:thegamer123@cluster0.hw7fg8e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('🧹 Clearing existing courses...');
    await Course.deleteMany();
    console.log('✅ Cleared existing courses');

    console.log('🌱 Seeding new courses...');
    const courses = [
      {
        title: 'Introduction to Python',
        description: 'Learn the basics of Python programming.',
        lessons: [],
      },
      {
        title: 'JavaScript Essentials',
        description: 'Understand core JavaScript concepts including DOM manipulation, events, and functions.',
        lessons: [],
      },
      {
        title: 'Web Development Bootcamp',
        description: 'Learn HTML, CSS, and JavaScript to build modern, responsive websites.',
        lessons: [],
      },
      {
        title: 'Data Structures and Algorithms',
        description: 'Master data structures and algorithms to solve complex programming problems.',
        lessons: [],
      },
      {
        title: 'React for Beginners',
        description: 'Learn the basics of React.js to build dynamic and interactive web applications.',
        lessons: [],
      },
      {
        title: 'Node.js and Express',
        description: 'Build backend applications using Node.js and Express framework.',
        lessons: [],
      },
      {
        title: 'Database Management with MongoDB',
        description: 'Learn how to design and manage databases using MongoDB.',
        lessons: [],
      },
      {
        title: 'Machine Learning Basics',
        description: 'Understand the fundamentals of machine learning and build simple models.',
        lessons: [],
      },
      {
        title: 'Introduction to Cybersecurity',
        description: 'Learn the basics of cybersecurity and how to protect systems from attacks.',
        lessons: [],
      },
      {
        title: 'Mobile App Development with Flutter',
        description: 'Build cross-platform mobile applications using Flutter and Dart.',
        lessons: [],
      },
      {
        title: 'DevOps Essentials',
        description: 'Learn the principles of DevOps and tools like Docker and Kubernetes.',
        lessons: [],
      },
      {
        title: 'Cloud Computing with AWS',
        description: 'Understand cloud computing concepts and get started with AWS services.',
        lessons: [],
      },
    ];

    await Course.insertMany(courses);
    console.log('✅ Seeded courses successfully');
  } catch (error) {
    console.error('❌ Error seeding courses:', error);
  } finally {
    console.log('🔌 Closing database connection...');
    mongoose.disconnect();
  }
};

seedCourses();