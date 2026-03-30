// Prime Number Filter
wellnessApp.filter('isPrime', function() {
    return function(num) {
        var n = parseInt(num);
        
        if (isNaN(n) || n < 2) {
            return 'Not Prime';
        }
        
        // Check if number is prime
        for (var i = 2; i <= Math.sqrt(n); i++) {
            if (n % i === 0) {
                return 'Not Prime';
            }
        }
        
        return 'Prime';
    };
});

// Capitalize First Letter Filter
wellnessApp.filter('capitalize', function() {
    return function(input) {
        if (!input) return '';
        return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
    };
});

// Format Date Filter
wellnessApp.filter('formatDate', function() {
    return function(dateString) {
        if (!dateString) return '';
        var date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
});
