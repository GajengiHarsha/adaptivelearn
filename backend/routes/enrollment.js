const express = require('express');
const router = express.Router();
const { enrollInCourse, unenrollFromCourse } = require('../controllers/enrollmentController');
const authMiddleware = require('../middleware/authMiddleware'); // Use authMiddleware to ensure authentication

// Define routes
router.post('/', authMiddleware, enrollInCourse); // Authenticate the user
router.delete('/', authMiddleware, unenrollFromCourse); // Authenticate the user

module.exports = router;
