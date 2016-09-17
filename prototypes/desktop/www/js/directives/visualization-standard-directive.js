angular.module("visualization-standard-directive", [])

.directive("visualizationStandard", ["$compile", "contentService", function($compile, contentService) {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			directiveName: "=",
			directiveData: "=",
			orientation: "=",
			canvasWidth: "=",
			canvasHeight: "="
		},
        link: function(scope, element, attrs) {
			
			// add directive
			var customDirective = angular.element("<" + scope.directiveName + "></" + scope.directiveName + ">");
			
			// add attributes
			customDirective.attr("viz-data", "directiveData");
			
			// TODO abstract attributes
			
			if (scope.orientation) {
				
				customDirective.attr("orientation", scope.orientation);
				
			};
			
			if (scope.canvasWidth) {
				
				customDirective.attr("canvas-width", scope.canvasWidth);
				
			};
			
			if (scope.canvasHeight) {
				
				customDirective.attr("canvas-height", scope.canvasHeight);
				
			};
			
			// compile the custom directive
			$compile(customDirective)(scope);
			
			// add custom directive
			element.append(customDirective);
			
        }
	};
    
}]);