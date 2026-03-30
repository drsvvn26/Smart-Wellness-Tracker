// Analytics Controller
wellnessApp.controller('AnalyticsController', ['$scope', '$timeout', 'ApiService', 'DEFAULT_USER_ID', function($scope, $timeout, ApiService, DEFAULT_USER_ID) {
    $scope.dashboardData = null;
    $scope.loading = true;
    $scope.charts = {};
    
    // Load analytics data
    $scope.loadAnalytics = function() {
        $scope.loading = true;
        
        ApiService.getDashboardData(DEFAULT_USER_ID)
            .then(function(response) {
                $scope.dashboardData = response.data;
                $scope.loading = false;
                
                // Wait for DOM to render, then create charts
                $timeout(function() {
                    $scope.createCharts();
                }, 100);
            })
            .catch(function(error) {
                console.error('Error loading analytics:', error);
                $scope.loading = false;
                alert('Error loading analytics data');
            });
    };
    
    // Create all charts
    $scope.createCharts = function() {
        if (!$scope.dashboardData || !$scope.dashboardData.charts) {
            return;
        }
        
        var charts = $scope.dashboardData.charts;
        
        // Weekly Completion Bar Chart
        var weeklyCtx = document.getElementById('weeklyChart');
        if (weeklyCtx) {
            $scope.charts.weekly = new Chart(weeklyCtx, {
                type: 'bar',
                data: {
                    labels: charts.weeklyCompletion.map(d => d.day),
                    datasets: [{
                        label: 'Habits Completed',
                        data: charts.weeklyCompletion.map(d => d.completions),
                        backgroundColor: 'rgba(102, 126, 234, 0.8)',
                        borderColor: 'rgba(102, 126, 234, 1)',
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top'
                        },
                        title: {
                            display: true,
                            text: 'Weekly Habit Completion'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    }
                }
            });
        }
        
        // Monthly Progress Line Chart
        var monthlyCtx = document.getElementById('monthlyChart');
        if (monthlyCtx) {
            $scope.charts.monthly = new Chart(monthlyCtx, {
                type: 'line',
                data: {
                    labels: charts.monthlyProgress.map(d => 'Day ' + d.date),
                    datasets: [{
                        label: 'Daily Completions',
                        data: charts.monthlyProgress.map(d => d.completions),
                        borderColor: 'rgba(118, 75, 162, 1)',
                        backgroundColor: 'rgba(118, 75, 162, 0.2)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top'
                        },
                        title: {
                            display: true,
                            text: 'Monthly Progress (Last 30 Days)'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    }
                }
            });
        }
        
        // Completion Rate Pie Chart
        var pieCtx = document.getElementById('completionPieChart');
        if (pieCtx) {
            $scope.charts.pie = new Chart(pieCtx, {
                type: 'pie',
                data: {
                    labels: ['Completed', 'Missed'],
                    datasets: [{
                        data: [
                            charts.completionRate.completed,
                            charts.completionRate.missed
                        ],
                        backgroundColor: [
                            'rgba(25, 135, 84, 0.8)',
                            'rgba(220, 53, 69, 0.8)'
                        ],
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'bottom'
                        },
                        title: {
                            display: true,
                            text: 'Completion Rate'
                        }
                    }
                }
            });
        }
        
        // Habit-wise Completion Doughnut Chart
        var doughnutCtx = document.getElementById('habitWiseChart');
        if (doughnutCtx && charts.habitWiseCompletion.length > 0) {
            $scope.charts.doughnut = new Chart(doughnutCtx, {
                type: 'doughnut',
                data: {
                    labels: charts.habitWiseCompletion.map(h => h.name),
                    datasets: [{
                        label: 'Completions',
                        data: charts.habitWiseCompletion.map(h => h.completions),
                        backgroundColor: [
                            'rgba(102, 126, 234, 0.8)',
                            'rgba(118, 75, 162, 0.8)',
                            'rgba(79, 172, 254, 0.8)',
                            'rgba(0, 242, 254, 0.8)',
                            'rgba(253, 93, 108, 0.8)'
                        ],
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'bottom'
                        },
                        title: {
                            display: true,
                            text: 'Top 5 Habits by Completion'
                        }
                    }
                }
            });
        }
    };
    
    // Destroy charts on scope destroy
    $scope.$on('$destroy', function() {
        Object.keys($scope.charts).forEach(function(key) {
            if ($scope.charts[key]) {
                $scope.charts[key].destroy();
            }
        });
    });
    
    // Initialize
    $scope.loadAnalytics();
}]);