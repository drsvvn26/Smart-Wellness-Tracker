// JS Features Controller
wellnessApp.controller('JSFeaturesController', ['$scope', '$interval', 'MathService', function($scope, $interval, MathService) {
    // Background Color Changer
    $scope.colorName = '';
    $scope.changeBackground = function() {
        if ($scope.colorName) {
            document.body.style.backgroundColor = $scope.colorName;
        }
    };
    
    $scope.resetBackground = function() {
        document.body.style.backgroundColor = '';
        $scope.colorName = '';
    };
    
    // Image Slider
    $scope.sliderImages = [
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
        'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800',
        'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
        'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
        'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800'
    ];
    $scope.currentSlide = 0;
    $scope.sliderRunning = false;
    $scope.sliderInterval = null;
    
    $scope.startSlider = function() {
        if (!$scope.sliderRunning) {
            $scope.sliderRunning = true;
            $scope.sliderInterval = $interval(function() {
                $scope.currentSlide = ($scope.currentSlide + 1) % $scope.sliderImages.length;
            }, 3000);
        }
    };
    
    $scope.stopSlider = function() {
        if ($scope.sliderRunning && $scope.sliderInterval) {
            $interval.cancel($scope.sliderInterval);
            $scope.sliderRunning = false;
        }
    };
    
    $scope.nextSlide = function() {
        $scope.currentSlide = ($scope.currentSlide + 1) % $scope.sliderImages.length;
    };
    
    $scope.prevSlide = function() {
        $scope.currentSlide = ($scope.currentSlide - 1 + $scope.sliderImages.length) % $scope.sliderImages.length;
    };
    
    // Car Object
    $scope.car = {
        model: 'Tesla Model S',
        color: 'Red',
        speed: 0,
        maxSpeed: 200,
        increaseSpeed: function(amount) {
            this.speed = Math.min(this.speed + amount, this.maxSpeed);
        },
        decreaseSpeed: function(amount) {
            this.speed = Math.max(this.speed - amount, 0);
        },
        displaySpeed: function() {
            return this.speed + ' km/h';
        }
    };
    
    $scope.increaseCarSpeed = function() {
        $scope.car.increaseSpeed(10);
    };
    
    $scope.decreaseCarSpeed = function() {
        $scope.car.decreaseSpeed(10);
    };
    
    $scope.resetCar = function() {
        $scope.car.speed = 0;
    };
    
    // Math Service Operations
    $scope.mathOp = {
        num1: 0,
        num2: 0,
        result: null,
        squareNum: 0,
        squareResult: null
    };
    
    $scope.addNumbers = function() {
        $scope.mathOp.result = MathService.add($scope.mathOp.num1, $scope.mathOp.num2);
    };
    
    $scope.subtractNumbers = function() {
        $scope.mathOp.result = MathService.subtract($scope.mathOp.num1, $scope.mathOp.num2);
    };
    
    $scope.calculateSquare = function() {
        $scope.mathOp.squareResult = MathService.square($scope.mathOp.squareNum);
    };
    
    // Prime Number Checker
    $scope.primeNum = '';
    $scope.primeResult = '';
    
    // Password Validation
    $scope.password = {
        value: '',
        confirm: '',
        valid: false,
        match: false
    };
    
    $scope.validatePassword = function() {
        var pwd = $scope.password.value;
        // Password must be 4-10 characters and start with a number
        $scope.password.valid = pwd.length >= 4 && pwd.length <= 10 && /^[0-9]/.test(pwd);
        $scope.password.match = pwd === $scope.password.confirm && pwd.length > 0;
    };
    
    $scope.getPasswordClass = function() {
        if (!$scope.password.value) return '';
        return $scope.password.valid ? 'is-valid' : 'is-invalid';
    };
    
    $scope.getConfirmPasswordClass = function() {
        if (!$scope.password.confirm) return '';
        return $scope.password.match ? 'is-valid' : 'is-invalid';
    };
    
    // Clean up on destroy
    $scope.$on('$destroy', function() {
        $scope.stopSlider();
        $scope.resetBackground();
    });
}]);