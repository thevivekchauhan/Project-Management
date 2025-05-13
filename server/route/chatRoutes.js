const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const auth = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(auth);

// Get all messages
router.get('/', chatController.getMessages);

// Send a message
router.post('/', chatController.sendMessage);

// Get messages by user
router.get('/user/:userId', chatController.getMessagesByUser);

// Delete a message
router.delete('/:messageId', chatController.deleteMessage);

module.exports = router; 