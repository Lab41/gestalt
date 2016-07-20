angular.module("viz-controller", [])

.controller("vizCtrl", ["$scope", "contentService", "$state", function($scope, contentService, $state) {
	
	var grid = $state.params.grid;
        
	// data objects
	$scope.content;
    
    // get CONTENT data stored in service
	contentService.getData("visualization/cdis").then(function(data) {
		
		// set scope
		$scope.nodes = data;
		
	});
    
    // geojson
    contentService.getData("visualization/geojson/" + grid).then(function(data) {
		
		// set scope
		$scope.geojson = data[0];
		
	});
    
}]);