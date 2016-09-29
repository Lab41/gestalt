angular.module("meta-controller", [])

.controller("metaCtrl", ["$scope", "$timeout", "$rootScope", "$state", function($scope, $timeout, $rootScope, $state) {
    
    // data objects
	$scope.theme = {
		current: theme_config.ui.start, // inital css so browser doesn't error
        opposite: theme_config.ui.opposite
	};
    
    // allow state to load then reflect theme in url param
    $timeout(function() {
        
        // data objects
        $scope.theme = {
            current: $state.params.t,
            opposite: $state.params.t == theme_config.ui.start ? theme_config.ui.opposite : theme_config.ui.start
        };
        
    },500);
    
	// change theme
	$scope.changeTheme = function(opposite) {
        
        var transition = "all 1s";
        
        // elements to transition
        var menu = document.getElementsByClassName("left")[0];
        var html = document.getElementsByTagName("html")[0];
        var body = document.getElementsByTagName("body")[0];
        
        var originalTransition = menu.style.transition;
        
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
        
        $timeout(function() {
            
            // reset transition on panel
            menu.style.transition = originalTransition;
            
        }, 1000);
        
        // update state params obj
        var params = $state.params;
        params["t"] = current;
        
        // transition state url
        $state.go($state.current.name, params, {
            reload: false,
            notify: false
        });
        
        // broadcast so menu theme text will update
        $rootScope.$broadcast("themeChange", { theme: $scope.theme });
						
	};
	
}]);