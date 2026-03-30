const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const habitSchema = new mongoose.Schema({
  habitId: {
    type: String,
    default: uuidv4,
    unique: true
  },
  userId: {
    type: String,
    required: true
  },
  habitName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'custom'],
    default: 'daily'
  },
  streak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  lastCompleted: {
    type: Date,
    default: null
  },
  completionHistory: [{
    date: {
      type: Date,
      required: true
    },
    completed: {
      type: Boolean,
      default: false
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Habit', habitSchema);
