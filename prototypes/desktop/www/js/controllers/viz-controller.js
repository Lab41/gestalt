angular.module("viz-controller", [])

.controller("vizCtrl", ["$scope", "contentService", "$state", "$rootScope", function($scope, contentService, $state, $rootScope) {
    	        
	// data objects
	$scope.nodes;
	$scope.nodeGroups;
	$scope.heuristics;
    
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
	
	// watch for story idea changes
	$rootScope.$on("heuristicChange", function(event, args) {
		
		// set scope
		$scope.heuristics = args.val;
		$scope.currentHeuristic = args.val[0].vis_type_name;
		
	});
																																  
}]);