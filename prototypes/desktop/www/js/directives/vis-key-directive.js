angular.module("vis-key-directive", [])

.directive("visKey", ["$rootScope", "$state", function ($rootScope, $state) {
    return {
        restrict: "E",
        templateUrl: "templates/directives/vis-key.html",
        scope: {
            controls: "="
        },
        controller: function($scope) {

            $rootScope.$on("legendDataChange", function(event, args) {
            	console.log(args);
            	$scope.isActive = true;
            	$scope.showkey = false;
            	$scope.legendData = args.val;
            });

            $rootScope.$on("legendDataClear", function(event, args) {
            	$scope.isActive = false;
            });

            $scope.setColor = function(bgColor) {
            	return {
            		"background-color": bgColor
            	}
            };
        }
    };

}]);
