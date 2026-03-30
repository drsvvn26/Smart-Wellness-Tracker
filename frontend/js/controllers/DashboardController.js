// Dashboard Controller
wellnessApp.controller('DashboardController', ['$scope', 'ApiService', 'DEFAULT_USER_ID', function($scope, ApiService, DEFAULT_USER_ID) {
    $scope.dashboardData = null;
    $scope.insights = [];
    $scope.loading = true;
    
    // Load dashboard data
    $scope.loadDashboard = function() {
        $scope.loading = true;
        
        ApiService.getDashboardData(DEFAULT_USER_ID)
            .then(function(response) {
                $scope.dashboardData = response.data;
                $scope.loading = false;
            })
            .catch(function(error) {
                console.error('Error loading dashboard:', error);
                $scope.loading = false;
                alert('Error loading dashboard data');
            });
        
        // Load insights
        ApiService.getInsights(DEFAULT_USER_ID)
            .then(function(response) {
                $scope.insights = response.data.insights;
            })
            .catch(function(error) {
                console.error('Error loading insights:', error);
            });
    };
    
    // Get insight icon based on type
    $scope.getInsightIcon = function(type) {
        switch(type) {
            case 'success': return 'bi-check-circle-fill text-success';
            case 'warning': return 'bi-exclamation-triangle-fill text-warning';
            case 'alert': return 'bi-exclamation-circle-fill text-danger';
            case 'info': return 'bi-info-circle-fill text-info';
            case 'tip': return 'bi-lightbulb-fill text-primary';
            default: return 'bi-info-circle-fill';
        }
    };
    
    // Initialize
    $scope.loadDashboard();
}]);