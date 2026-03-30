// AngularJS Routing Configuration
wellnessApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/dashboard.html',
            controller: 'DashboardController'
        })
        .when('/habits', {
            templateUrl: 'views/habits.html',
            controller: 'HabitsController'
        })
        .when('/health', {
            templateUrl: 'views/health.html',
            controller: 'HealthController'
        })
        .when('/analytics', {
            templateUrl: 'views/analytics.html',
            controller: 'AnalyticsController'
        })
        .when('/calendar', {
            templateUrl: 'views/calendar.html',
            controller: 'CalendarController'
        })
        .when('/profile', {
            templateUrl: 'views/profile.html',
            controller: 'ProfileController'
        })
        .when('/about', {
            templateUrl: 'views/about.html',
            controller: 'AboutController'
        })
        .when('/js-features', {
            templateUrl: 'views/js-features.html',
            controller: 'JSFeaturesController'
        })
        .otherwise({
            redirectTo: '/'
        });
    
    // Use hashbang mode for routing
    $locationProvider.hashPrefix('!');
}]);
