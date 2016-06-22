angular.module("panel-controller", [])

.controller("panelCtrl", ["$scope", "$stateParams", "$state", "contentService", "layoutService", function($scope, $stateParams, $state, contentService, layoutService) {
    
    var workspace = $stateParams.workspace;
    var panel = $stateParams.panel;
	
	// data objects
	$scope.content;
	$scope.panel;
	$scope.workspace = workspace;
	$scope.moreDataExists = true; // for infinite scroll
    $scope.busyLoadingData = false; // prevent loading more while async is loading more
	
	// get CONTENT data stored in service
	/*contentService.getData(panel).then(function(data) {
		
		// set scope
		$scope.content = data.length > 0 ? data : [{ title: "Nothing Found.", content: "Sorry but can't find any content.", poster: "None" }];
		
	});
	
	// get LAYOUT data stored in service	
	layoutService.getPanel(panel).then(function(data) {
		
		// set scope
		$scope.panel = data;
		
	});*/
	
}]);