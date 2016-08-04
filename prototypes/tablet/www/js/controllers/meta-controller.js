angular.module("meta-controller", [])

.controller("metaCtrl", ["$scope", "$state", function($scope, $state) {
	    
    // data objects
	$scope.css = {
		gl: mapbox_config.cssGl,
		raster: mapbox_config.css
	};
	
	$scope.theme = {
		current: theme_config.ui.start,
		opposite: theme_config.ui.opposite
	};
	
	// change theme
	$scope.changeTheme = function(opposite) {
        
        var transition = "all 1s";
        
        // elements to transition
        var menu = document.getElementsByClassName("menu")[0];
        var html = document.getElementsByTagName("html")[0];
        var body = document.getElementsByTagName("body")[0];
        
        // set smooth transition
        menu.style.transition = transition;
        html.style.transition = transition;
        body.style.transition = transition;
		
		var current = opposite;
		var opposite = $scope.theme.current;
		
		$scope.theme = {
			current: current,
			opposite: opposite
		};
		
		// transition URL to reflect state change
		$state.go("app.panel", {
			t: current
		}, {
			reload: false,
			notify: false
		});
						
	};
	
}]);