const express = require('express');
const router = express.Router();
const CalendarEvent = require('../models/CalendarEvent');

// Get all calendar events
router.get('/', async (req, res) => {
  try {
    const { userId, month, year } = req.query;
    let query = {};
    
    if (userId) {
      query.userId = userId;
    }
    
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);
      query.date = { $gte: startDate, $lte: endDate };
    }
    
    const events = await CalendarEvent.find(query).sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get event by ID
router.get('/:eventId', async (req, res) => {
  try {
    const event = await CalendarEvent.findOne({ eventId: req.params.eventId });
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new event
router.post('/', async (req, res) => {
  try {
    const event = new CalendarEvent(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update event
router.put('/:eventId', async (req, res) => {
  try {
    const event = await CalendarEvent.findOneAndUpdate(
      { eventId: req.params.eventId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Mark event as completed
router.post('/:eventId/complete', async (req, res) => {
  try {
    const event = await CalendarEvent.findOneAndUpdate(
      { eventId: req.params.eventId },
      { completed: true },
      { new: true }
    );
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json({ message: 'Event marked as completed', event });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete event
router.delete('/:eventId', async (req, res) => {
  try {
    const event = await CalendarEvent.findOneAndDelete({ eventId: req.params.eventId });
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
