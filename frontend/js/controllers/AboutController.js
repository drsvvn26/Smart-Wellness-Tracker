// About Controller
wellnessApp.controller('AboutController', ['$scope', function($scope) {
    $scope.appInfo = {
        name: 'Smart Wellness Tracker',
        version: '1.0.0',
        description: 'A comprehensive wellness tracking application',
        features: [
            'Habit Tracking with streak management',
            'Smart Health Checker with symptom analysis',
            'Analytics Dashboard with multiple charts',
            'Calendar Planner with event management',
            'Reminder System with notifications',
            'Profile Management with image upload',
            'Dark/Light Theme Support',
            'Real-time data updates'
        ],
        technologies: [
            { name: 'AngularJS', version: '1.8.2', icon: 'bi-code-square' },
            { name: 'Node.js', version: '20.x', icon: 'bi-server' },
            { name: 'Express', version: '4.x', icon: 'bi-arrow-left-right' },
            { name: 'MongoDB', version: '6.x', icon: 'bi-database' },
            { name: 'Bootstrap', version: '5.3', icon: 'bi-bootstrap' },
            { name: 'Chart.js', version: '4.4', icon: 'bi-graph-up' }
        ],
        developers: [
            { name: 'Development Team', role: 'Full Stack Development' }
        ],
        contact: {
            email: 'support@smartwellness.com',
            website: 'https://smartwellness.com'
        }
    };
    
    // Load sample XML data via AJAX
    $scope.loadXMLData = function() {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'data/students.xml', true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var xmlDoc = xhr.responseXML;
                var students = xmlDoc.getElementsByTagName('student');
                $scope.xmlStudents = [];
                
                for (var i = 0; i < students.length; i++) {
                    var student = {
                        id: students[i].getElementsByTagName('id')[0].textContent,
                        name: students[i].getElementsByTagName('name')[0].textContent,
                        course: students[i].getElementsByTagName('course')[0].textContent,
                        grade: students[i].getElementsByTagName('grade')[0].textContent
                    };
                    $scope.xmlStudents.push(student);
                }
                $scope.$apply();
            }
        };
        xhr.send();
    };
    
    // Load sample JSON data via AJAX
    $scope.loadJSONData = function() {
        fetch('data/courses.json')
            .then(response => response.json())
            .then(data => {
                $scope.jsonCourses = data.courses;
                $scope.$apply();
            })
            .catch(error => {
                console.error('Error loading JSON:', error);
            });
    };
    
    // Initialize
    $scope.xmlStudents = [];
    $scope.jsonCourses = [];
    $scope.loadXMLData();
    $scope.loadJSONData();
}]);