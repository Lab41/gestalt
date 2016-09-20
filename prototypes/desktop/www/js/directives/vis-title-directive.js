angular.module("vis-title-directive", [])

.directive("visTitle", ["$rootScope", "$state", function ($rootScope, $state) {
    return {
        restrict: "E",
        templateUrl: "templates/directives/vis-title.html",
        scope: {
            controls: "="
        },
        controller: function($scope) {

            //filter title uses Notioanl Map of the World as the default
            $scope.filterTitle = "Notional Map of the World";
            $scope.colorTitle = "";

        }
    };

}]);
