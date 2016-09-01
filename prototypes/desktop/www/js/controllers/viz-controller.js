// wrap in Immediately Invoked Function Expression to avoid global scope 
(function() {
    'use strict';

    // set viz-controller application and register its controller
    angular
        .module("viz-controller", [])
        .controller("vizController", vizController);

    // add additional services to be used within the controller
    vizController.$inject = ["$scope", "$state", "contentService"];

    // define the controller
    function vizController($scope, $state, contentService) {
		
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
    
    }

})();