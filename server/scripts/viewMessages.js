const mongoose = require('mongoose');
const Message = require('../models/chat');
require('dotenv').config();

async function viewMessages() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all messages
    const messages = await Message.find()
      .populate('sender', 'name email')
      .populate('receiver', 'name email')
      .sort({ timestamp: -1 });

    console.log('\nStored Messages:');
    console.log('----------------');
    
    messages.forEach((msg, index) => {
      console.log(`\nMessage ${index + 1}:`);
      console.log(`From: ${msg.sender.name} (${msg.sender.email})`);
      console.log(`To: ${msg.receiver.name} (${msg.receiver.email})`);
      console.log(`Content: ${msg.content}`);
      console.log(`Time: ${msg.timestamp}`);
      console.log(`Read: ${msg.read}`);
      console.log('----------------');
    });

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

viewMessages(); 