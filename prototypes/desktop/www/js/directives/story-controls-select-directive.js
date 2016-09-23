angular.module("story-controls-select-directive", [])

.directive("storyControlsSelect", ["contentService", "$rootScope", "$state", function(contentService, $rootScope, $state) {
	return {
		restrict: "E",
        //template: "<select ng-model='selectedIdea' ng-options='control as control.name for control in idea.controls' ng-change='changeSelectedIdea()'</select>",
		templateUrl: "templates/directives/story-controls.html",
		scope: {
            idea: "="
        },
        controller: function($scope) {
        	$scope.idea.controls.sort(function(a,b) {
        		return a.id - b.id;
        	});
        	$scope.selectedIdea = $scope.idea.controls[0];
            
            // story idea functionality
            $scope.changeSelectedIdea = function() {
            		var ideaId = $scope.idea.id;
            		var controlId = $scope.selectedIdea.id;
            
					// get current idea corresponding impact metric
					contentService.getData("story/idea/" + ideaId + "/metric/" + controlId + "/").then(function(data) {

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
                
            };
            
        }
	};
    
}]);
