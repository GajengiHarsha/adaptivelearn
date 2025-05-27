const mongoose = require('mongoose');
const User = require('../models/User');
const Course = require('../models/course');
const Lesson = require('../models/Lesson');
const Progress = require('../models/Progress');

// Mark a lesson as complete
exports.markLessonComplete = async (req, res) => {
  const { courseId, lessonId } = req.body;
  const userId = req.user.id;

  try {
    // Validate input
    if (!courseId || !lessonId) {
      return res.status(400).json({ error: 'Course ID and Lesson ID are required' });
    }

    // Find user and course
    const user = await User.findById(userId);
    const course = await Course.findById(courseId).populate('lessons');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check if user is enrolled in the course
    const enrollment = user.enrolledCourses.find(ec => ec.course.toString() === courseId);
    if (!enrollment) {
      return res.status(400).json({ error: 'User not enrolled in this course' });
    }

    // Verify lesson belongs to course
    const lesson = course.lessons.find(l => l._id.toString() === lessonId);
    if (!lesson) {
      return res.status(400).json({ error: 'Lesson not found in this course' });
    }

    // Find or create lesson progress
    let lessonProgress = enrollment.progress.find(p => p.lessonId.toString() === lessonId);
    
    if (lessonProgress) {
      lessonProgress.completed = true;
    } else {
      enrollment.progress.push({
        lessonId: new mongoose.Types.ObjectId(lessonId),
        completed: true
      });
    }

    // Calculate course progress
    const totalLessons = course.lessons.length;
    const completedLessons = enrollment.progress.filter(p => p.completed).length;
    const progressPercentage = Math.round((completedLessons / totalLessons) * 100);

    // Update enrollment progress percentage
    enrollment.progressPercentage = progressPercentage;

    await user.save();

    res.json({
      message: 'Lesson marked as complete',
      progressPercentage,
      completedLessons,
      totalLessons
    });

  } catch (error) {
    console.error('Error marking lesson complete:', error);
    res.status(500).json({ error: 'Failed to mark lesson as complete' });
  }
};

// Submit quiz results
exports.submitQuizResult = async (req, res) => {
  const { courseId, lessonId, answers, score, timeTaken } = req.body;
  const userId = req.user.id;

  try {
    // Validate input
    if (!courseId || !lessonId || !answers || score === undefined) {
      return res.status(400).json({ error: 'Missing required quiz data' });
    }

    const user = await User.findById(userId);
    const lesson = await Lesson.findById(lessonId);

    if (!user || !lesson) {
      return res.status(404).json({ error: 'User or lesson not found' });
    }

    // Check if user is enrolled
    const enrollment = user.enrolledCourses.find(ec => ec.course.toString() === courseId);
    if (!enrollment) {
      return res.status(400).json({ error: 'User not enrolled in this course' });
    }

    // Find or create lesson progress
    let lessonProgress = enrollment.progress.find(p => p.lessonId.toString() === lessonId);
    
    if (!lessonProgress) {
      lessonProgress = {
        lessonId: new mongoose.Types.ObjectId(lessonId),
        completed: false
      };
      enrollment.progress.push(lessonProgress);
    }

    // Store quiz result
    lessonProgress.quizResult = {
      score,
      answers,
      timeTaken,
      passed: score >= (lesson.quiz?.passingScore || 60),
      submittedAt: new Date()
    };

    // Auto-complete lesson if quiz is passed
    if (lessonProgress.quizResult.passed) {
      lessonProgress.completed = true;
    }

    // Recalculate course progress
    const course = await Course.findById(courseId);
    const totalLessons = course.lessons.length;
    const completedLessons = enrollment.progress.filter(p => p.completed).length;
    enrollment.progressPercentage = Math.round((completedLessons / totalLessons) * 100);

    await user.save();

    res.json({
      message: 'Quiz submitted successfully',
      passed: lessonProgress.quizResult.passed,
      score,
      lessonCompleted: lessonProgress.completed,
      progressPercentage: enrollment.progressPercentage
    });

  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({ error: 'Failed to submit quiz' });
  }
};

