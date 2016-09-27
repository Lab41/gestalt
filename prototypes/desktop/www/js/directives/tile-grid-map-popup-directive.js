angular.module("tile-grid-map-popup-directive", [])

.directive("tileGirdMapPopup", ["$rootScope", function($rootScope) {
	return {
		restrict: "E",
		templateUrl: "templates/directives/tile-grid-map-popup.html",
		scope: {
            feature: "="
        },
        controller: function($scope) {
            console.log("tile-grid-map-popup-directive was started!");
        }
	};
    
}]);
