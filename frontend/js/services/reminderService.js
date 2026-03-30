// Reminder Service
wellnessApp.service('ReminderService', ['$interval', '$rootScope', function($interval, $rootScope) {
    var reminders = [];
    var intervalPromise;
    
    // Add a reminder
    this.addReminder = function(message, intervalMinutes) {
        var reminder = {
            message: message,
            interval: intervalMinutes * 60 * 1000, // Convert to milliseconds
            active: true
        };
        reminders.push(reminder);
        return reminder;
    };
    
    // Start reminder system
    this.startReminders = function() {
        // Water reminder every 30 minutes
        intervalPromise = $interval(function() {
            $rootScope.$broadcast('showReminder', {
                message: '💧 Time to drink water! Stay hydrated.'
            });
        }, 30 * 60 * 1000); // 30 minutes
        
        // Habit completion reminder every 2 hours
        $interval(function() {
            $rootScope.$broadcast('showReminder', {
                message: '✅ Have you completed your daily habits?'
            });
        }, 2 * 60 * 60 * 1000); // 2 hours
    };
    
    // Stop all reminders
    this.stopReminders = function() {
        if (intervalPromise) {
            $interval.cancel(intervalPromise);
        }
    };
    
    // Get all reminders
    this.getReminders = function() {
        return reminders;
    };
}]);
