angular.module("panel-nav-directive", [])

.directive("panelNav", ["$state", "layoutService", "$rootScope", function($state, layoutService, $rootScope) {
	return {
		restrict: "E",
		scope: {
			panels: "="
		},
	    controller: function($scope) {
	   
			// data objects
	    	$scope.panelParam = $state.params.panel;
	    	
	    	// change the pane via navigation
            $scope.changePanel = function(event, idx) {

				// set active panel
				$scope.panelParam = event.target.id;
				
				var originUrl = $state.params.panel;
                var destinationIdx = idx;
                                
                // get panel from data stored in service
                layoutService.getStructure(originUrl, "panel", "panels").then(function(data) {
					
					// origin panel
					var origin = data;
                    console.log($scope.panels);
                    // check all panels
                    angular.forEach($scope.panels, function(value, key) {
                        
                        // get destination index
                        if (origin.id == value.id) {
                            
                            var originIdx = key;
                                                         
                            // check indicies to resolve animation direction
                            if (destinationIdx < originIdx) {
								
								//$ionicViewSwitcher.nextDirection(["back"]);
								
							} else if (destinationIdx > originIdx) {
								
								//$ionicViewSwitcher.nextDirection(["forward"]);
								
							} else {
								
								//$ionicViewSwitcher.nextDirection(["enter"]);
								
							};
                            
                        };
                    
                    });

                });

            };
	    	
	    },
		templateUrl: "templates/panel-nav.html",
		link: function(scope, element, attr) {
			
			// watch for panel change
            scope.$watch("panels", function(newData, oldData) {
                
                // async check
                if (newData !== undefined) {
                    
                    scope.panels = newData;
                    scope.panelParam = $state.params.panel;
                    
                };
                
            })
			
		}

	};
}]);