// Main Controller
wellnessApp.controller('MainController', ['$scope', '$rootScope', 'ReminderService', function($scope, $rootScope, ReminderService) {
    // Theme Management
    $scope.currentTheme = localStorage.getItem('theme') || 'light';
    document.body.className = $scope.currentTheme + '-theme';
    
    $scope.toggleTheme = function() {
        $scope.currentTheme = $scope.currentTheme === 'light' ? 'dark' : 'light';
        document.body.className = $scope.currentTheme + '-theme';
        localStorage.setItem('theme', $scope.currentTheme);
    };
    
    // Loading state
    $scope.loading = false;
    
    // Reminder messages
    $scope.reminderMessage = '';
    $scope.streakMessage = '';
    
    // Listen for reminder broadcasts
    $rootScope.$on('showReminder', function(event, data) {
        $scope.reminderMessage = data.message;
        var modalElement = document.getElementById('reminderModal');
        if (modalElement) {
            var modal = new bootstrap.Modal(modalElement);
            modal.show();
        }
    });
    
    // Listen for streak broken alerts
    $rootScope.$on('streakBroken', function(event, data) {
        $scope.streakMessage = data.message;
        var modalElement = document.getElementById('streakAlertModal');
        if (modalElement) {
            var modal = new bootstrap.Modal(modalElement);
            modal.show();
        }
    });
    
    // Start reminder system
    ReminderService.startReminders();
    
    // Clean up on destroy
    $scope.$on('$destroy', function() {
        ReminderService.stopReminders();
    });
}]);