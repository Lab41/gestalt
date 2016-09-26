angular.module("vis-title-directive", [])

.directive("visTitle", ["$rootScope", "highlightService", "$state", function ($rootScope, highlightService, $state) {
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
            $scope.highlight = highlightService.getHighlightMode;
            $scope.toggleHighlight = highlightService.toggleHighlightMode;

        }
    };

}]);
