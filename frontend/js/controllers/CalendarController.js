// Calendar Controller
wellnessApp.controller('CalendarController', ['$scope', 'ApiService', 'DEFAULT_USER_ID', function($scope, ApiService, DEFAULT_USER_ID) {
    $scope.currentDate = new Date();
    $scope.currentMonth = $scope.currentDate.getMonth() + 1;
    $scope.currentYear = $scope.currentDate.getFullYear();
    $scope.calendarDays = [];
    $scope.events = [];
    $scope.selectedDate = null;
    $scope.selectedEvents = [];
    $scope.showEventForm = false;
    
    // Event form data
    $scope.eventForm = {
        userId: DEFAULT_USER_ID,
        title: '',
        description: '',
        eventType: 'note',
        date: '',
        reminderTime: ''
    };
    
    // Month names
    $scope.monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                         'July', 'August', 'September', 'October', 'November', 'December'];
    
    // Day names
    $scope.dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Load calendar
    $scope.loadCalendar = function() {
        ApiService.getCalendarEvents(DEFAULT_USER_ID, $scope.currentMonth, $scope.currentYear)
            .then(function(response) {
                $scope.events = response.data;
                $scope.generateCalendar();
            })
            .catch(function(error) {
                console.error('Error loading calendar:', error);
            });
    };
    
    // Generate calendar grid
    $scope.generateCalendar = function() {
        var firstDay = new Date($scope.currentYear, $scope.currentMonth - 1, 1);
        var lastDay = new Date($scope.currentYear, $scope.currentMonth, 0);
        var daysInMonth = lastDay.getDate();
        var startingDayOfWeek = firstDay.getDay();
        
        $scope.calendarDays = [];
        
        // Add empty cells for days before month starts
        for (var i = 0; i < startingDayOfWeek; i++) {
            $scope.calendarDays.push(null);
        }
        
        // Add days of the month
        for (var day = 1; day <= daysInMonth; day++) {
            var date = new Date($scope.currentYear, $scope.currentMonth - 1, day);
            var dayEvents = $scope.getEventsForDate(date);
            
            $scope.calendarDays.push({
                day: day,
                date: date,
                isToday: $scope.isToday(date),
                hasEvents: dayEvents.length > 0,
                hasCompletedEvents: dayEvents.some(e => e.completed),
                events: dayEvents
            });
        }
    };
    
    // Get events for a specific date
    $scope.getEventsForDate = function(date) {
        return $scope.events.filter(function(event) {
            var eventDate = new Date(event.date);
            return eventDate.getDate() === date.getDate() &&
                   eventDate.getMonth() === date.getMonth() &&
                   eventDate.getFullYear() === date.getFullYear();
        });
    };
    
    // Check if date is today
    $scope.isToday = function(date) {
        var today = new Date();
        return date.getDate() === today.getDate() &&
               date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    };
    
    // Previous month
    $scope.previousMonth = function() {
        if ($scope.currentMonth === 1) {
            $scope.currentMonth = 12;
            $scope.currentYear--;
        } else {
            $scope.currentMonth--;
        }
        $scope.loadCalendar();
    };
    
    // Next month
    $scope.nextMonth = function() {
        if ($scope.currentMonth === 12) {
            $scope.currentMonth = 1;
            $scope.currentYear++;
        } else {
            $scope.currentMonth++;
        }
        $scope.loadCalendar();
    };
    
    // Select date
    $scope.selectDate = function(dayObj) {
        if (dayObj) {
            $scope.selectedDate = dayObj.date;
            $scope.selectedEvents = dayObj.events;
        }
    };
    
    // Show add event form
    $scope.showAddEventForm = function() {
        $scope.showEventForm = true;
        $scope.eventForm = {
            userId: DEFAULT_USER_ID,
            title: '',
            description: '',
            eventType: 'note',
            date: $scope.selectedDate ? $scope.selectedDate.toISOString().split('T')[0] : '',
            reminderTime: ''
        };
    };
    
    // Save event
    $scope.saveEvent = function() {
        if (!$scope.eventForm.title || !$scope.eventForm.date) {
            alert('Please fill in all required fields');
            return;
        }
        
        ApiService.createCalendarEvent($scope.eventForm)
            .then(function(response) {
                $scope.loadCalendar();
                $scope.showEventForm = false;
                alert('Event added successfully!');
            })
            .catch(function(error) {
                console.error('Error creating event:', error);
                alert('Error creating event');
            });
    };
    
    // Complete event
    $scope.completeEvent = function(event) {
        ApiService.completeCalendarEvent(event.eventId)
            .then(function(response) {
                $scope.loadCalendar();
                alert('Event marked as completed!');
            })
            .catch(function(error) {
                console.error('Error completing event:', error);
                alert('Error completing event');
            });
    };
    
    // Delete event
    $scope.deleteEvent = function(event) {
        if (confirm('Are you sure you want to delete this event?')) {
            ApiService.deleteCalendarEvent(event.eventId)
                .then(function(response) {
                    $scope.loadCalendar();
                    alert('Event deleted successfully');
                })
                .catch(function(error) {
                    console.error('Error deleting event:', error);
                    alert('Error deleting event');
                });
        }
    };
    
    // Cancel form
    $scope.cancelEventForm = function() {
        $scope.showEventForm = false;
    };
    
    // Get event type icon
    $scope.getEventTypeIcon = function(type) {
        switch(type) {
            case 'habit': return 'bi-check2-square';
            case 'reminder': return 'bi-bell';
            case 'appointment': return 'bi-calendar-check';
            default: return 'bi-sticky';
        }
    };
    
    // Initialize
    $scope.loadCalendar();
}]);