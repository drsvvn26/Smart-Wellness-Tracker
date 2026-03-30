// Health Controller
wellnessApp.controller('HealthController', ['$scope', 'ApiService', 'DEFAULT_USER_ID', function($scope, ApiService, DEFAULT_USER_ID) {
    $scope.symptoms = [];
    $scope.availableSymptoms = [];
    $scope.selectedSymptoms = [];
    $scope.healthReports = [];
    $scope.currentReport = null;
    $scope.loading = false;
    $scope.showReports = false;
    
    // Custom symptom input
    $scope.customSymptom = '';
    
    // Load available symptoms
    $scope.loadSymptoms = function() {
        ApiService.getSymptomsList()
            .then(function(response) {
                $scope.availableSymptoms = response.data;
            })
            .catch(function(error) {
                console.error('Error loading symptoms:', error);
            });
    };
    
    // Add symptom
    $scope.addSymptom = function(symptom) {
        if (!$scope.selectedSymptoms.includes(symptom)) {
            $scope.selectedSymptoms.push(symptom);
        }
    };
    
    // Add custom symptom
    $scope.addCustomSymptom = function() {
        if ($scope.customSymptom && !$scope.selectedSymptoms.includes($scope.customSymptom.toLowerCase())) {
            $scope.selectedSymptoms.push($scope.customSymptom.toLowerCase());
            $scope.customSymptom = '';
        }
    };
    
    // Remove symptom
    $scope.removeSymptom = function(symptom) {
        var index = $scope.selectedSymptoms.indexOf(symptom);
        if (index > -1) {
            $scope.selectedSymptoms.splice(index, 1);
        }
    };
    
    // Analyze symptoms
    $scope.analyzeSymptoms = function() {
        if ($scope.selectedSymptoms.length === 0) {
            alert('Please select at least one symptom');
            return;
        }
        
        $scope.loading = true;
        
        var data = {
            symptoms: $scope.selectedSymptoms,
            userId: DEFAULT_USER_ID
        };
        
        ApiService.analyzeSymptoms(data)
            .then(function(response) {
                $scope.currentReport = response.data.report;
                $scope.loading = false;
                alert('Health analysis completed!');
                $scope.selectedSymptoms = [];
                $scope.loadHealthReports();
            })
            .catch(function(error) {
                console.error('Error analyzing symptoms:', error);
                $scope.loading = false;
                alert('Error analyzing symptoms');
            });
    };
    
    // Load health reports
    $scope.loadHealthReports = function() {
        $scope.showReports = true;
        ApiService.getHealthReports(DEFAULT_USER_ID)
            .then(function(response) {
                $scope.healthReports = response.data;
            })
            .catch(function(error) {
                console.error('Error loading health reports:', error);
            });
    };
    
    // View report details
    $scope.viewReport = function(report) {
        $scope.currentReport = report;
    };
    
    // Delete report
    $scope.deleteReport = function(report) {
        if (confirm('Are you sure you want to delete this report?')) {
            ApiService.deleteHealthReport(report.reportId)
                .then(function(response) {
                    $scope.loadHealthReports();
                    if ($scope.currentReport && $scope.currentReport.reportId === report.reportId) {
                        $scope.currentReport = null;
                    }
                    alert('Report deleted successfully');
                })
                .catch(function(error) {
                    console.error('Error deleting report:', error);
                    alert('Error deleting report');
                });
        }
    };
    
    // Get severity class
    $scope.getSeverityClass = function(severity) {
        return 'health-report severity-' + severity;
    };
    
    // Get severity badge class
    $scope.getSeverityBadgeClass = function(severity) {
        switch(severity) {
            case 'high': return 'bg-danger';
            case 'medium': return 'bg-warning';
            case 'low': return 'bg-success';
            default: return 'bg-secondary';
        }
    };
    
    // Initialize
    $scope.loadSymptoms();
}]);