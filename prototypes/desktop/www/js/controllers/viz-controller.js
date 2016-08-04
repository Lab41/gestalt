angular.module("viz-controller", [])

.controller("vizCtrl", ["$scope", "contentService", "$state", function($scope, contentService, $state) {
	
	var grid = $state.params.grid;
        
	// data objects
	$scope.nodes;
	$scope.nodeGroups;
	$scope.geojson;
    
    // country nodes
	contentService.getData("visualization/cdis/").then(function(data) {
		
		// set scope
		$scope.nodes = data;
		
	});
	
	// node groups
	contentService.getData("visualization/countries/groups/").then(function(data) {
		
		// set scope
		$scope.nodeGroups = data;
		
	});
    
    // geojson
    contentService.getData("visualization/geojson/" + grid + "/").then(function(data) {
		
		// set scope
		$scope.geojson = data[0];
		
	});
    
}]);