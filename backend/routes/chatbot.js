const express = require('express');
const { getChatbotResponse } = require('../controllers/chatbotController');
const router = express.Router();

router.post('/response', getChatbotResponse);

module.exports = router;