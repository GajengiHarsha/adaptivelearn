const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Course = require('./backend/models/course');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('Connected to MongoDB');

  try {
    const sampleCourses = [
      {
        title: "Introduction to Programming",
        description: "Learn basic programming concepts and logic building.",
        instructor: "Admin"
      },
      {
        title: "Web Development with HTML & CSS",
        description: "Create visually appealing static websites.",
        instructor: "Admin"
      },
      {
        title: "JavaScript for Beginners",
        description: "Make your websites dynamic and interactive.",
        instructor: "Admin"
      },
      {
        title: "Backend Development with Node.js",
        description: "Build scalable backend servers using Node and Express.",
        instructor: "Admin"
      },
      {
        title: "Database Fundamentals",
        description: "Learn MongoDB and database integration in web apps.",
        instructor: "Admin"
      },
      {
        title: "React Essentials",
        description: "Build reactive interfaces using React JS.",
        instructor: "Admin"
      },
      {
        title: "Responsive Web Design",
        description: "Make your sites mobile-friendly with CSS techniques.",
        instructor: "Admin"
      },
      {
        title: "API Development",
        description: "Design and consume RESTful APIs in projects.",
        instructor: "Admin"
      },
      {
        title: "Authentication in Web Apps",
        description: "Implement user authentication and authorization.",
        instructor: "Admin"
      },
      {
        title: "Git & GitHub Essentials",
        description: "Master version control with Git and GitHub.",
        instructor: "Admin"
      },
      {
        title: "Project Deployment",
        description: "Deploy your websites to live servers.",
        instructor: "Admin"
      },
      {
        title: "Debugging and Testing",
        description: "Write tests and debug real-world JavaScript code.",
        instructor: "Admin"
      }
    ];

    await Course.deleteMany({});
    console.log("Old courses deleted.");

    await Course.insertMany(sampleCourses);
    console.log("New courses inserted.");

    mongoose.disconnect();
  } catch (err) {
    console.error("Error inserting courses:", err);
    mongoose.disconnect();
  }
}).catch(err => {
  console.error('Connection error:', err);
});
