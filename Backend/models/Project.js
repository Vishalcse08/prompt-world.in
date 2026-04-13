const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  input: { type: String, required: true },
  promptOutput: { type: String, required: true },
  projectName: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectSchema);
