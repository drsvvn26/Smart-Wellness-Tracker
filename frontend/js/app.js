// Initialize AngularJS App
var wellnessApp = angular.module('wellnessApp', ['ngRoute']);

// API Base URL
wellnessApp.constant('API_BASE_URL', 'http://localhost:8001/api');

// Default User ID (since we're in single-user mode)
wellnessApp.constant('DEFAULT_USER_ID', '3183d686-d3c3-43bc-84dc-494544ef54a2');
