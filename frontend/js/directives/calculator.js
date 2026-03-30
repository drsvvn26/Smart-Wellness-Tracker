// Calculator Directive
wellnessApp.directive('calculator', function() {
    return {
        restrict: 'E',
        scope: {},
        template: `
            <div class="card">
                <div class="card-header">
                    <i class="bi bi-calculator"></i> Simple Calculator
                </div>
                <div class="card-body">
                    <div class="row mb-3">
                        <div class="col-md-5">
                            <input type="number" class="form-control" ng-model="num1" placeholder="Number 1">
                        </div>
                        <div class="col-md-2 text-center">
                            <select class="form-select" ng-model="operation">
                                <option value="add">+</option>
                                <option value="subtract">-</option>
                                <option value="multiply">×</option>
                                <option value="divide">÷</option>
                            </select>
                        </div>
                        <div class="col-md-5">
                            <input type="number" class="form-control" ng-model="num2" placeholder="Number 2">
                        </div>
                    </div>
                    <button class="btn btn-primary w-100 mb-3" ng-click="calculate()">
                        Calculate
                    </button>
                    <div class="alert alert-success" ng-show="result !== null">
                        <h4 class="mb-0">Result: {{result}}</h4>
                    </div>
                </div>
            </div>
        `,
        controller: function($scope) {
            $scope.num1 = 0;
            $scope.num2 = 0;
            $scope.operation = 'add';
            $scope.result = null;
            
            $scope.calculate = function() {
                var a = parseFloat($scope.num1) || 0;
                var b = parseFloat($scope.num2) || 0;
                
                switch($scope.operation) {
                    case 'add':
                        $scope.result = a + b;
                        break;
                    case 'subtract':
                        $scope.result = a - b;
                        break;
                    case 'multiply':
                        $scope.result = a * b;
                        break;
                    case 'divide':
                        $scope.result = b !== 0 ? (a / b).toFixed(2) : 'Error: Division by zero';
                        break;
                    default:
                        $scope.result = 0;
                }
            };
        }
    };
});
