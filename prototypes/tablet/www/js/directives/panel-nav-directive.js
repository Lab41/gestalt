angular.module("panel-nav-directive", [])

.directive("panelNav", ["$state", "$ionicViewSwitcher", "$ionicHistory", "layoutService", "$rootScope", function($state, $ionicViewSwitcher, $ionicHistory, layoutService, $rootScope) {
	return {
		restrict: "E",
		scope: {
			panels: "="
		},
	    controller: function($scope) {
	   
			// data objects
	    	$scope.panelParam = $state.params.panel;
	    	
	    	// change the pane via navigation
            $scope.changePanel = function(event, idx) {console.log(event);
console.log(idx);
                // get clicked on name
                var panel = event.target.id;
                var currentIdx = idx;
                                
                // get panel from data stored in service
                layoutService.getStructure(panel).then(function(data) {
		
                    // destination panel
                    var destination = data;
                    
                    // check all panels
                    angular.forEach($scope.panels, function(value, key) {
                        
                        // get destination index
                        if (destination.id == value.id) {
                            
                            var destIndex = key;
                                                         
                            // check indicies to resolve animation direction
                            console.log(destIndex + " " + currentIdx);
                            
                        };
                    
                    });

                });

            };
			
			$rootScope.$on("hideNav", function(event, args) {
		
		        $scope.hideNav = args.val;
		        
			});
	    	
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