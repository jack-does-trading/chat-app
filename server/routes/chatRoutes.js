const express = require('express');
const {getMessages, sendMessage} = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/send', authMiddleware, sendMessage);
router.get('/', authMiddleware, getMessages);

module.exports = router;