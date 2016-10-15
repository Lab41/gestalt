angular.module("viz-controller", [])

.controller("vizCtrl", ["$scope", "contentService", "$state", "$rootScope", "screenshotService", function($scope, contentService, $state, $rootScope, screenshotService) {
    	        
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


    // classification json
	contentService.getData("tiny_time.json").then(function(data) {
		
		// set scope
		$scope.poseidonData = data;
		
	});
    
    //node link json 
	contentService.getData("nodes_file.json").then(function(data) {
		
		// set scope
		$scope.poseidonNodeData = data;
		
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