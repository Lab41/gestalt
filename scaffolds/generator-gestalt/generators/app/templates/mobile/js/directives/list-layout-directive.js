angular.module("list-layout-directive", [])

.directive("listLayout", [function() {
	return {
		restrict: "E",
		scope: {
			list: "=",
			story: "="
		},
		replace: true,
		templateUrl: "templates/list.html",
		link: function(scope, element, attrs) {
			
		}
		
	};
}]);