const express = require('express');
const router = express.Router();
const Habit = require('../models/Habit');

// Get all habits for a user
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    const query = userId ? { userId } : {};
    const habits = await Habit.find(query).sort({ createdAt: -1 });
    res.json(habits);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get habit by ID
router.get('/:habitId', async (req, res) => {
  try {
    const habit = await Habit.findOne({ habitId: req.params.habitId });
    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }
    res.json(habit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new habit
router.post('/', async (req, res) => {
  try {
    const habit = new Habit(req.body);
    await habit.save();
    res.status(201).json(habit);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update habit
router.put('/:habitId', async (req, res) => {
  try {
    const habit = await Habit.findOneAndUpdate(
      { habitId: req.params.habitId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }
    res.json(habit);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Mark habit as complete for today
router.post('/:habitId/complete', async (req, res) => {
  try {
    const habit = await Habit.findOne({ habitId: req.params.habitId });
    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already completed today
    const alreadyCompleted = habit.completionHistory.some(entry => {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === today.getTime() && entry.completed;
    });

    if (alreadyCompleted) {
      return res.status(400).json({ error: 'Habit already completed today' });
    }

    // Check streak
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const completedYesterday = habit.completionHistory.some(entry => {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === yesterday.getTime() && entry.completed;
    });

    // Update streak
    if (completedYesterday || habit.streak === 0) {
      habit.streak += 1;
    } else {
      habit.streak = 1; // Reset streak if missed yesterday
    }

    // Update longest streak
    if (habit.streak > habit.longestStreak) {
      habit.longestStreak = habit.streak;
    }

    // Add completion record
    habit.completionHistory.push({
      date: today,
      completed: true
    });

    habit.lastCompleted = new Date();
    await habit.save();

    res.json({ 
      message: 'Habit marked as complete', 
      habit,
      streakBroken: false
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check for missed habits
router.get('/:habitId/check-streak', async (req, res) => {
  try {
    const habit = await Habit.findOne({ habitId: req.params.habitId });
    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Check if completed yesterday
    const completedYesterday = habit.completionHistory.some(entry => {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === yesterday.getTime() && entry.completed;
    });

    // Check if completed today
    const completedToday = habit.completionHistory.some(entry => {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === today.getTime() && entry.completed;
    });

    let streakBroken = false;
    if (!completedToday && habit.lastCompleted) {
      const lastCompletedDate = new Date(habit.lastCompleted);
      lastCompletedDate.setHours(0, 0, 0, 0);
      
      const daysSinceCompletion = Math.floor((today - lastCompletedDate) / (1000 * 60 * 60 * 24));
      
      if (daysSinceCompletion > 1) {
        streakBroken = true;
        habit.streak = 0;
        await habit.save();
      }
    }

    res.json({
      habit,
      streakBroken,
      completedToday,
      completedYesterday
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete habit
router.delete('/:habitId', async (req, res) => {
  try {
    const habit = await Habit.findOneAndDelete({ habitId: req.params.habitId });
    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }
    res.json({ message: 'Habit deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
