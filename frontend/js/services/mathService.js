// Math Service - Add, Subtract, Square operations
wellnessApp.service('MathService', function() {
    
    // Add two numbers
    this.add = function(a, b) {
        return parseFloat(a) + parseFloat(b);
    };
    
    // Subtract two numbers
    this.subtract = function(a, b) {
        return parseFloat(a) - parseFloat(b);
    };
    
    // Calculate square of a number
    this.square = function(n) {
        return parseFloat(n) * parseFloat(n);
    };
    
    // Calculate cube of a number
    this.cube = function(n) {
        return parseFloat(n) * parseFloat(n) * parseFloat(n);
    };
});
