angular.module("vis-title-directive", [])

.directive("visTitle", ["$rootScope", "$state", function ($rootScope, $state) {
    return {
        restrict: "E",
        templateUrl: "templates/directives/vis-title.html",
        scope: {
            controls: "="
        },
        controller: function($scope) {

        }
    };

}]);
