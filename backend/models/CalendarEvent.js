const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const calendarEventSchema = new mongoose.Schema({
  eventId: {
    type: String,
    default: uuidv4,
    unique: true
  },
  userId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  eventType: {
    type: String,
    enum: ['habit', 'reminder', 'note', 'appointment'],
    default: 'note'
  },
  date: {
    type: Date,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  reminderTime: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('CalendarEvent', calendarEventSchema);
