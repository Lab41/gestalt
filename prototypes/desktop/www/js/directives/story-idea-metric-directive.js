angular.module("story-idea-metric-directive", [])

.directive("storyIdeaMetric", ["contentService", "$rootScope", "$state", function(contentService, $rootScope, $state) {
	return {
		restrict: "E",
        templateUrl: "templates/stories/idea-metric.html",
        controller: function($scope) {
            
			var storyideaId = $state.params.si;
			var controlId = $state.params.sc;

			// data objects
			$scope.metrics;
			
			// check for story idea param in url
			if (storyideaId) {

				// story idea metric
				contentService.getData("story/idea/" + storyideaId + "/metric/" + controlId + "/").then(function(data) {

					// set scope
					$scope.metrics = data[0];

				});
				
			};

			// watch for story idea changes
			$rootScope.$on("storyIdeaChange", function(event, args) {

				// set scope
				$scope.metrics = args.val;

			});
            
        }
	};
    
}]);