const Progress = require('../models/Progress');

async function getChatbotResponse(req, res) {
  try {
    const { userId, courseId, userInput } = req.body;

    // Fetch progress for the user and course
    const progress = await Progress.findOne({ user: userId, course: courseId });
    if (!progress) {
      return res.status(404).json({ error: 'Progress not found' });
    }

    // Analyze user input and progress
    let response;
    if (userInput.toLowerCase().includes('help')) {
      response = 'How can I assist you? You can ask about lessons, quizzes, or your progress.';
    } else if (progress.lessons.some(lesson => lesson.quizScore < 50)) {
      response = 'It seems you are struggling with some topics. Would you like to review the lessons again?';
    } else {
      response = 'Great job! Keep up the good work.';
    }

    res.json({ response });
  } catch (error) {
    console.error('Error generating chatbot response:', error);
    res.status(500).json({ error: 'Failed to generate chatbot response' });
  }
}

// Add this function to handle course enrollment
async function enrollCourse(req, res) {
  try {
    const { userId, courseId } = req.body;

    // Find the user and update their enrolled courses
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { enrolledCourses: { course: courseId, progress: { completedLessons: [] } } } },
      { new: true }
    );

    res.status(200).json({ message: 'Course enrolled successfully' });
  } catch (error) {
    console.error('Error enrolling course:', error);
    res.status(500).json({ error: 'Failed to enroll in course' });
  }
}

module.exports = { getChatbotResponse, enrollCourse };