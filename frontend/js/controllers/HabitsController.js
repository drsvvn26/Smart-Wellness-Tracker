// Habits Controller
wellnessApp.controller('HabitsController', ['$scope', '$rootScope', 'ApiService', 'DEFAULT_USER_ID', function($scope, $rootScope, ApiService, DEFAULT_USER_ID) {
    $scope.habits = [];
    $scope.loading = false;
    $scope.showForm = false;
    $scope.editMode = false;
    
    // Habit form data
    $scope.habitForm = {
        userId: DEFAULT_USER_ID,
        habitName: '',
        description: '',
        frequency: 'daily'
    };
    
    // Load all habits
    $scope.loadHabits = function() {
        $scope.loading = true;
        ApiService.getHabits(DEFAULT_USER_ID)
            .then(function(response) {
                $scope.habits = response.data;
                $scope.loading = false;
                // Check streaks for each habit
                $scope.habits.forEach(function(habit) {
                    $scope.checkHabitStreak(habit);
                });
            })
            .catch(function(error) {
                console.error('Error loading habits:', error);
                $scope.loading = false;
            });
    };
    
    // Show add habit form
    $scope.showAddForm = function() {
        $scope.showForm = true;
        $scope.editMode = false;
        $scope.habitForm = {
            userId: DEFAULT_USER_ID,
            habitName: '',
            description: '',
            frequency: 'daily'
        };
    };
    
    // Edit habit
    $scope.editHabit = function(habit) {
        $scope.showForm = true;
        $scope.editMode = true;
        $scope.habitForm = angular.copy(habit);
    };
    
    // Save habit
    $scope.saveHabit = function() {
        if (!$scope.habitForm.habitName) {
            alert('Please enter habit name');
            return;
        }
        
        $scope.loading = true;
        
        if ($scope.editMode) {
            // Update existing habit
            ApiService.updateHabit($scope.habitForm.habitId, $scope.habitForm)
                .then(function(response) {
                    $scope.loadHabits();
                    $scope.showForm = false;
                    alert('Habit updated successfully!');
                })
                .catch(function(error) {
                    console.error('Error updating habit:', error);
                    $scope.loading = false;
                    alert('Error updating habit');
                });
        } else {
            // Create new habit
            ApiService.createHabit($scope.habitForm)
                .then(function(response) {
                    $scope.loadHabits();
                    $scope.showForm = false;
                    alert('Habit added successfully!');
                })
                .catch(function(error) {
                    console.error('Error creating habit:', error);
                    $scope.loading = false;
                    alert('Error creating habit');
                });
        }
    };
    
    // Mark habit as complete
    $scope.completeHabit = function(habit) {
        ApiService.completeHabit(habit.habitId)
            .then(function(response) {
                if (response.data.streakBroken) {
                    $rootScope.$broadcast('streakBroken', {
                        message: 'Your streak for "' + habit.habitName + '" was broken. Starting fresh!'
                    });
                }
                $scope.loadHabits();
                alert('Great job! Habit marked as complete. Streak: ' + response.data.habit.streak);
            })
            .catch(function(error) {
                console.error('Error completing habit:', error);
                if (error.data && error.data.error) {
                    alert(error.data.error);
                } else {
                    alert('Error completing habit');
                }
            });
    };
    
    // Check habit streak
    $scope.checkHabitStreak = function(habit) {
        ApiService.checkStreak(habit.habitId)
            .then(function(response) {
                if (response.data.streakBroken && habit.streak > 0) {
                    // Update the habit in the list
                    var index = $scope.habits.findIndex(h => h.habitId === habit.habitId);
                    if (index !== -1) {
                        $scope.habits[index] = response.data.habit;
                    }
                }
            })
            .catch(function(error) {
                console.error('Error checking streak:', error);
            });
    };
    
    // Delete habit
    $scope.deleteHabit = function(habit) {
        if (confirm('Are you sure you want to delete this habit?')) {
            ApiService.deleteHabit(habit.habitId)
                .then(function(response) {
                    $scope.loadHabits();
                    alert('Habit deleted successfully');
                })
                .catch(function(error) {
                    console.error('Error deleting habit:', error);
                    alert('Error deleting habit');
                });
        }
    };
    
    // Cancel form
    $scope.cancelForm = function() {
        $scope.showForm = false;
    };
    
    // Check if habit is completed today
    $scope.isCompletedToday = function(habit) {
        if (!habit.completionHistory || habit.completionHistory.length === 0) {
            return false;
        }
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        return habit.completionHistory.some(function(entry) {
            var entryDate = new Date(entry.date);
            entryDate.setHours(0, 0, 0, 0);
            return entryDate.getTime() === today.getTime() && entry.completed;
        });
    };
    
    // Initialize
    $scope.loadHabits();
}]);