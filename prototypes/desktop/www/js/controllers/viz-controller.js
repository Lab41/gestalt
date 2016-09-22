angular.module("viz-controller", [])

.controller("vizCtrl", ["$scope", "contentService", "$state", "$rootScope", function($scope, contentService, $state, $rootScope) {
    	        
	// data objects
	$scope.nodes;
	$scope.nodeGroups;
	$scope.heuristics;
	$scope.tileGridData;
    
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
	contentService.getData("visualization/geography/geojson/hexagon/").then(function(data) {
		
		// set scope
		$scope.tileGridData = data;
		
	});
	
	// check for heuristic url param
	if ($state.params.heuristic) {
	
		// get current set of heuristics
		contentService.getData("visualization/heuristics/" + $state.params.heuristic + "/").then(function(data) {

			// set scope
			$scope.heuristics = data;
			$scope.currentHeuristic = data[0].vis_type_name;

		});
		
	};
																																  
}]);