angular.module("dynamic-directive-directive", [])

.directive("dynamicDirective", ["$compile", function($compile) {
	return {
		//priority: 1001,
		//terminal: true,
		restrict: 'E',
		replace: true,
		scope: {
			dir: "=",
			dirData: "="
		},
        link: function(scope, element, attrs) {
			
			var directiveName = scope.dir;
			
			// add directive
			var customDirective = angular.element("<" + directiveName + "></" + directiveName + ">");
			
			// add attributes
			customDirective.attr("viz-data", "dirData");
			
			// compile the custom directive
			$compile(customDirective)(scope);
			
			// add custom directive
			element.append(customDirective);
			
        }
	};
    
}]);