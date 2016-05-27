angular.module("pie-chart-directive", [])

.directive("pieChart", ["d3Service", function(d3Service) {
	return {
		restrict: "E",
		scope: {
			vizData: "=",
            canvasWidth: "=",
            canvasHeight: "=",
			title: "="
		},
		template: "<p>{{ title }}</p>",
		link: function(scope, element, attrs) {
			
			// get d3 promise
			d3Service.d3().then(function(d3) {
                                
                // set sizes from attributes in html element
                // if not attributes present - use default
				var width = parseInt(attrs.canvasWidth) || 700;
                var height = parseInt(attrs.canvasHeight) || width;
                var radius = Math.min(width, height) / 2;
				var color = ["#7CF7CC", "#1E4A3B"];
				
				var arc = d3.svg.arc()
					.outerRadius(radius - 10)
					.innerRadius(radius - 90);

				var pie = d3.layout.pie()
					.sort(null)
					.padAngle(0.03)
					.value(function(d) { return d.value; });

                // create svg canvas
                var canvas = d3.select(element[0])
                    .append("svg")
                    .attr({
                        viewBox: "0 0 " + width + " " + height
                    })
					.append("g")
					.attr({
						transform: "translate(" + width / 2 + "," + height / 2 + ")"
					});
                
                // bind data
                scope.$watch("vizData", function(newData, oldData) {
    
                    // async check
                    if (newData !== undefined) {
                        
                        function draw(data) {
	
							var g = canvas.selectAll(".arc")
								  .data(pie(data))
								.enter().append("g")
								  .attr("class", "arc");
	
							  g.append("path")
								  .attr("d", arc)
								  .style("fill", function(d, i) { return color[i]; });
	
							  g.append("text")
								  .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
								  .attr("dy", ".35em")
								  /*.text(function(d) { return d.data.value; })
								  .attr({
								  	"font-size": "4em",
								  	fill: "white"
								  });*/
								
	                        };
	                        
	                        // update the viz
                            draw(newData);
                        
                    };
                    
                });
				
				function type(d) {
				  d.value = +d.value;
				  return d;
				}
				
			});
			
		}
		
	};
}]);