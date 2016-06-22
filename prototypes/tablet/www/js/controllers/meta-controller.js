angular.module("meta-controller", [])

.controller("metaCtrl", ["$scope", function($scope) {
	    
    // data objects
	$scope.theme = {
		current: "light",
		opposite: "dark"
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
						
	};
	
}]);