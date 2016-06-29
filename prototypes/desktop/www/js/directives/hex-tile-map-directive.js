angular.module("hex-tile-map-directive", [])

.directive("hexTileMap", ["d3Service", function(d3Service) {
	return {
		restrict: "E",
		scope: {
			vizData: "=",
            canvasWidth: "=",
            canvasHeight: "="
		},
        template: "<div style='width: 100%; height: 100%;'><svg viewBox='0 0 907.6 521.4'><use xlink:href='visuals/hex-map.svg#artwork'/></svg></div>",
		link: function(scope, element, attrs) {
			
			// get d3 promise
			d3Service.d3().then(function(d3) {
                                
                // set sizes from attributes in html element
                // if not attributes present - use default
				var width = parseInt(attrs.canvasWidth) || 500;
                var height = parseInt(attrs.canvasHeight) || width;
                var radius = 5;
                var diameter = radius * 2;
				var color = ["orange", "teal", "grey", "#5ba819"];
                
                // bind data
                scope.$watch("vizData", function(newData, oldData) {
    
                    // async check
                    if (newData !== undefined) {
						
						function draw(data) {  
                                
                        };
						
						// check new vs old
                        var isMatching = angular.equals(newData, oldData);
                        
                        // if false
                        //if (!isMatching) {

                            // update the viz
                            draw(newData);

                        //};
                        
                    };
                    
                });
				
			});
			
		}
		
	};
}]);