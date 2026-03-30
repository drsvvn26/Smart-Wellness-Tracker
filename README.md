# Smart Wellness Tracker

A comprehensive full-stack wellness tracking application built with AngularJS, Node.js, Express, and MongoDB.

## 🌟 Features

### Core Modules
- **📊 Dashboard** - Real-time analytics overview with smart insights
- **✅ Habit Tracker** - Track daily habits with streak management and alerts
- **💊 Smart Health Checker** - AI-powered symptom analysis with recommendations
- **📈 Analytics Dashboard** - Multiple interactive charts (Bar, Line, Pie, Doughnut)
- **📅 Calendar Planner** - Monthly calendar with event management
- **👤 Profile Management** - User settings with image upload
- **ℹ️ About Page** - Application information with AJAX demos

### Advanced Features
- **🔔 Reminder System** - Automated notifications for habits and hydration
- **🎨 Theme Switcher** - Light/Dark mode support
- **🚨 Streak Alerts** - Red background and popup when habits are missed
- **📊 Real-time Updates** - Dynamic data updates without page refresh
- **🎯 Smart Insights Engine** - Rule-based recommendations
- **🧮 Calculator Directive** - Custom AngularJS calculator component
- **🔢 Prime Number Filter** - Custom AngularJS filter
- **🧪 Form Validations** - Mobile (10 digits), password (4-10 chars, starts with number)
- **🎬 Image Slider** - Auto-play/stop functionality
- **🚗 Car Object** - JavaScript object with methods (speed control)
- **📁 AJAX Features** - XML and JSON data loading demos

## 🏗️ Technology Stack

### Frontend
- **AngularJS 1.8.2** - Single Page Application framework
- **Bootstrap 5.3** - Responsive UI design
- **Chart.js 4.4** - Data visualization
- **HTML5, CSS3, JavaScript** - Core web technologies

### Backend
- **Node.js** - Runtime environment
- **Express 4.x** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB

## 📁 Project Structure

