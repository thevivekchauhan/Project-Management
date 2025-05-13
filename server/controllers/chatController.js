const Message = require('../models/chat');

// Get all messages
exports.getMessages = async (req, res) => {
  try {
    console.log('Fetching all messages...');
    const messages = await Message.find()
      .populate('sender', 'name email')
      .populate('receiver', 'name email')
      .sort({ timestamp: -1 });
    console.log('Found messages:', messages.length);
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching messages',
      error: error.message 
    });
  }
};

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    console.log('Received message request:', req.body);
    const { sender, receiver, content } = req.body;
    
    if (!sender || !receiver || !content) {
      console.error('Missing required fields:', { sender, receiver, content });
      return res.status(400).json({ 
        success: false,
        message: 'Missing required fields',
        required: { sender: !sender, receiver: !receiver, content: !content }
      });
    }

    console.log('Creating new message...');
    const message = new Message({
      sender,
      receiver,
      content
    });

    console.log('Saving message...');
    await message.save();
    
    console.log('Populating message data...');
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name email')
      .populate('receiver', 'name email');

    console.log('Message saved successfully:', populatedMessage);
    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: populatedMessage
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error sending message',
      error: error.message 
    });
  }
};

// Get messages between two users
exports.getMessagesByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('Fetching messages for user:', userId);
    
    const messages = await Message.find({
      $or: [
        { sender: userId },
        { receiver: userId }
      ]
    })
    .populate('sender', 'name email')
    .populate('receiver', 'name email')
    .sort({ timestamp: -1 });
    
    console.log('Found messages:', messages.length);
    res.json({
      success: true,
      data: messages
    });
  } catch (error) {
    console.error('Error fetching user messages:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching user messages',
      error: error.message 
    });
  }
};

// Delete a message
exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    console.log('Deleting message:', messageId);
    
    await Message.findByIdAndDelete(messageId);
    console.log('Message deleted successfully');
    
    res.json({ 
      success: true,
      message: 'Message deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error deleting message',
      error: error.message 
    });
  }
}; 