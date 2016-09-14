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
            
            // load a story idea
            $scope.changeIdea = function(id) {
                
                // heuristics
                contentService.getData("visualization/heuristics/" + id + "/").then(function(data) {console.log(data);

                    // set scope
                    $scope.heuristics = data;

                });
                
                // transition state/URL
                $state.go("app.panel.visual", {
                    si: id
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