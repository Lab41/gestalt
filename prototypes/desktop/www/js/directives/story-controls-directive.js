angular.module("story-controls-directive", [])

.directive("storyControls", ["contentService", "highlightService", "$rootScope", "$state", "$http", function (contentService, highlightService, $rootScope, $state, $http) {
    return {
        restrict: "E",
        scope: {
            controls: "=",
            controlType: "=",
            visTypeName: "="
        },
        template: "<ng-include src='getTemplateUrl();'/>",
        controller: function($scope, $filter) {

            $scope.highlight = highlightService.getHighlightMode;
            $scope.toggleHighlighting = highlightService.toggleHighlightMode;

            // story idea functionality
            $scope.changeOption = function(ideaName, ideaId, controlId) {

                // TODO abstract so functionality is data driven not hardcoded here

                // check control id
                if ($scope.visTypeName == undefined) {

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

                } else {

                    // get current set of heuristics
                    contentService.getData("visualization/heuristics/" + $scope.visTypeName + "/").then(function(data) {

                        // transition state url
                        $state.go("app.heuristic", {

                            panel: $state.params.panel,
                            visual: $state.params.visual,
                            heuristic: data[0].vis_type_urlname

                        });

                    });

                }

            };

        },
        link: function(scope, element, attrs) {
            
            var controlType = attrs.controlType == "button" ? "button" : "drop-down";
                                
            // data objects
            scope.getTemplateUrl = function() {
                return "templates/directives/story-controls-" + controlType + ".html";
            };

            // watch change in controls
            scope.$watch("controls", function(newData, oldData) {

                // async check
                if (newData !== undefined && newData[0] !== null) {
                    
                    var controlType = attrs.controlType;
                    
                    // check type
                    if (controlType == "drop-down") {

                        var data = newData;

                        // set initial values
                        angular.forEach(data, function(value, key) {

                            // add scope value
                            scope[value.label] = "Not Set";
                            scope[value.label + "Open"] = false;

                        });
                        
                    };

                };

            });

        }
    };

}]);
