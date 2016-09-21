angular.module("detail-overlay-directive", [])

.directive("detailOverlay", ["$rootScope", "$state", function ($rootScope, $state) {
    return {
        restrict: "E",
        templateUrl: "templates/directives/detail-overlay.html",
        scope: {
            controls: "="
        },
        controller: function($scope) {

        }
    };

}]);
