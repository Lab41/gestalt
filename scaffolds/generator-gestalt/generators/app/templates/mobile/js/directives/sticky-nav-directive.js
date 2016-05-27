angular.module("sticky-nav-directive", [])

.directive("stickyNav", ["$ionicScrollDelegate", "$ionicGesture", "$window", "$rootScope", function($ionicScrollDelegate, $ionicGesture, $window, $rootScope) {
	return {
		link: function(scope, element, attrs) {
			
			var parentOffset = 120;
			var childOffset = 244;
			var parentScroll = $ionicScrollDelegate.$getByHandle("scrollHandle");
			var childScroll = $ionicScrollDelegate.$getByHandle("childHandle");
			var parentView = angular.element(document.getElementById("story-wrap")).find("div")[0];
			var childView = document.getElementById("story-module");
			
			// SCROLL UP
			element.on("scroll", function(event) {
				
				var top = childScroll.getScrollPosition().top;
				var topValue = parseFloat(top / 100);
				var topPositive = parseFloat(top * -1);
				var scrollNav = angular.element(angular.element(element.find("div")[0]).find("div")[0]).find("div");
				
				var distanceParent = -1 * (childScroll.getScrollPosition().top - parentOffset);
				var distanceChild = childOffset - childScroll.getScrollPosition().top;
				parentView.style["margin-top"] = distanceParent + "px";

				// transition background color to cover map				
				element.find("ion-item")[0].parentNode.style.background = "rgba(26,26,26," + topValue + ")";
				document.getElementById("map").style.opacity = 1 - topValue;
				
				// check to stick nav to top
				if (top > 136) {
					
					// check for existing nav
					if (element.find("nav").length == 0) {
						
						var content = scope.$parent.content;
						
						// add nav
						var stickNav = angular.element("<nav class='row aggregate nav-top'><div class='col'><p>" + content.items.length + "</p><p>Items</p><span ng-if='content.recent_items.length > 0' class='badge'>" + content.recent_items.length + "</span></div><div class='col'><p>" + content.nearestEmbassies.length + "</p><p>Facilities</p></div><div class='col'><p>" + content.sources.length + "</p><p>Sources</p></div></nav>");
						element.append(stickNav);
						
					};
					
				} else {
					
					// remove nav
					element.find("nav").remove();
					
				};
				
			});
			
			// DRAG DOWN
			$ionicGesture.on("dragdown", function(event) {
				
				var top = childScroll.getScrollPosition().top;
				var topValue = parseFloat(top * -1);
				var scrollNav = angular.element(element.find("div")[0]);
				
				// hault default action
				event.preventDefault();
				
				// check position
				if (topValue > parseFloat(100)) {
					
					// hide scroll
					// TODO make less janky
					scrollNav.addClass("hide-bottom");
					
					// notify scope so map will redraw
					$rootScope.$broadcast("mapChange", { "height": "100vh", "interactive": true, "zIndex": 2000 });
					
					// check for existing nav
					if (element.parent().find("nav").length == 0) {
					
						// add footer
						var bottomNav = angular.element("<nav class='row nav-bottom'><div class='col' style='text-align: center;'><i class='ion-ios-arrow-up'></i></div></nav>");
						element.parent().append(bottomNav);
						
						bottomNav.on("click", function() {
							
							// show content
							scrollNav.removeClass("hide-bottom");
							
							// notify scope so map will redraw
							$rootScope.$broadcast("mapChange", { "height": "200px", "interactive": false, "zIndex": -99 });
							
							// remove bottom nav
							bottomNav.remove();
							
						});
						
					};
					
				};
				
			}, element);
			
		}
		
	}
  
}]);