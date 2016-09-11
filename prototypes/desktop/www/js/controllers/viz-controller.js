angular.module("viz-controller", [])

.controller("vizCtrl", ["$scope", "contentService", "$state", "$rootScope", function($scope, contentService, $state, $rootScope) {
	
	var grid = $state.params.grid;
    var groupId = $state.params.group;
        
	// data objects
	$scope.nodes;
	$scope.nodeGroups;
	$scope.geojson;
    $scope.networkMetrics;
    
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
    
    // network metric
    contentService.getData("visualization/network/metrics/" + groupId + "/").then(function(data) {
		
		// set scope
		$scope.networkMetrics = data[0];
		
	});
	
	$scope.dummyData = [{"name": "blah", "value": 5}, {"name": "de", "value": 2}, {"name": "da", "value": 1}];
	
	// dynamic directives
    contentService.getData("visualization/angular/directives/1/").then(function(data) {
		
		// set scope
		$scope.dynamicDirectives = data;
		
	});
    
    // watch for story idea changes
    $rootScope.$on("storyIdeaChange", function(event, args) {
        
        // set scope
        $scope.networkMetrics = args.val;

    });
    
}]);