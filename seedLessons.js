const mongoose = require('mongoose');
const Course = require('./backend/models/course');  // Import instead of redefining
const Lesson = require('./backend/models/Lesson');
require('dotenv').config();

async function seedLessons() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Get all courses
        const courses = await Course.find();
        console.log(`Found ${courses.length} courses`);

        for (const course of courses) {
            // Create 5 lessons for each course
            const lessons = await Lesson.create([
                {
                    title: 'Introduction',
                    description: 'Getting started with the basics',
                    content: 'Welcome to the course! In this lesson, we will cover the fundamental concepts.',
                    course: course._id,
                    order: 1,
                    duration: 30,
                    resources: [{ title: 'Intro Slides', type: 'document', url: 'https://example.com/slides' }]
                },
                {
                    title: 'Core Concepts',
                    description: 'Understanding the fundamental principles',
                    content: 'In this lesson, we\'ll explore the core concepts.',
                    course: course._id,
                    order: 2,
                    duration: 45,
                    resources: [{ title: 'Core Guide', type: 'document', url: 'https://example.com/guide' }]
                },
                {
                    title: 'Practical Application',
                    description: 'Hands-on practice with real examples',
                    content: 'Time for practical exercises and real-world applications.',
                    course: course._id,
                    order: 3,
                    duration: 60,
                    resources: [{ title: 'Practice Set', type: 'document', url: 'https://example.com/practice' }]
                },
                {
                    title: 'Advanced Topics',
                    description: 'Exploring advanced features',
                    content: 'Let\'s dive into advanced concepts and techniques.',
                    course: course._id,
                    order: 4,
                    duration: 50,
                    resources: [{ title: 'Advanced Material', type: 'document', url: 'https://example.com/advanced' }]
                },
                {
                    title: 'Final Project',
                    description: 'Putting it all together',
                    content: 'Complete your final project to demonstrate your skills.',
                    course: course._id,
                    order: 5,
                    duration: 90,
                    resources: [{ title: 'Project Guide', type: 'document', url: 'https://example.com/project' }]
                }
            ]);

            // Update course with lesson references
            course.lessons = lessons.map(lesson => lesson._id);
            await course.save();
            console.log(`Added ${lessons.length} lessons to course: ${course.title}`);
        }

        console.log('Successfully seeded lessons!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding lessons:', error);
        process.exit(1);
    }
}

seedLessons();