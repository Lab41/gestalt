angular.module("bar-chart-directive", [])

.directive("barChart", ["d3Service", "$window", function(d3Service, $window) {
	return {
		restrict: "E",
		scope: {
			vizData: "=",
            canvasWidth: "=",
            canvasHeight: "=",
            orientation: "=",
            valueKey: "="
		},
		link: function(scope, element, attrs) {
			
			// set up the dom node to attach the d3 to
            // this could be any valid d3 selector like a class
            var domNode = element[0];
            
            // set sizes from attributes in html element
            // if not attributes present - use default
            var width = parseInt(attrs.canvasWidth) || 400;
            var height = parseInt(attrs.canvasHeight) || (width / 2);
            
            // set other layout attributes
            var orientationVal = attrs.orientation || "horizontal";
			var horzOrientation = orientationVal == "horizontal" ? true : false;
            var valueKey = attrs.valueKey || "value";
            var gutter = 0.1;
            var transition = {
                time: 1000
            };
            
            // get d3 promise
            d3Service.d3().then(function(d3) {
                
                ///////////////////////////////////////////////
                /////////////// d3 SET-UP START ///////////////
                ///////////////////////////////////////////////
                
                // x-scale
                var xScale = horzOrientation ? d3.scale.linear() : d3.scale.ordinal(); 
                
                // y-scale
                var yScale = horzOrientation ? d3.scale.ordinal() : d3.scale.linear();

                // create svg canvas
                var canvas = d3.select(domNode)
                    .append("svg")
                    .attr({
                        "data-orientation": orientationVal,
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
							
							// update/enter/exit content of groups
							function updateGroupContent(group, data) {

								// LABEL

								// set selection
								var label = group
									.selectAll(".label")
									.data([data]);

								// update selection
								label
									.transition()
									.duration(transition.time)
									.attr({
										class: "label",
										x: horzOrientation ? gutter * 100 : (xScale(data.name) + xScale.rangeBand()/2),
										y: horzOrientation ? yScale(data.name) + (yScale.rangeBand() / 2) : height,
										dx: 0,
										dy: horzOrientation ? "0.3em" : 0
									})
									.text(data.name);

								// enter selection
								label
									.enter()
									.append("text")
									.attr({
										class: "label",
										x: horzOrientation ? gutter * 100 : (xScale(data.name) + xScale.rangeBand()/2),
										y: horzOrientation ? yScale(data.name) + (yScale.rangeBand() / 2) : height,
										dx: 0,
										dy: horzOrientation ? "0.3em" : 0
									})
									.text(data.name);

								// exit selection
								label
									.exit()
									.transition()
									.duration(transition.time / 2)
									.remove();

								// BAR

								// set selection
								var bar = group
									.selectAll(".bar")
									.data([data]);

								// update selection
								bar
									.transition()
									.duration(transition.time)
									.attr({
										class: "bar",
										x: horzOrientation ? xScaleMin : xScale(data.name),
										y: horzOrientation ? yScale(data.name) : yScale(data[valueKey]),
										width: horzOrientation ? xScale(data[valueKey]) : xScale.rangeBand(),
										height: horzOrientation ? yScale.rangeBand() : yScaleMax - yScale(data[valueKey])
									});

								// enter selection
								bar
									.enter()
									.append("rect")
									.transition()
									.duration(transition.time)
									.attr({
										class: "bar",
										x: horzOrientation ? xScaleMin : xScale(data.name),
										y: horzOrientation ? yScale(data.name) : yScale(data[valueKey]),
										width: horzOrientation ? xScale(data[valueKey]) : xScale.rangeBand(),
										height: horzOrientation ? yScale.rangeBand() : yScaleMax - yScale(data[valueKey])
									});

								// exit selection
								bar
									.exit()
									.transition()
									.duration(transition.time / 2)
									.remove();

							};
                            
                            // calc max/min scales
                            var style = $window.getComputedStyle(element.find("svg")[0]);
                            var fontSize = getStyleValue(style, "font-size");
                            var labelWidth = d3.max(data, function(d) { return d.name.length; }) * (fontSize * 0.6);
                            var maxPadding = d3.max([fontSize, gutter], function(d) { return d; });
                            var xScaleMin = horzOrientation ? labelWidth : 0;
                            var xScaleMax = width;
                            var yScaleMin = horzOrientation ? 0 : maxPadding;
                            var yScaleMax = horzOrientation ? height : height - maxPadding;
                            
                            // check orientation
                            if (horzOrientation) {
                        	
                                // add data to x-scale layout algorithm
                                xScale.domain([0, d3.max(data, function(d) { return d[valueKey]; })]);
                                xScale.range([xScaleMin, xScaleMax]);

                                // add data to y-scale layout algorithm
                                yScale.domain(data.map(function(d) { return d.name; }));
                                yScale.range([height, 0])
                                yScale.rangeRoundBands([height, 0], 0.5);
                                
                            } else {
                                
                                // add data to x-scale layout algorithm
                                xScale.domain(data.map(function(d) { return d.name; }));
                                xScale.range([xScaleMin, xScaleMax])
                                xScale.rangeRoundBands([xScaleMin, xScaleMax], gutter);
                                
                                // add data to y-scale layout algorithm
                                yScale.domain([0, d3.max(data, function(d) { return d[valueKey]; })]);
                                yScale.range([yScaleMax, yScaleMin]);
                                
                            };
                            
                            // STACK
                            var barSet = canvas
                                .selectAll(".barset")
                                .data(data);
							
							// update selection
							barSet
								.transition()
								.duration(transition.time)
								.attr({
									class: "barset"
								})
                            
                                // each group
                                .each(function(d) {
                                
                                    updateGroupContent(d3.select(this), d);

                                });
							
							// enter selection
							barSet
								.enter()
								.append("g")
								.transition()
								.duration(transition.time)
								.attr({
									class: "barset"
								})
								
								// each group
								.each(function(d) {
                                
                                    updateGroupContent(d3.select(this), d);

                                });
							
							// exit selection
							barSet
								.exit()
								.transition()
								.duration(transition.time / 2)
								.remove();
							
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
