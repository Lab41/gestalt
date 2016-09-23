angular.module("story-controls-directive", [])

.directive("storyControls", ["contentService", "$rootScope", "$state", function (contentService, $rootScope, $state) {
    return {
        restrict: "E",
        templateUrl: "templates/directives/story-controls.html",
        scope: {
            controls: "=",
            visTypeName: "="
        },
        controller: function($scope, $filter) {

            // story idea functionality
            $scope.changeOption = function(ideaName, ideaId, controlId) {

                // TODO abstract so functionality is data driven not hardcoded here

                // check control id
                //if (controlId < 12) {

                    // get current idea corresponding impact metric
                    contentService.getData("story/idea/" + ideaId + "/metric/" + controlId + "/").then(function(data) {

                        // set option scope
                        $scope[ideaName] = $filter('capitalize')(data[0].control_name);

                        // broadcast so other visualizations can update
                        $rootScope.$broadcast("mapStoryIdeaChange", { val: data[0] });

                        // transition state url
                        $state.go("app.panel.visual", {
                            si: ideaId,
                            sc: controlId
                        },{
                            notify: false,
                            reload: false
                        });

                    });

                /*} else {

                    // get current set of heuristics
                    contentService.getData("visualization/heuristics/" + $scope.visTypeName + "/").then(function(data) {

                        // transition state url
                        $state.go("app.heuristic", {

                            panel: $state.params.panel,
                            visual: $state.params.visual,
                            heuristic: data[0].vis_type_urlname

                        });

                    });

                }*/

            };

        },
        link: function(scope, element, attrs) {

            scope.$watch("controls", function(newData, oldData) {

                // async check
                if (newData !== undefined) {

                    var data = newData;

                    // set initial values
                    angular.forEach(data, function(value, key) {

                        // add scope value
                        scope[value.label] = "Not Set";
                        scope[value.label + "Open"] = false;

                    });

                };

            });

        }
    };

}]);
