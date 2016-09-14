angular.module("visualization-standard-directive", [])

.directive("visualizationStandard", ["$compile", "contentService", function($compile, contentService) {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			visId: "="
		},
        link: function(scope, element, attrs) {
			
			var id = scope.visId;
            console.log(id);
            // get appropriate directive and corresponding dummy data
            contentService.getData("visualization/angular/directives/" + id + "/standards/").then(function(data) {

                // set scope
                $scope.visualization = data;console.log(data);

            });
			
			// add directive
			//var customDirective = angular.element("<" + directiveName + "></" + directiveName + ">");
			
			// add attributes
			//customDirective.attr("viz-data", "dirData");
			
			// compile the custom directive
			//$compile(customDirective)(scope);
			
			// add custom directive
			//element.append(customDirective);
			
        }
	};
    
}]);