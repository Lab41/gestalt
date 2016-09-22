angular.module("detail-overlay-directive", [])

    .directive("detailOverlay", ["$rootScope", "$state", function ($rootScope, $state) {
        return {
            restrict: "E",
            templateUrl: "templates/directives/detail-overlay.html",
            scope: {
                controls: "="
            },
            controller: function ($scope) {

                $scope.showDetail = false;

                $scope.closeDetail = function () {
                    $rootScope.$broadcast('toggle-detail-overlay');
                };

                $scope.$on('toggle-detail-overlay', function () {
                    if ($scope.showDetail === false) {
                        $scope.showDetail = true;
                    } else {
                        $scope.showDetail = false;
                    }
                });

            }
        };

    }]);
