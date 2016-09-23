angular.module("vis-key-directive", [])

.directive("visKey", ["$rootScope", "$state", function ($rootScope, $state) {
    return {
        restrict: "E",
        templateUrl: "templates/directives/vis-key.html",
        scope: {
            controls: "="
        },
        controller: function($scope) {

        }
    };

}]);