```
/app/
├── backend/
│   ├── server.js              # Express server
│   ├── seed.js                # Database seeding script
│   ├── models/                # MongoDB schemas
│   │   ├── User.js
│   │   ├── Habit.js
│   │   ├── HealthReport.js
│   │   └── CalendarEvent.js
│   └── routes/                # API endpoints
│       ├── users.js
│       ├── habits.js
│       ├── health.js
│       ├── calendar.js
│       └── analytics.js
├── frontend/
│   ├── index.html             # Main SPA entry point
│   ├── css/                   # Stylesheets
│   ├── js/
│   │   ├── app.js             # AngularJS initialization
│   │   ├── config.js          # Routing configuration
│   │   ├── controllers/       # Page controllers
│   │   ├── services/          # AngularJS services
│   │   ├── directives/        # Custom directives
│   │   └── filters/           # Custom filters
│   ├── views/                 # HTML templates
│   └── data/                  # Sample XML/JSON files
└── uploads/                   # User uploaded files
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB
- Yarn or npm

### Installation

1. **Backend Setup**
```bash
cd /app/backend
yarn install
```

2. **Start Services**
```bash
sudo supervisorctl start all
sudo supervisorctl status
```

3. **Seed Database** (if needed)
```bash
cd /app/backend
node seed.js
```

4. **Access Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8001/api

## 📡 API Endpoints

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:userId` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:userId` - Update user
- `POST /api/users/:userId/upload` - Upload profile image

### Habits
- `GET /api/habits?userId=xxx` - Get all habits
- `POST /api/habits` - Create new habit
- `PUT /api/habits/:habitId` - Update habit
- `POST /api/habits/:habitId/complete` - Mark habit complete
- `GET /api/habits/:habitId/check-streak` - Check streak status
- `DELETE /api/habits/:habitId` - Delete habit

### Health
- `POST /api/health/analyze` - Analyze symptoms
- `GET /api/health/reports?userId=xxx` - Get health reports
- `GET /api/health/symptoms` - Get available symptoms list
- `DELETE /api/health/reports/:reportId` - Delete report

### Calendar
- `GET /api/calendar?userId=xxx&month=1&year=2024` - Get events
- `POST /api/calendar` - Create new event
- `PUT /api/calendar/:eventId` - Update event
- `POST /api/calendar/:eventId/complete` - Mark event complete
- `DELETE /api/calendar/:eventId` - Delete event

### Analytics
- `GET /api/analytics/dashboard?userId=xxx` - Get dashboard data
- `GET /api/analytics/habits?userId=xxx` - Get habit statistics
- `GET /api/analytics/insights?userId=xxx` - Get smart insights

## 🎨 AngularJS Components

### Custom Directives
- **Calculator** - `<calculator></calculator>` - Interactive calculator

### Custom Services
- **ApiService** - HTTP requests wrapper
- **MathService** - Mathematical operations (add, subtract, square)
- **ReminderService** - Notification management

### Custom Filters
- **isPrime** - Check if number is prime
- **capitalize** - Capitalize first letter
- **formatDate** - Format date strings

## 🔧 Configuration

### Database Configuration
Location: `/app/backend/.env`
```
PORT=8001
MONGODB_URI=mongodb://localhost:27017/smart_wellness_tracker
NODE_ENV=development
```

### Frontend Configuration
Location: `/app/frontend/js/app.js`
```javascript
API_BASE_URL: 'http://localhost:8001/api'
DEFAULT_USER_ID: '3183d686-d3c3-43bc-84dc-494544ef54a2'
```

## 🧪 Testing Features

### Form Validations
- **Mobile**: Must be exactly 10 digits, invalid shows red background
- **Password**: 4-10 characters, must start with number
- **Confirm Password**: Must match original password

### JavaScript Demos
1. **Background Color Changer** - Enter color name (e.g., "red", "#ff5733")
2. **Image Slider** - Auto-play wellness images with start/stop controls
3. **Car Speed Demo** - Increase/decrease speed with progress bar
4. **Calculator** - Add, subtract, multiply, divide operations
5. **Prime Checker** - Enter number to check if it's prime

### AJAX Demos
- **XML Data** - Loads student data from `/data/students.xml`
- **JSON Data** - Loads course data from `/data/courses.json`

## 📊 Default Seed Data

The application comes with pre-populated data:
- **User**: John Doe (john@example.com, 9876543210)
- **Habits**: Morning Exercise, Drink Water, Reading, Meditation
- **Calendar Events**: 3 sample events

## 🎯 Key Functionalities

### Habit Tracking
- ✅ Add/Edit/Delete habits
- 🔥 Streak tracking (current and longest)
- ⚠️ Missed habit alerts with red background
- 📅 Daily completion tracking
- 📊 Completion history

### Health Checker
- 🩺 Symptom-based analysis
- 🎯 Rule-based condition matching
- 💊 Precautions and recommendations
- 🚨 Severity levels (low, medium, high)
- 📝 Report history

### Analytics
- 📊 Weekly completion bar chart
- 📈 Monthly progress line chart  
- 🥧 Completion rate pie chart
- 🍩 Top 5 habits doughnut chart
- 💡 Smart insights and tips

### Calendar
- 📅 Monthly view with navigation
- 🎨 Color-coded days (today, has events, completed)
- ➕ Add events with types (note, habit, reminder, appointment)
- ⏰ Reminder times
- ✅ Mark events complete

## 🌙 Theme Support

Toggle between light and dark themes using the button in the navigation bar. Theme preference is saved in localStorage.

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop (1920x1080+)
- Tablets (768px+)
- Mobile devices (320px+)

## 🔔 Reminder System

Automated reminders:
- 💧 Water reminder every 30 minutes
- ✅ Habit completion reminder every 2 hours

Reminders appear as Bootstrap modals with motivational messages.

## 🐛 Troubleshooting

### Backend not starting
```bash
tail -n 50 /var/log/supervisor/backend.err.log
sudo supervisorctl restart backend
```

### MongoDB connection issues
```bash
sudo supervisorctl restart mongodb
mongosh # Test connection
```

### Frontend not loading
```bash
tail -n 50 /var/log/supervisor/frontend.err.log
sudo supervisorctl restart frontend
```

## 📝 Development Notes

### Hot Reload
- Backend: Automatically restarts on file changes
- Frontend: Refresh browser to see changes

### Adding New Features
1. Backend: Add routes in `/backend/routes/`, models in `/backend/models/`
2. Frontend: Add controllers in `/frontend/js/controllers/`, views in `/frontend/views/`
3. Update routing in `/frontend/js/config.js`

## 🎓 Educational Features

This project demonstrates:
- ✅ Full-stack JavaScript development
- ✅ RESTful API design
- ✅ NoSQL database operations
- ✅ SPA architecture with routing
- ✅ Real-time data updates
- ✅ Custom AngularJS components
- ✅ Form validation
- ✅ File upload handling
- ✅ Data visualization
- ✅ Responsive web design
- ✅ AJAX operations
- ✅ JavaScript OOP concepts

## 📄 License

This project is created for educational purposes.

## 👥 Support

For issues or questions, contact: support@smartwellness.com

---

**Built with ❤️ for wellness and technology**