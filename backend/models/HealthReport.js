const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const healthReportSchema = new mongoose.Schema({
  reportId: {
    type: String,
    default: uuidv4,
    unique: true
  },
  userId: {
    type: String,
    required: true
  },
  symptoms: [{
    type: String,
    required: true
  }],
  possibleConditions: [{
    condition: String,
    probability: String,
    description: String
  }],
  precautions: [String],
  recommendations: [String],
  severity: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'low'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('HealthReport', healthReportSchema);
