angular.module("group-nodes-directive", [])

.directive("groupNodes", ["d3Service", function(d3Service) {
	return {
		restrict: "E",
		scope: {
			vizData: "=",
            canvasWidth: "=",
            canvasHeight: "="
		},
        template: "<button>group</button>",
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
                var	center = { "x": (width / 2), "y": (height/ 2) };
				
				var force = d3.layout.force()
					.charge(-20)
                    .linkDistance(50)
                    .size([(width - diameter), (height - diameter)]);
                
                var canvas = d3.select(element[0])
                    .append("svg")
                    .attr({
                        viewBox: "0 0 " + width + " " + height
                    });
                
                var groups = [{"name": "group1"},{"name": "group2"},{"name": "group3"}];

                // coordinates for groups
                var foci = { group0: {x: center.x, y: center.y}, group1: {x: (width * 0.1), y: center.y}, group2: {x: (width * 0.9), y: center.y}};
                
                // bind data
                scope.$watch("vizData", function(newData, oldData) {
    
                    // async check
                    if (newData !== undefined) {
						
						function draw(data) {  
                            
                            // attach event to button
                            d3.select("button")
                                .on("click", clusterNodes);
                            
                            // set nodes from data
                            var nodes = data;
                            
                            // bind data to force layout
                            force
                                .nodes(nodes)
                                //.links()
                                .on("tick", tick)
                                .start();
                            
                            // draw nodes
                            var node = canvas
                                .selectAll(".node")
                                .data(nodes)
                                .enter()
                                .append("circle")
                                .attr({
                                    class: "node",
                                    r: function(d) { return d.radius; }
                                });

                            // update nodes based on cluster groups
                            function clusterNodes() {
                                d3.range(nodes.length).map(function(i) {
                                    
                                    // current node
                                    var curr_node = nodes[i];

                                        // move into cluster group
                                        curr_node.cluster = curr_node.clustergroups.cluster;

                                        // set coords
                                        curr_node.cx = foci[curr_node.cluster].x;
                                        curr_node.cy = foci[curr_node.cluster].y;

                                });

                                // resume force layout
                                force.resume();	

                            };
                            
                            // force ticks
                            function tick(e) {
                                
                                // force direction and shape of clusters
                                var k = 0.25 * e.alpha;

                                // push nodes toward focus
                                nodes.forEach(function(o, i) {
                                    
                                    // current group
                                    var curr_cluster = o.cluster;
                                    
                                    // get focus x,y values
                                    o.y += (foci[curr_cluster].y - o.y) * k;
                                    o.x += (foci[curr_cluster].x - o.x) * k;
                                    
                                });
                                
                                // assign node new center coordinates
                                node
                                    .attr({
                                        cx: function(d) { return d.x; },
                                        cy: function(d) { return d.y; }
                                    });

                            };
                                
                        };

                        // update the viz
                        draw(newData);
                        
                    };
                    
                });
				
			});
			
		}
		
	};
}]);