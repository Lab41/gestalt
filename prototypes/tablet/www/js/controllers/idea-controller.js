angular.module("idea-controller", [])

.controller("ideaCtrl", ["$scope", "contentService", "$stateParams", function($scope, contentService, $stateParams) {
    
    var dataset = $stateParams.table;
    
	// data objects
	$scope.content;
    
    // get CONTENT data stored in service
	contentService.getData("visualization/" + dataset).then(function(data) {
		
		// set scope
		$scope.content = data;
		
	});
    
}]);