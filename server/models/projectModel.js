const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  progress: { type: Number, default: 0 },
  status: { type: String, enum: ['To Do', 'In Progress', 'Done'], default: 'To Do' },
  assignedTo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  },
  members: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  }],
}, { 
  timestamps: true,
  collection: 'project' // Explicitly set collection name to 'project'
});

module.exports = mongoose.model('Project', projectSchema, 'project'); // Explicitly set collection name
