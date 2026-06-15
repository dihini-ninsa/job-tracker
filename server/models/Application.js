const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  company: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  dateApplied: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Applied', 'Interview', 'Offer', 'Rejected'],
    default: 'Applied'
  },
  jobDescription: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  },
  deadline: {
    type: Date,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);