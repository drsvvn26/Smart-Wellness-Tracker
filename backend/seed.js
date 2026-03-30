require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Habit = require('./models/Habit');
const HealthReport = require('./models/HealthReport');
const CalendarEvent = require('./models/CalendarEvent');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Habit.deleteMany({});
    await HealthReport.deleteMany({});
    await CalendarEvent.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create default user
    const user = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      mobile: '9876543210',
      theme: 'light'
    });
    console.log('👤 Created user:', user.name);

    // Create sample habits
    const habits = await Habit.create([
      {
        userId: user.userId,
        habitName: 'Morning Exercise',
        description: '30 minutes of workout',
        frequency: 'daily',
        streak: 5,
        longestStreak: 10,
        lastCompleted: new Date(),
        completionHistory: [
          { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), completed: true },
          { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), completed: true },
          { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), completed: true },
          { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), completed: true },
          { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), completed: true }
        ]
      },
      {
        userId: user.userId,
        habitName: 'Drink Water',
        description: '8 glasses daily',
        frequency: 'daily',
        streak: 12,
        longestStreak: 15,
        lastCompleted: new Date(),
        completionHistory: [
          { date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), completed: true },
          { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), completed: true },
          { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), completed: true },
          { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), completed: true }
        ]
      },
      {
        userId: user.userId,
        habitName: 'Reading',
        description: 'Read for 20 minutes',
        frequency: 'daily',
        streak: 3,
        longestStreak: 7,
        lastCompleted: new Date(),
        completionHistory: [
          { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), completed: true },
          { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), completed: true },
          { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), completed: true }
        ]
      },
      {
        userId: user.userId,
        habitName: 'Meditation',
        description: '10 minutes mindfulness',
        frequency: 'daily',
        streak: 0,
        longestStreak: 5,
        completionHistory: []
      }
    ]);
    console.log('✅ Created habits:', habits.length);

    // Create sample calendar events
    const events = await CalendarEvent.create([
      {
        userId: user.userId,
        title: 'Morning Yoga',
        description: 'Yoga session at park',
        eventType: 'habit',
        date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        reminderTime: '07:00'
      },
      {
        userId: user.userId,
        title: 'Doctor Appointment',
        description: 'Annual checkup',
        eventType: 'appointment',
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        reminderTime: '10:00'
      },
      {
        userId: user.userId,
        title: 'Buy Groceries',
        description: 'Weekly shopping',
        eventType: 'reminder',
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        completed: false
      }
    ]);
    console.log('📅 Created calendar events:', events.length);

    console.log('✅ Seed data created successfully!');
    console.log('📝 Default User ID:', user.userId);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
