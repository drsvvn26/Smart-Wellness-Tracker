// API Service for making HTTP requests
wellnessApp.service('ApiService', ['$http', 'API_BASE_URL', function($http, API_BASE_URL) {
    
    // Users API
    this.getUsers = function() {
        return $http.get(API_BASE_URL + '/users');
    };
    
    this.getUser = function(userId) {
        return $http.get(API_BASE_URL + '/users/' + userId);
    };
    
    this.createUser = function(userData) {
        return $http.post(API_BASE_URL + '/users', userData);
    };
    
    this.updateUser = function(userId, userData) {
        return $http.put(API_BASE_URL + '/users/' + userId, userData);
    };
    
    this.uploadProfileImage = function(userId, formData) {
        return $http.post(API_BASE_URL + '/users/' + userId + '/upload', formData, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        });
    };
    
    // Habits API
    this.getHabits = function(userId) {
        return $http.get(API_BASE_URL + '/habits?userId=' + userId);
    };
    
    this.getHabit = function(habitId) {
        return $http.get(API_BASE_URL + '/habits/' + habitId);
    };
    
    this.createHabit = function(habitData) {
        return $http.post(API_BASE_URL + '/habits', habitData);
    };
    
    this.updateHabit = function(habitId, habitData) {
        return $http.put(API_BASE_URL + '/habits/' + habitId, habitData);
    };
    
    this.completeHabit = function(habitId) {
        return $http.post(API_BASE_URL + '/habits/' + habitId + '/complete');
    };
    
    this.checkStreak = function(habitId) {
        return $http.get(API_BASE_URL + '/habits/' + habitId + '/check-streak');
    };
    
    this.deleteHabit = function(habitId) {
        return $http.delete(API_BASE_URL + '/habits/' + habitId);
    };
    
    // Health API
    this.analyzeSymptoms = function(symptomsData) {
        return $http.post(API_BASE_URL + '/health/analyze', symptomsData);
    };
    
    this.getHealthReports = function(userId) {
        return $http.get(API_BASE_URL + '/health/reports?userId=' + userId);
    };
    
    this.getHealthReport = function(reportId) {
        return $http.get(API_BASE_URL + '/health/reports/' + reportId);
    };
    
    this.deleteHealthReport = function(reportId) {
        return $http.delete(API_BASE_URL + '/health/reports/' + reportId);
    };
    
    this.getSymptomsList = function() {
        return $http.get(API_BASE_URL + '/health/symptoms');
    };
    
    // Calendar API
    this.getCalendarEvents = function(userId, month, year) {
        var url = API_BASE_URL + '/calendar?userId=' + userId;
        if (month && year) {
            url += '&month=' + month + '&year=' + year;
        }
        return $http.get(url);
    };
    
    this.getCalendarEvent = function(eventId) {
        return $http.get(API_BASE_URL + '/calendar/' + eventId);
    };
    
    this.createCalendarEvent = function(eventData) {
        return $http.post(API_BASE_URL + '/calendar', eventData);
    };
    
    this.updateCalendarEvent = function(eventId, eventData) {
        return $http.put(API_BASE_URL + '/calendar/' + eventId, eventData);
    };
    
    this.completeCalendarEvent = function(eventId) {
        return $http.post(API_BASE_URL + '/calendar/' + eventId + '/complete');
    };
    
    this.deleteCalendarEvent = function(eventId) {
        return $http.delete(API_BASE_URL + '/calendar/' + eventId);
    };
    
    // Analytics API
    this.getDashboardData = function(userId) {
        return $http.get(API_BASE_URL + '/analytics/dashboard?userId=' + userId);
    };
    
    this.getHabitStatistics = function(userId) {
        return $http.get(API_BASE_URL + '/analytics/habits?userId=' + userId);
    };
    
    this.getInsights = function(userId) {
        return $http.get(API_BASE_URL + '/analytics/insights?userId=' + userId);
    };
}]);
