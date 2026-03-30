// Profile Controller
wellnessApp.controller('ProfileController', ['$scope', 'ApiService', 'DEFAULT_USER_ID', function($scope, ApiService, DEFAULT_USER_ID) {
    $scope.user = null;
    $scope.loading = false;
    $scope.editMode = false;
    $scope.uploadProgress = 0;
    
    // User form
    $scope.userForm = {
        name: '',
        email: '',
        mobile: '',
        theme: 'light'
    };
    
    // Validation errors
    $scope.errors = {
        mobile: '',
        email: ''
    };
    
    // Load user profile
    $scope.loadProfile = function() {
        $scope.loading = true;
        
        ApiService.getUsers()
            .then(function(response) {
                if (response.data && response.data.length > 0) {
                    $scope.user = response.data[0];
                    $scope.userForm = angular.copy($scope.user);
                } else {
                    // Create default user
                    $scope.createDefaultUser();
                }
                $scope.loading = false;
            })
            .catch(function(error) {
                console.error('Error loading profile:', error);
                $scope.loading = false;
            });
    };
    
    // Create default user
    $scope.createDefaultUser = function() {
        var userData = {
            name: 'Wellness User',
            email: 'user@wellness.com',
            mobile: '9876543210',
            theme: 'light'
        };
        
        ApiService.createUser(userData)
            .then(function(response) {
                $scope.user = response.data;
                $scope.userForm = angular.copy($scope.user);
            })
            .catch(function(error) {
                console.error('Error creating user:', error);
            });
    };
    
    // Enable edit mode
    $scope.enableEdit = function() {
        $scope.editMode = true;
    };
    
    // Save profile
    $scope.saveProfile = function() {
        // Validate mobile
        if (!$scope.validateMobile($scope.userForm.mobile)) {
            $scope.errors.mobile = 'Mobile number must be 10 digits';
            return;
        } else {
            $scope.errors.mobile = '';
        }
        
        // Validate email
        if (!$scope.validateEmail($scope.userForm.email)) {
            $scope.errors.email = 'Invalid email format';
            return;
        } else {
            $scope.errors.email = '';
        }
        
        $scope.loading = true;
        
        ApiService.updateUser($scope.user.userId, $scope.userForm)
            .then(function(response) {
                $scope.user = response.data;
                $scope.editMode = false;
                $scope.loading = false;
                alert('Profile updated successfully!');
            })
            .catch(function(error) {
                console.error('Error updating profile:', error);
                $scope.loading = false;
                alert('Error updating profile');
            });
    };
    
    // Cancel edit
    $scope.cancelEdit = function() {
        $scope.userForm = angular.copy($scope.user);
        $scope.editMode = false;
        $scope.errors = { mobile: '', email: '' };
    };
    
    // Upload profile image
    $scope.uploadImage = function(files) {
        if (files && files.length > 0) {
            var file = files[0];
            
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB');
                return;
            }
            
            // Validate file type
            if (!file.type.match('image.*')) {
                alert('Only image files are allowed');
                return;
            }
            
            var formData = new FormData();
            formData.append('profileImage', file);
            
            $scope.loading = true;
            
            ApiService.uploadProfileImage($scope.user.userId, formData)
                .then(function(response) {
                    $scope.user = response.data.user;
                    $scope.loading = false;
                    alert('Profile image uploaded successfully!');
                })
                .catch(function(error) {
                    console.error('Error uploading image:', error);
                    $scope.loading = false;
                    alert('Error uploading image');
                });
        }
    };
    
    // Validate mobile number
    $scope.validateMobile = function(mobile) {
        return /^\d{10}$/.test(mobile);
    };
    
    // Validate email
    $scope.validateEmail = function(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };
    
    // Get mobile input class
    $scope.getMobileClass = function() {
        if (!$scope.userForm.mobile) return '';
        return $scope.validateMobile($scope.userForm.mobile) ? 'is-valid' : 'is-invalid';
    };
    
    // Initialize
    $scope.loadProfile();
}]);