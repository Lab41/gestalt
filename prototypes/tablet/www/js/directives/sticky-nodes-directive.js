angular.module("sticky-nodes-directive", [])

.directive("stickyNodes", ["d3Service", function(d3Service) {
	return {
		restrict: "E",
		scope: {
			vizData: "=",
            canvasWidth: "=",
            canvasHeight: "="
		},
		link: function(scope, element, attrs) {
			
			// get d3 promise
			d3Service.d3().then(function(d3) {
                                
                // set sizes from attributes in html element
                // if not attributes present - use default
				var width = parseInt(attrs.canvasWidth) || 700;
                var height = parseInt(attrs.canvasHeight) || width;
                var radius = 5;
                var diameter = radius * 2;
				var color = ["orange", "teal", "grey", "#5ba819"];
				
				var force = d3.layout.force()
					.charge(-20)
                    .linkDistance(200)
                    .size([(width - diameter), (height - diameter)]);
                
                var svg = d3.select(element[0])
                    .append("svg")
                    .attr({
                        viewBox: "0 0 " + width + " " + height
                    });
                
                var nodes = d3.range(100).map(function(i) {
                  return {index: i};
                });
                
                // bind data
                scope.$watch("vizData", function(newData, oldData) {
    
                    // async check
                    if (newData !== undefined) {
						
						function draw(data) {  
                            
                            force
							  .nodes(data.nodes)
							  //.links(data.links)
                                .on("tick", tick)
							  .start();
                            
                             var node = svg
                                .selectAll(".node")
                                .data(data.nodes)
                                .enter()
                                .append("circle")
                                .attr({
                                    class: "node",
                                    r: radius
                                });
                            
                            // events
                            node
                            
                            function tick() {
                                
                                node.attr("cx", function(d) { return d.x; })
					               .attr("cy", function(d) { return d.y; });  
                                
                            };
                            
                            function cluster() {
                                
                                force
							  .nodes(data.nodes)
							  //.links(data.links)
                                .on("tick", rearrange)
							  .start();
                                
                            };
                            
                            function rearrange(e) {

                              // Push different nodes in different directions for clustering.
                              var k = 6 * e.alpha;
                              nodes.forEach(function(o, i) {
                                o.y += i & 1 ? k : -k;
                                o.x += i & 2 ? k : -k;
                              });

                              node.attr("cx", function(d) { return d.x; })
                                  .attr("cy", function(d) { return d.y; });
                            };
                                
                        };
						
						// check new vs old
                        var isMatching = angular.equals(newData, oldData);
                        
                        // if false
                        if (!isMatching) {

                            // update the viz
                            draw(newData);

                        };
                        
                    };
                    
                });
				
			});
			
		}
		
	};
}]);