// Update user progress
exports.updateProgress = async (req, res) => {
  const { courseId, lessonId, completed } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const enrollment = user.enrolledCourses.find(ec => ec.course.toString() === courseId);
    if (!enrollment) return res.status(400).json({ error: 'User is not enrolled in this course' });

    let lessonProgress = enrollment.progress.find(p => p.lessonId.toString() === lessonId);
    if (!lessonProgress) {
      lessonProgress = { lessonId, completed };
      enrollment.progress.push(lessonProgress);
    } else {
      lessonProgress.completed = completed;
    }

    await user.save();
    res.json({ message: 'Progress updated successfully' });
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
};

// Get course progress
exports.getCourseProgress = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    const course = await Course.findById(courseId).populate('lessons');

    if (!user || !course) {
      return res.status(404).json({ error: 'User or course not found' });
    }

    const enrollment = user.enrolledCourses.find(ec => ec.course.toString() === courseId);
    if (!enrollment) {
      return res.status(404).json({ error: 'User not enrolled in this course' });
    }

    const totalLessons = course.lessons.length;
    const completedLessons = enrollment.progress.filter(p => p.completed).length;
    const progressPercentage = enrollment.progressPercentage || 0;

    // Get detailed lesson progress
    const lessonProgress = course.lessons.map(lesson => {
      const progress = enrollment.progress.find(p => p.lessonId.toString() === lesson._id.toString());
      return {
        lessonId: lesson._id,
        title: lesson.title,
        order: lesson.order,
        completed: progress?.completed || false,
        hasQuiz: !!lesson.quiz,
        quizResult: progress?.quizResult || null
      };
    });

    res.json({
      progressPercentage,
      completedLessons,
      totalLessons,
      lessonProgress
    });

  } catch (error) {
    console.error('Error fetching course progress:', error);
    res.status(500).json({ error: 'Failed to fetch course progress' });
  }
};

// Get lesson details with progress
exports.getLessonWithProgress = async (req, res) => {
  const { courseId, lessonId } = req.params;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    const lesson = await Lesson.findById(lessonId);

    if (!user || !lesson) {
      return res.status(404).json({ error: 'User or lesson not found' });
    }

    // Check enrollment
    const enrollment = user.enrolledCourses.find(ec => ec.course.toString() === courseId);
    if (!enrollment) {
      return res.status(400).json({ error: 'User not enrolled in this course' });
    }

    // Get lesson progress
    const progress = enrollment.progress.find(p => p.lessonId.toString() === lessonId);

    res.json({
      lesson: {
        _id: lesson._id,
        title: lesson.title,
        content: lesson.content,
        order: lesson.order,
        estimatedDuration: lesson.estimatedDuration,
        resources: lesson.resources,
        hasQuiz: !!lesson.quiz
      },
      progress: {
        completed: progress?.completed || false,
        quizResult: progress?.quizResult || null
      }
    });

  } catch (error) {
    console.error('Error fetching lesson with progress:', error);
    res.status(500).json({ error: 'Failed to fetch lesson details' });
  }
};

// Get quiz for a lesson
exports.getQuiz = async (req, res) => {
  const { lessonId } = req.params;

  try {
    const lesson = await Lesson.findById(lessonId);
    
    if (!lesson || !lesson.quiz) {
      return res.status(404).json({ error: 'Quiz not found for this lesson' });
    }

    // Return quiz without correct answers (for security)
    const quizForUser = {
      title: lesson.quiz.title,
      description: lesson.quiz.description,
      timeLimit: lesson.quiz.timeLimit,
      passingScore: lesson.quiz.passingScore,
      questions: lesson.quiz.questions.map((q, index) => ({
        id: index,
        question: q.question,
        options: q.options
      }))
    };

    res.json(quizForUser);

  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ error: 'Failed to fetch quiz' });
  }
};