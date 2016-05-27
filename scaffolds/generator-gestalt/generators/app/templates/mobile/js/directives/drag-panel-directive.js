angular.module("drag-panel-directive", [])

.directive("dragPanel", ["$ionicGesture", "$ionicViewSwitcher", "$stateParams", "$state", "layoutService", "$timeout", function($ionicGesture, $ionicViewSwitcher, $stateParams, $state, layoutService, $timeout) {
	return {
		restrict: "EAC",
		controller: function($scope) {
			
			$scope.panels;
			
			// get stored panel data
			layoutService.getPanels().then(function(data) {
				$scope.panels = data;
			});
			
		},
		link: function(scope, element, attr) {
			
			// SWIPE RIGHT
			$ionicGesture.on("swiperight", function(event) {
				
				var idx = getIndex(scope.panels, $stateParams.panel);
				var panels = scope.panels;
				var workspace = $stateParams.workspace;
				
				// hault default action
				event.preventDefault();
				
				// check for first panel
				if (idx !== 0) {
					
					// set animation direction
					$ionicViewSwitcher.nextDirection("back");
					
					// transition state
					$state.go("app.panel", {
						workspace: workspace,
						panel: panels[idx - 1].url.single,
						c: $state.params.c
					}).then(function() {
						
						// TODO make less hacky
						
						// assign menu scope with the right panel so the underline follows
						scope.$parent.$parent.$parent.panelParam = panels[idx - 1].title;
						
					});
					
				};
				
			}, element);
			
			// SWIPE LEFT
			$ionicGesture.on("swipeleft", function(event) {
				
				var idx = getIndex(scope.panels, $stateParams.panel);
				var panels = scope.panels;
				var workspace = $stateParams.workspace;
				
				// hault default action
				event.preventDefault();
				
				// check for first panel
				if (idx !== panels.length - 1) {
					
					// set animation direction
					$ionicViewSwitcher.nextDirection("forward");
					
					// transition state
					$state.go("app.panel", {
						workspace: workspace,
						panel: panels[idx + 1].url.single,
						c: $state.params.c
					}).then(function() {
						
						// TODO make less hacky
						
						// assign menu scope with the right panel so the underline follows
						scope.$parent.$parent.$parent.panelParam = panels[idx + 1].title;
						
					});
					
				};
				
			}, element);
			
			function getIndex(array, panel) {
				
				var idx;
				angular.forEach(array, function(value, key) {
					
					if (value.url.single === panel) {
						
						idx = key;
						
					};
					
				});
				
				return idx;
				
			};
			
		}
	}
	
}]);