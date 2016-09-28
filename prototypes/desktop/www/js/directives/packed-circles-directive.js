angular.module("packed-circles-directive", [])

.directive("packedCircles", ["d3Service", "$window", function(d3Service, $window) {
	return {
		restrict: "E",
		scope: {
			vizData: "=",
            canvasWidth: "=",
            canvasHeight: "="
		},
		link: function(scope, element, attrs) {
            
            element.append(angular.element("<div style='width: 100%; height: 100%;'></div>"));
            
            // set up the dom node to attach the d3 to
            // this could be any valid d3 selector like a class
            var domNode = element.find("div")[0];
            
            // get window dimensions
            var dnStyle = $window.getComputedStyle(domNode);
            var dnWidth = dnStyle.getPropertyValue("width");
            var windowWidth = parseInt(dnWidth.split("px")[0]);
            
            // TODO find better way to get real available space
            // right now space already taken by existing html dom elements isn't calculated
                
            // set sizes from attributes in html element
            // if not attributes present - use default based on window aspect ratio
            var width = parseInt(attrs.canvasWidth) || 400;
            var height = parseInt(attrs.canvasHeight) || width;
            
            // set other layout attributes
            var padding = 15;
            var radius = (Math.min(width, height) - (padding * 2)) / 2;
            var diameter = radius * 2;
            var colorRange = ["black", "grey", "darkgrey"]; // abstract out to attrs or css
            var transition = {
                time: 3000
            }
            		
			// get d3 promise
			d3Service.d3().then(function(d3) {
                
                ///////////////////////////////////////////////
                /////////////// d3 SET-UP START ///////////////
                ///////////////////////////////////////////////
                
                // set up pack layout
                var pack = d3.layout
                    .pack()
                    .padding(3)
                    .size([diameter, diameter])

                // set color
                var color = d3.scale
                    .linear()
                    .domain([-1, 5])
                    .range(colorRange)

                // create svg canvas
                var canvas = d3.select(domNode)
                    .append("svg")
                    .attr({
                        viewBox: "0 0 " + width + " " + height
                    })
                
                /////////////////////////////////////////////
                /////////////// d3 SET-UP END ///////////////
                /////////////////////////////////////////////
                
                // watch data for viz
                scope.$watch("vizData", function(newData, oldData) {
    
                    // async check
                    if (newData !== undefined) {
                        
                        ///////////////////////////////////////////////
                        /////////////// d3 RENDER START ///////////////
                        ///////////////////////////////////////////////
                        
                        function draw(data) {
                            
                            function zoom(d) {
     
                                var focus0 = focus; 
                                 
                                focus = d;
                                 
                                // set up transition
                                var transition = d3.transition()
                                    .duration(d3.event.altKey ? 7500 : 750)
                                    .tween("zoom", function(d) {
           
                                        // interpolator
                                        var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r *2]);
                                         
                                        return function(t) { zoomTo(i(t)); };
                                         
                                    });
                                 
                                // transition text
                                transition
                                    .selectAll("text")
                                    .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
                                    .style("fill-opacity", function(d) { return d.parent === focus ? 1 : 0; })
                                    .each("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
                                    .each("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
                             
                            };
   
                            function zoomTo(v) {
     
                                var k = diameter / v[2];
                                 
                                // set the current view
                                view = v;
                                 
                                // transform node
                                node
                                    .attr({
                                        transform: function(d) { return "translate(" + ((d.x - v[0]) * k + viewCenter) + "," + ((d.y - v[1]) * k + viewCenter) + ")"; }
                                    });
                                 
                                // transform the circle
                                circle
                                    .attr({
                                        r: function(d) { return d.r * k; }
                                    });
                             
                            };
                            
                            // add data specific values to layout algorithm
                            pack.value(function(d) { return 1;/*return Math.floor(Math.random() * (200 - 1)) + 1;*/ });

                            // set variables to use for zooming and data starting point (a.k.a. root)
                            var focus = data;
                            var nodes = pack.nodes(data);
                            var view;

                            // set selection
                            var circle = canvas
                                .selectAll("circle")
                                .data(nodes);
                                             
                             // update selection
                            circle
                                .transition()
                                .duration(transition.time)
                                .attr({
                                    class: function(d) { return d.parent ? d.children ? "node parent" : "node leaf" : "node root"; },
                                    transform: function(d) { return "translate(" + d.x + "," + d.y + ")"; },
                                    r: function(d) { return d.r; }
                                })

                            // enter selection
                            circle
                                .enter()
                                .append("circle")
                                .transition()
                                .duration(transition.time)
                                .attr({
                                    class: function(d) { return d.parent ? d.children ? "node parent" : "node leaf" : "node root"; },
                                    transform: function(d) { return "translate(" + d.x + "," + d.y + ")"; },
                                    r: function(d) { return d.r; }
                                });
                            
                            // set events
                            circle
                                .on({
                                click: function(d) {
                                    
                                    // check current focus
                                    if (focus !== d) {
                                        
                                        zoom(d);
                                        
                                        d3.event.stopPropagation();
                                        
                                    };
                                    
                                }
                                
                            });

                            // exit selection
                            circle
                                .exit()
                                .transition()
                                .duration(transition.time)
                                .attr({
                                    transform: function(d) { return "translate(" + (width * 2) + "," + (height * 2) + ")"; }
                                })
                                .remove();

                            // set selection
                            var text = canvas
                                .selectAll("text")
                                .data(nodes);

                            // enter selection
                            text
                                .enter()
                                .append("text")
                                .attr({
                                    class: "label",
                                    transform: function(d) { return "translate(" + d.x + "," + d.y + ")"; }
                                })
                                .style({
                                    "fill-opacity": 0
                                });

                            // update selection
                            text
                                .transition()
                                .duration(transition.time)
                                .attr({
                                    transform: function(d) { return "translate(" + d.x + "," + d.y + ")"; }
                                })
                                .style({
                                    "fill-opacity": function(d) { return d.parent === data ? 1 : 0; },
                                    display: function(d) { return d.parent === data ? "inline" : "none"; },
                                })
                                .text(function(d) { return d.name; });

                            // exit selection
                            text
                                .exit()
                                .remove();
                            
                            // click away reset zoom
                            d3.select("body")
                                .on("click", function() { zoom(data); });
                            
                            // set for zooming
                            var node = canvas.selectAll("circle,text");
                            var viewCenter = (width - padding * 2) / 2;
                            view = [viewCenter, viewCenter, diameter];

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
