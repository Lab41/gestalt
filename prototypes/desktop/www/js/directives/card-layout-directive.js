angular.module("card-layout-directive", [])

.directive("cardLayout", ["contentService", "$state", function(contentService, $state) {
	return {
		restrict: "E",
        templateUrl: "templates/layouts/card.html",
        scope: {
            visId: "=",
            poster: "=",
            headline: "=",
            subhead: "=",
            description: "="
        },
        controller: function($scope) {
            
            // story idea functionality
            $scope.changeOption = function() {

                // get current set of heuristics
                contentService.getData("visualization/heuristics/" + $scope.headline.replace(/ /g, "-") +  "/").then(function(data) {

                    // transition state url
                    $state.go("app.heuristic", {

                        panel: $state.params.panel,
                        visual: $state.params.visual,
                        heuristic: data[0].vis_type_urlname

                    });

                });
                
            };
            
        },
        link: function(scope, element, attrs) {
            
            var posterDiv = element.find("div")[0];
                        
            // check poster type
            if (scope.poster.match(/^<svg/)) {
                
                // create svg element
                var svgElement = angular.element(scope.poster);
                
                // add it to DOM
                angular.element(posterDiv).append(svgElement);
                
            } else {
                
                // add raster poster
                
            };
            
        }
	};
    
}]);