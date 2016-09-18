angular.module("visualization-standard-directive", [])

.directive("visualizationStandard", ["$compile", "contentService", function($compile, contentService) {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			directiveName: "=",
			directiveData: "=",
			directiveAttributes: "="
		},
        link: function(scope, element, attrs) {
			
			var attrs = scope.directiveAttributes;
			
			// add directive
			var customDirective = angular.element("<" + scope.directiveName + "></" + scope.directiveName + ">");
			
			// check for attributes
			if (attrs) {
				
				angular.forEach(attrs, function(value, key) {
					
					// check value
					if (value.attr_value) {
						
						// add attribute
						customDirective.attr(value.attr_name, value.attr_value);
						
					};
					
				});
				
			};
			
			// add attributes
			customDirective.attr("viz-data", "directiveData");
			
			// compile the custom directive
			$compile(customDirective)(scope);
			
			// add custom directive
			element.append(customDirective);
			
        }
	};
    
}]);