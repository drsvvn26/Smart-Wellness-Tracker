const express = require('express');
const router = express.Router();
const Habit = require('../models/Habit');
const HealthReport = require('../models/HealthReport');
const CalendarEvent = require('../models/CalendarEvent');

// Get analytics dashboard data
router.get('/dashboard', async (req, res) => {
  try {
    const { userId } = req.query;
    const query = userId ? { userId } : {};

    // Get habits data
    const habits = await Habit.find(query);
    const totalHabits = habits.length;
    const activeHabits = habits.filter(h => h.isActive).length;
    
    // Calculate completion stats
    let totalCompletions = 0;
    let totalMissed = 0;
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    habits.forEach(habit => {
      const recentCompletions = habit.completionHistory.filter(h => 
        new Date(h.date) >= last7Days
      );
      totalCompletions += recentCompletions.filter(h => h.completed).length;
      totalMissed += recentCompletions.filter(h => !h.completed).length;
    });

    // Weekly completion data for bar chart
    const weeklyData = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      let dayCompletions = 0;
      habits.forEach(habit => {
        const completed = habit.completionHistory.some(h => {
          const hDate = new Date(h.date);
          hDate.setHours(0, 0, 0, 0);
          return hDate.getTime() === date.getTime() && h.completed;
        });
        if (completed) dayCompletions++;
      });
      
      weeklyData.push({
        day: dayNames[date.getDay()],
        completions: dayCompletions
      });
    }

    // Monthly progress for line chart
    const monthlyData = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      let dayCompletions = 0;
      habits.forEach(habit => {
        const completed = habit.completionHistory.some(h => {
          const hDate = new Date(h.date);
          hDate.setHours(0, 0, 0, 0);
          return hDate.getTime() === date.getTime() && h.completed;
        });
        if (completed) dayCompletions++;
      });
      
      monthlyData.push({
        date: date.getDate(),
        completions: dayCompletions
      });
    }

    // Habit-wise completion for pie chart
    const habitWiseData = habits.slice(0, 5).map(habit => ({
      name: habit.habitName,
      completions: habit.completionHistory.filter(h => h.completed).length,
      streak: habit.streak
    }));

    // Health reports count
    const healthReports = await HealthReport.find(query);
    const totalHealthReports = healthReports.length;
    
    // Health severity distribution
    const healthSeverity = {
      low: healthReports.filter(r => r.severity === 'low').length,
      medium: healthReports.filter(r => r.severity === 'medium').length,
      high: healthReports.filter(r => r.severity === 'high').length
    };

    // Calendar events
    const calendarEvents = await CalendarEvent.find(query);
    const upcomingEvents = calendarEvents.filter(e => new Date(e.date) >= new Date()).length;
    const completedEvents = calendarEvents.filter(e => e.completed).length;

    // Calculate average streak
    const totalStreak = habits.reduce((sum, h) => sum + h.streak, 0);
    const avgStreak = habits.length > 0 ? (totalStreak / habits.length).toFixed(1) : 0;

    // Best performing habit
    const bestHabit = habits.reduce((best, current) => 
      current.streak > (best?.streak || 0) ? current : best, 
      null
    );

    res.json({
      summary: {
        totalHabits,
        activeHabits,
        totalCompletions,
        totalMissed,
        avgStreak,
        totalHealthReports,
        upcomingEvents,
        completedEvents,
        bestHabit: bestHabit ? {
          name: bestHabit.habitName,
          streak: bestHabit.streak
        } : null
      },
      charts: {
        weeklyCompletion: weeklyData,
        monthlyProgress: monthlyData,
        habitWiseCompletion: habitWiseData,
        completionRate: {
          completed: totalCompletions,
          missed: totalMissed
        },
        healthSeverity
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get habit statistics
router.get('/habits', async (req, res) => {
  try {
    const { userId } = req.query;
    const query = userId ? { userId } : {};
    
    const habits = await Habit.find(query);
    
    const statistics = habits.map(habit => ({
      habitId: habit.habitId,
      habitName: habit.habitName,
      streak: habit.streak,
      longestStreak: habit.longestStreak,
      totalCompletions: habit.completionHistory.filter(h => h.completed).length,
      completionRate: habit.completionHistory.length > 0 
        ? ((habit.completionHistory.filter(h => h.completed).length / habit.completionHistory.length) * 100).toFixed(1)
        : 0
    }));

    res.json(statistics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get insights and recommendations
router.get('/insights', async (req, res) => {
  try {
    const { userId } = req.query;
    const query = userId ? { userId } : {};
    
    const habits = await Habit.find(query);
    const healthReports = await HealthReport.find(query).sort({ createdAt: -1 }).limit(10);
    
    const insights = [];
    
    // Habit insights
    const habitsWithLowStreaks = habits.filter(h => h.streak < 3 && h.isActive);
    if (habitsWithLowStreaks.length > 0) {
      insights.push({
        type: 'warning',
        category: 'habits',
        message: `You have ${habitsWithLowStreaks.length} habit(s) with low streaks. Stay consistent!`,
        suggestion: 'Set reminders and start with small, achievable goals.'
      });
    }
    
    const habitsWithHighStreaks = habits.filter(h => h.streak >= 7);
    if (habitsWithHighStreaks.length > 0) {
      insights.push({
        type: 'success',
        category: 'habits',
        message: `Great job! You have ${habitsWithHighStreaks.length} habit(s) with 7+ day streaks!`,
        suggestion: 'Keep up the excellent work!'
      });
    }
    
    // Health insights
    const recentHighSeverity = healthReports.filter(r => r.severity === 'high').length;
    if (recentHighSeverity > 0) {
      insights.push({
        type: 'alert',
        category: 'health',
        message: `You have ${recentHighSeverity} high-severity health report(s). Please consult a doctor.`,
        suggestion: 'Don\'t ignore persistent symptoms.'
      });
    }
    
    // Common symptoms
    const symptomFrequency = {};
    healthReports.forEach(report => {
      report.symptoms.forEach(symptom => {
        symptomFrequency[symptom] = (symptomFrequency[symptom] || 0) + 1;
      });
    });
    
    const mostCommonSymptom = Object.keys(symptomFrequency).reduce((a, b) => 
      symptomFrequency[a] > symptomFrequency[b] ? a : b, 
      ''
    );
    
    if (mostCommonSymptom && symptomFrequency[mostCommonSymptom] >= 3) {
      insights.push({
        type: 'info',
        category: 'health',
        message: `Your most common symptom is "${mostCommonSymptom}". Consider lifestyle changes.`,
        suggestion: 'Track triggers and maintain a health diary.'
      });
    }
    
    // General wellness tips
    insights.push({
      type: 'tip',
      category: 'wellness',
      message: 'Stay hydrated! Drink at least 8 glasses of water daily.',
      suggestion: 'Set hourly reminders to drink water.'
    });
    
    insights.push({
      type: 'tip',
      category: 'wellness',
      message: 'Aim for 7-8 hours of quality sleep every night.',
      suggestion: 'Maintain a consistent sleep schedule.'
    });
    
    res.json({ insights });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
