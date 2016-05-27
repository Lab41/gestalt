angular.module("card-layout-directive", [])

.directive("cardLayout", ["$ionicGesture", "$ionicScrollDelegate", "$window", function($ionicGesture, $ionicScrollDelegate, $window) {
	return {
		restrict: "E",
		scope: {
			list: "=",
			mode: "=",
			cardWidth: "=",
			borderColor: "="
		},
		controller: function($scope) {
			
			$scope.getTemplateUrl = function() {
	          return "templates/card/" + $scope.mode + ".html";
          	};
	      
	    },
	    replace: true,
		template: "<ng-include src='getTemplateUrl()'/>",
		link: function(scope, element, attrs) {
			/*
			var viewHeight = $window.innerHeight;
			
			// SWIPE UP
			$ionicGesture.on("swipeup", function(event) {
				
				// hault default action
				event.preventDefault();
				
				// scroll to next
				$ionicScrollDelegate.scrollBy(0, viewHeight, true);
				
				
			}, element);
			
			// DRAG UP
			$ionicGesture.on("dragup", function(event) {
				
				// hault default action
				event.preventDefault();
				
				// scroll to next
				$ionicScrollDelegate.scrollBy(0, viewHeight, true);
				
			}, element);*/
			
		}
		
	};
}]);