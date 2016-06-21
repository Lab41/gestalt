angular.module("story-controller", [])

.controller("storyCtrl", ["$scope", "$stateParams", "$state", "contentService", function($scope, $stateParams, $state, contentService) {
		
	var workspace = $stateParams.workspace;
	var story = $stateParams.id;
	
	// data objects
	$scope.content;
	$scope.story = story;
    
    // get CONTENT data stored in service
	/*contentService.getData(story).then(function(data) {
		
		// set scope
		$scope.content = data;
		
	});*/
    
}]);