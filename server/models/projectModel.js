const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  progress: { type: Number, default: 0 },
  status: { type: String, enum: ['Active', 'Completed'], default: 'Active' },
}, { 
  timestamps: true,
  collection: 'project' // Explicitly set collection name to 'project'
});

module.exports = mongoose.model('Project', projectSchema, 'project'); // Explicitly set collection name
