angular.module("viz-controller", [])

.controller("vizCtrl", ["$scope", "contentService", "$state", "$rootScope", function($scope, contentService, $state, $rootScope) {
    	        
	// data objects
	$scope.nodeGroups;
	$scope.heuristics;
	$scope.tileGridData;
	$scope.boundaryData;
	
	// node groups
	contentService.getData("visualization/countries/groups/").then(function(data) {
		
		// set scope
		$scope.nodeGroups = data;
		
	});
	
	// geojson
	contentService.getData("visualization/geography/geojson/hexagon/").then(function(data) {
		
		// set scope
		$scope.tileGridData = data;
		
	});


	// geojson
	contentService.getData("visualization/geography/geojson/boundary/").then(function(data) {
		
		// set scope
		$scope.boundaryData = data;
		
	});
    
}]);