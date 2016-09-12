angular.module("viz-controller", [])

.controller("vizCtrl", ["$scope", "contentService", "$state", "$rootScope", function($scope, contentService, $state, $rootScope) {
	        
	// data objects
	$scope.nodes;
	$scope.nodeGroups;
	$scope.dynamicDirectives;
    
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
	
	$scope.dummyData = [{"name": "blah", "value": 5}, {"name": "de", "value": 2}, {"name": "da", "value": 1}];
	
	// dynamic directives
    contentService.getData("visualization/angular/directives/1/").then(function(data) {
		
		// set scope
		$scope.dynamicDirectives = data;
		
	});
    
}]);