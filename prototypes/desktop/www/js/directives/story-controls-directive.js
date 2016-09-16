angular.module("story-controls-directive", [])

.directive("storyControls", ["contentService", "$rootScope", "$state", function(contentService, $rootScope, $state) {
	return {
		restrict: "E",
        template: "<div><button ng-repeat='control in controls' type='button' ng-click='changeIdea(control.story_action_id, control.id)'>{{ control.name }}</button></div>",
		scope: {
            controls: "=",
			visTypeName: "="
        },
        controller: function($scope) {
            
            // story idea functionality
            $scope.changeIdea = function(ideaId, controlId) {
				
				// TODO abstract so functionality is data driven not hardcoded here
				
				// check control id
				if (controlId < 12) {
            
					// get current idea corresponding impact metric
					contentService.getData("story/idea/" + ideaId + "/metric/" + controlId + "/").then(function(data) {

						// broadcast so other visualizations can update
						$rootScope.$broadcast("storyIdeaChange", { val: data[0] });

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
							heuristic: data[0].vis_type_name
							
						}).then(function() {
							
							// broadcast so other visualizations can update
							$rootScope.$broadcast("heuristicChange", { val: data });
							
						});

					});
					
				}
                
            };
            
        }
	};
    
}]);