angular.module("line-chart-directive", [])

.directive("lineChart", ["d3Service", "$window", function(d3Service, $window){
    return {
        restrict: "E",
        scope: {
            vizData: "=",
            canvasWidth: "=",
            canvasHeight: "=",
            strokeSize: "=",
			useLabels: "=",
			spark: "="
        },
        link: function(scope, element, attrs){
            
            // set up the dom node to attach the d3 to
            // this could be any valid d3 selector like a class
            var domNode = element[0];
            
            // set sizes from attributes in html element
            // if not attributes present - use default
            var width = parseInt(attrs.canvasWidth) || 400;
            var height = parseInt(attrs.canvasHeight) || (width / 2);
            
            // set other layout attributes
            var stroke = parseInt(attrs.strokeSize) || 3;
			var radius = stroke * 2;
			var useLabelVal = attrs.useLabels || true;
			var isSparkVal = attrs.spark || false;
			var useLabel = useLabelVal == "false" ? false : true;
			var isSpark = isSparkVal == "true" ? true : false;
            var transition = {
                time: 3000
            };
            
            // get d3 promise
            d3Service.d3().then(function(d3) {
                
                ///////////////////////////////////////////////
                /////////////// d3 SET-UP START ///////////////
                ///////////////////////////////////////////////
                
                // format the date
                // d3 wants very specific date format and this is easiest way to get there
                var parseDate = d3.time.format("%Y-%m-%d").parse;
                
                // x-scale
                var xScale = d3.time.scale();
                
                // y-scale
                var yScale = d3.scale.linear();
				
				// x-axis
                var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .ticks(d3.time.day, 1) // TODO make configurable time
                    .tickFormat(d3.time.format("%d")) // TODO make configurable
                    .orient("top");
                
                // y-axis
                var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient("left");
                
                // spark line
                var sparkline = d3.svg.line()
                    .x(function(d) { return xScale(d.date); })
                    .y(function(d) { return yScale(d.value); })
                    .defined(function(d) { return d.value > 0; }); // ensures spark line is not continuous if data has gaps in time
                                
                // create svg canvas
                var canvas = d3.select(domNode)
                    .append("svg")
                    .attr({
                        viewBox: "0 0 " + width + " " + height
                    });
                
                /////////////////////////////////////////////
                /////////////// d3 SET-UP END ///////////////
                /////////////////////////////////////////////
				
                // bind data
                scope.$watch("vizData", function(newData, oldData) {
                    
                    // async check
                    if (newData !== undefined) {
                        
                        ///////////////////////////////////////////////
                        /////////////// d3 RENDER START ///////////////
                        ///////////////////////////////////////////////
                        
                        function draw(data) {
                            
                            function getStyleValue(style, value) {
                                return parseFloat(style.getPropertyValue(value).split("px")[0]);
                            };
                            
                            // unest values for easy calculations later
                            var unest = [];
                            
                            data.forEach(function(o) {
                                
                                o.values.forEach(function(d) {
                                    
                                    unest.push(d);
                                    
                                });
                                
                            });
                            
                            // format date so d3 don't yell at you
                            data.forEach(function(o) {
                                
                                o.values.forEach(function(d) {
                                    
                                    // map new values to data
                                    d.date = parseDate(d.timestamp.split("T")[0]);
                                    
                                });
                                
                            });
                            
                            // calc max/min scales
                            var style = $window.getComputedStyle(element.find("svg")[0]);
                            var fontSize = getStyleValue(style, "font-size");
                            var labelWidth = d3.max(data, function(d) { return d.name.length; }) * (fontSize * 0.6);
                            var maxPadding = d3.max([fontSize, stroke, (radius * 2)], function(d) { return d; });
                            var xScaleMin = useLabel ? labelWidth : maxPadding;
                            var xScaleMax = width - maxPadding;
                            var yScaleMin = maxPadding;
                            var yScaleMax = height - maxPadding;
                            
                            // add data to x-scale layout algorithm
                            xScale.domain(d3.extent(unest, function(d) { return d.date; }));
                            xScale.range([xScaleMin, xScaleMax]);
                            
                            // add data to y-scale layout algorithm
                            yScale.domain(d3.extent(unest, function(d) { return d.value; }));
                            yScale.range([yScaleMax, yScaleMin]);
                            
                            // LINE GROUP
                            canvas
                                .selectAll(".line")
                                .data(data)
                                .enter()
                                .append("g")
                                .attr({
                                    class: "line"
                                })
                            
                                // each group
                                .each(function(d) {
                                
                                    var group = d3.select(this);
                                
                                    // LABEL
								
									// check setting
									if (useLabel) {
                                
										// set selection
										var label = group
											.selectAll("text")
											.data([d]);

										// update selection
										label
											.transition()
											.duration(transition.time)
											.text(function(d) { return d.name });

										// enter selection
										label
											.enter()
											.append("text")
											.attr({
												x: stroke,
												y: function(d) { return yScale(d.values[0].value); },
												dy: "0.3em"
											})
											.text(function(d) { return d.name });

										// exit selection
										label
											.exit()
											.transition()
											.duration(transition.time)
											.remove();

									};
                                
                                    // LINE

                                    // set selection
                                    var line = group
                                        .selectAll("path")
                                        .data([d.values]);

                                    // update selection
                                    line
                                        .transition()
                                        .duration(transition.time)
                                        .attr({
                                            d: sparkline
                                        })
                                        .style({
                                            "stroke-width": stroke
                                        });

                                    // enter selection
                                    line
                                        .enter()
                                        .append("path")
                                        .transition()
                                        .duration(transition.time)
                                        .attr({
                                            d: sparkline
                                        })
                                        .style({
                                            "stroke-width": stroke
                                        });

                                    // exit selection
                                    line
                                        .exit()
                                        .transition()
                                        .duration(transition.time)
                                        .remove();
								
									if (!isSpark) {
								
										// points
										group
											.selectAll("circle")
											.data(d.values)
											.enter()
											.append("circle")
											.attr({
												cx: function(d) { return xScale(d.date) },
												cy: function(d) { return yScale(d.value) },
												r: radius
											});
										
									};

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
    }
    
}]);