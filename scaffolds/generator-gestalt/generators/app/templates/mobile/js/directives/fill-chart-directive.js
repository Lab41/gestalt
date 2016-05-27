angular.module("fill-chart-directive", [])

.directive("fillChart", ["d3Service", function(d3Service) {
	return {
		restrict: "E",
		scope: {
			vizData: "=",
            canvasWidth: "=",
            canvasHeight: "="
		},
		template: "<p>{{ title }}</p>",
		link: function(scope, element, attrs) {
			
			// get d3 promise
			d3Service.d3().then(function(d3) {
                                
                // set sizes from attributes in html element
                // if not attributes present - use default
				var width = parseInt(attrs.canvasWidth) || 100;
                var height = parseInt(attrs.canvasHeight) || 5;
				var color = ["#666666", "lightgrey"];

                // create svg canvas
                var canvas = d3.select(element[0])
                    .append("svg")
                    .attr({
                        viewBox: "0 0 " + width + " " + height
                    });
                    
                // x-scale
                var xScale = d3.scale.linear()
                    .range([0, width]);
                
                // bind data
                scope.$watch("vizData", function(newData, oldData) {
    
                    // async check
                    if (newData !== undefined) {

                        function draw(data) {
                        	
                        	// set scale domains
                        	// TODO make nested domain work and remove hardcode to first item in array
                        	xScale.domain([0, d3.max(data, function(d) { return d.values.x; })]);
                            //yScale.domain(d3.extent(data[0], function(d) { return d.y; }));
                            
                            // draw rectangles until lines are figured out
                            canvas
                            	.selectAll("rect")
                            	.data(data)
                            	.enter()
                            	.append("rect")
                            	.attr({
                            		x: 0,
                            		y: 0,
                            		width: function(d) { return xScale(d.values.x); },
                            		height: height
                            	})
                            	.style({
                            		fill: function(d, i) { return color[i]; }
                            	});
							
                        };
                        
                        draw(newData);
                        
                    };
                    
                });
				
			});
			
		}
		
	};
}]);