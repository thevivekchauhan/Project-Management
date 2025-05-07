const mongoose = require('mongoose');

const recentTaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { 
    type: String, 
    enum: ['To Do', 'In Progress', 'Done'],
    default: 'To Do'
  },
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium'
  },
  project: { type: String, required: true },
  assignedTo: { type: String, required: true },
  dueDate: { type: Date, required: true },
  progress: { type: Number, default: 0 },
  comments: [{
    text: String,
    date: { type: Date, default: Date.now }
  }]
}, { 
  timestamps: true,
  collection: 'recentTasks'
});

module.exports = mongoose.model('RecentTask', recentTaskSchema);