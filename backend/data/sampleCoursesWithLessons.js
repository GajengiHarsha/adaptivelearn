const sampleTags = ['python', 'javascript', 'html', 'css', 'node', 'ai', 'ml', 'web', 'data', 'frontend'];

// Sample quiz questions for different topics
const getQuizQuestions = (topic) => {
  const quizBank = {
    python: [
      {
        question: "What is the correct way to create a list in Python?",
        options: ["list = ()", "list = []", "list = {}", "list = <>"],
        correctAnswer: 1,
        explanation: "Lists in Python are created using square brackets []"
      },
      {
        question: "Which of the following is used to define a function in Python?",
        options: ["function", "def", "define", "func"],
        correctAnswer: 1,
        explanation: "The 'def' keyword is used to define functions in Python"
      }
    ],
    javascript: [
      {
        question: "What does 'var' keyword do in JavaScript?",
        options: ["Creates a constant", "Declares a variable", "Defines a function", "Creates an array"],
        correctAnswer: 1,
        explanation: "The 'var' keyword is used to declare variables in JavaScript"
      },
      {
        question: "Which method adds an element to the end of an array?",
        options: ["push()", "add()", "append()", "insert()"],
        correctAnswer: 0,
        explanation: "The push() method adds elements to the end of an array"
      }
    ],
    html: [
      {
        question: "What does HTML stand for?",
        options: ["Hyper Text Markup Language", "Home Tool Markup Language", "Hyperlinks Text Mark Language", "Hyperlinking Text Marking Language"],
        correctAnswer: 0,
        explanation: "HTML stands for Hyper Text Markup Language"
      },
      {
        question: "Which HTML tag is used for the largest heading?",
        options: ["<h6>", "<heading>", "<h1>", "<header>"],
        correctAnswer: 2,
        explanation: "<h1> creates the largest heading, while <h6> creates the smallest"
      }
    ],
    css: [
      {
        question: "What does CSS stand for?",
        options: ["Creative Style Sheets", "Cascading Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"],
        correctAnswer: 1,
        explanation: "CSS stands for Cascading Style Sheets"
      },
      {
        question: "Which property is used to change the background color?",
        options: ["color", "bgcolor", "background-color", "bg-color"],
        correctAnswer: 2,
        explanation: "The background-color property sets the background color of an element"
      }
    ]
  };

  return quizBank[topic] || quizBank.javascript; // Default to JavaScript questions
};

const generateLessonsForCourse = (courseTitle, tag, courseId) => {
  const lessons = [
    {
      title: `${courseTitle} - Introduction`,
      content: `Welcome to ${courseTitle}! In this introductory lesson, we'll cover the basics of ${tag} and what you'll learn throughout this course.`,
      order: 1,
      course: courseId,
      quiz: {
        title: `${tag.toUpperCase()} Basics Quiz`,
        description: `Test your understanding of ${tag} fundamentals`,
        questions: getQuizQuestions(tag).slice(0, 2), // First 2 questions
        passingScore: 70,
        timeLimit: 10
      },
      estimatedDuration: 30,
      resources: [
        {
          title: `${tag.toUpperCase()} Documentation`,
          url: `https://example.com/${tag}-docs`,
          type: 'link'
        }
      ]
    },
    {
      title: `${courseTitle} - Core Concepts`,
      content: `Deep dive into the core concepts of ${tag}. This lesson covers intermediate topics and practical applications.`,
      order: 2,
      course: courseId,
      quiz: {
        title: `${tag.toUpperCase()} Core Concepts Quiz`,
        description: `Test your understanding of core ${tag} concepts`,
        questions: getQuizQuestions(tag), // All questions
        passingScore: 75,
        timeLimit: 15
      },
      estimatedDuration: 45,
      prerequisites: [], // Will be set to previous lesson ID
      resources: [
        {
          title: `${tag.toUpperCase()} Tutorial Video`,
          url: `https://example.com/${tag}-video`,
          type: 'video'
        }
      ]
    },
    {
      title: `${courseTitle} - Advanced Topics & Project`,
      content: `Apply your knowledge of ${tag} in a real-world project. This lesson includes advanced topics and hands-on practice.`,
      order: 3,
      course: courseId,
      quiz: {
        title: `${tag.toUpperCase()} Advanced Quiz`,
        description: `Test your advanced understanding of ${tag}`,
        questions: [
          {
            question: `What is considered an advanced feature of ${tag}?`,
            options: ["Basic syntax", "Advanced patterns and optimization", "Simple examples", "Getting started guide"],
            correctAnswer: 1,
            explanation: `Advanced ${tag} involves complex patterns, optimization techniques, and real-world applications`
          },
          {
            question: `When should you use advanced ${tag} techniques?`,
            options: ["Never", "Only for complex projects", "In all projects", "Only for beginners"],
            correctAnswer: 1,
            explanation: "Advanced techniques should be used when dealing with complex requirements and scalable solutions"
          }
        ],
        passingScore: 80,
        timeLimit: 20
      },
      estimatedDuration: 60,
      prerequisites: [], // Will be set to previous lesson ID
      resources: [
        {
          title: `${tag.toUpperCase()} Project Template`,
          url: `https://example.com/${tag}-project`,
          type: 'document'
        }
      ]
    }
  ];

  return lessons;
};

const generateSampleCoursesWithLessons = (count = 10) => {
  const courses = [];

  for (let i = 1; i <= count; i++) {
    const tag = sampleTags[i % sampleTags.length];
    const title = `Course ${i}: ${tag.toUpperCase()} Essentials`;
    const courseId = `course_${i}_${tag}`; // Temporary ID for reference

    const course = {
      title,
      description: `Learn the fundamentals of ${tag} with hands-on lessons and quizzes.`,
      tags: [tag],
      lessons: generateLessonsForCourse(title, tag, courseId),
      estimatedDuration: 135, // Sum of all lesson durations
      difficulty: i <= 3 ? 'beginner' : i <= 7 ? 'intermediate' : 'advanced',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    courses.push(course);
  }

  return courses;
};

module.exports = {
  generateSampleCoursesWithLessons,
  getQuizQuestions
};