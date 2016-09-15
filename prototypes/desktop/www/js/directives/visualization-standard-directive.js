angular.module("visualization-standard-directive", [])

.directive("visualizationStandard", ["$compile", "contentService", function($compile, contentService) {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			directiveName: "=",
			directiveData: "="
		},
        link: function(scope, element, attrs) {
			
			// add directive
			var customDirective = angular.element("<" + scope.directiveName + "></" + scope.directiveName + ">");
			
			// add attributes
			customDirective.attr("viz-data", "directiveData");
			
			// compile the custom directive
			$compile(customDirective)(scope);
			
			// add custom directive
			element.append(customDirective);
			
        }
	};
    
}]);