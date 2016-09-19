angular.module("pie-chart-directive", [])

.directive("pieChart", ["d3Service", function(d3Service) {
	return {
		restrict: "E",
		scope: {
			vizData: "=",
            canvasWidth: "=",
            canvasHeight: "=",
            format: "="
		},
		link: function(scope, element, attrs) {
            
            // set up the dom node to attach the d3 to
            // this could be any valid d3 selector like a class
            var domNode = element[0];
            
            // set sizes from attributes in html element
            // if not attributes present - use default
            var width = parseInt(attrs.canvasWidth) || 700;
            var height = parseInt(attrs.canvasHeight) || width;
            
            // set other layout attributes
            var radius = Math.min(width, height) / 2;
            var format = attrs.format || "pie";
            var outer = radius - 10;
            var inner = format == "pie" ? 0 : radius - 90;
            var arcPadding = format == "pie" ? 0 : 0.03;
            var transition = {
                time: 3000
            };
			
			// get d3 promise
			d3Service.d3().then(function(d3) {
                
                ///////////////////////////////////////////////
                /////////////// d3 SET-UP START ///////////////
                ///////////////////////////////////////////////

                // set up the arc layout algorithm
				var arc = d3.svg.arc()
					.outerRadius(outer)
					.innerRadius(inner);

                // set up the pie layout algorithm
				var pie = d3.layout.pie()
                    .padAngle(arcPadding)
					//.sort(null) // if maintaining the order in the dataset is important turn this on
					.value(function(d) { return d.value; });

                // create svg canvas
                var canvas = d3.select(domNode)
                    .append("svg")
                    .attr({
                        "data-format": format,
                        viewBox: "0 0 " + width + " " + height
                    })
					.append("g")
					.attr({
						transform: "translate(" + width / 2 + "," + height / 2 + ")"
					});
                
                /////////////////////////////////////////////
                /////////////// d3 SET-UP END ///////////////
                /////////////////////////////////////////////
                
                // bind data
                scope.$watch("vizData", function(newData, oldData) {
                    
                    ///////////////////////////////////////////////
                    /////////////// d3 RENDER START ///////////////
                    ///////////////////////////////////////////////
    
                    // async check
                    if (newData !== undefined) {
                        
                        function draw(data) {
                            
                            // PIE
							canvas
                                .selectAll("g")
                                .data(pie(data))
                                .enter()
                                .append("g")
                            
                                // each group
                                .each(function(d) {
                                
                                    var group = d3.select(this);
                                
                                    // ARC (PIE SLICE)
                                
                                    // set selection
                                    var slice = group
                                        .selectAll("path")
                                        .data([d]);
                                
                                    // update selection
                                    slice
                                        .transition()
                                        .duration(transition.time)
                                        .attr({
                                            d: arc
                                        });
                                
                                    // enter selection
                                    slice
                                        .enter()
                                        .append("path")
                                        .transition()
                                        .duration(transition.time)
                                        .attr({
                                            d: arc
                                        });
                                
                                    // exit selection
                                    slice
                                        .exit()
                                        .transition()
                                        .duration(transition.time)
                                        .remove();
                                
                                    // LABEL
                                
                                    // set selection
                                    var label = group
                                        .selectAll("text")
                                        .data([d]);
                                
                                    // update selection
                                    label
                                        .attr({
                                            dy: "0.3em",
                                            transform: "translate(" + arc.centroid(d) + ")"
                                        })
                                        .text(d.data.name);
                                
                                    // enter selection
                                    label
                                        .enter()
                                        .append("text")
                                        .attr({
                                            dy: "0.3em",
                                            transform: "translate(" + arc.centroid(d) + ")"
                                        })
                                        .text(d.data.name);
                                
                                    // exit selection
                                    label
                                        .exit()
                                        .remove();
                                    
                                });
								
	                        };
	                        
                            draw(newData);
                        
                            /////////////////////////////////////////////
                            /////////////// d3 RENDER END ///////////////
                            /////////////////////////////////////////////
                        
                    };
                    
                });
				
			});
			
		}
		
	};
    
}]);