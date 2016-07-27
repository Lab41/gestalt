angular.module("group-nodes-directive", [])

.directive("groupNodes", ["d3Service", function(d3Service) {
	return {
		restrict: "E",
		scope: {
			vizData: "=",
			grouping: "=",
            canvasWidth: "=",
            canvasHeight: "="
		},
        template: "<div></div>",
		link: function(scope, element, attrs) {
			
			// get d3 promise
			d3Service.d3().then(function(d3) {
                                
                // set sizes from attributes in html element
                // if not attributes present - use default
				var width = parseInt(attrs.canvasWidth) || 500;
                var height = parseInt(attrs.canvasHeight) || width;
                var radius = 4;
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
                
                // bind data
                scope.$watchGroup(["vizData", "grouping"], function(newData, oldData) {
    
                    // async check
                    if (newData[0] !== undefined && newData[1] !== undefined) {
						
						function draw(data, groups) {
                            
                            // update nodes based on cluster groups
                            function clusterNodes() {
                                
                                var groupType = this.innerHTML;
                                    
                                // non-region specific grouping
                                d3.range(nodes.length).map(function(i) {

                                    // current node
                                    var curr_node = nodes[i];console.log(curr_node);
                                    var group = groupType;
                                    var subgroup = test_foci[groupType][curr_node.origin];

                                    // move into cluster group
                                    curr_node.cluster = group;
                                    curr_node.subgroup = subgroup;

                                    // set coords
                                    curr_node.cx = test_foci[groupType][subgroup].x;
                                    curr_node.cy = test_foci[groupType][subgroup].y;

                                });

                                // resume force layout
                                force.resume();	

                            };
                            
                            // force layout started
                            function startForce(e) {
                                
                                // TODO get subgroups from ENDPOINT
                                var subgroups = ["blah", "de", "da"];
                                
                                // add group label group
                                canvas
                                    .append("g")
                                    .attr({
                                        class: "group-label",
                                        transform: function(d) { return "translate(" + center.x + "," + (center.y - 100) + ")"; }
                                    })
                                    
                                    .each(function(group) {
                                    
                                        // label
                                        d3.select(this)
                                            .append("text")
                                            .text("label");
                                    });
                                
                            };
                            
                            // force ticks
                            function tick(e) {
                                
                                // force direction and shape of clusters
                                var k = 0.25 * e.alpha;

                                // push nodes toward focus
                                nodes.forEach(function(o, i) {
                                    
                                    // get focus x,y values
                                    o.y += (test_foci[o.cluster][o.subgroup].y - o.y) * k;
                                    o.x += (test_foci[o.cluster][o.subgroup].x - o.x) * k;
                                    
                                });
                                
                                node
                                    .attr({
                                    transform: function(d) { return "translate(" + d.x + "," + d.y + ")"; }
                                });

                            };
                            
                            // force layout done
                            function endForce(e) {
                                console.log("do something when layout complete");
                            };
                            
                            // make foci objects for each group
                            var test_foci = {};
                            groups.map(function(o) {
                                
                                var subgroups = {};
                                
                                // add subgroups to obj
                                o.subgroups.map(function(s) {
                                    
                                    // check for nulls and do math to figure out new coords
                                    // nulls mean non-geographic groups
                                    var coords = {};
                                    coords["x"] = s.center_x;
                                    coords["y"] = s.center_y;
                                    
                                    subgroups[s.id] = coords;
                                    
                                    // add nodes as subgroups
                                    s.nodes.map(function(n) {
                                        
                                        // check for null node arrays
                                        // TODO see if endponit can expose empty array vs. null array
                                        if (n !== null) {

                                            subgroups[n.id] = n.subgroup;
                                            
                                        };
                                        
                                    });
                                    
                                });
                                
                                test_foci[o.name] = subgroups;
                                
                                // add default values to foci for starting position
                                var startCoords = {};
                                startCoords["1"] = { x: center.x, y: center.y };
                                
                                test_foci["default"] = startCoords;
                                
                            });
                            console.log(test_foci);                            
							// coordinates for groups
							var foci = { 
								group0: {x: center.x, y: center.y}, 
								trade: {x: (width * 0.1), y: center.y}, 
								investment: {x: (width * 0.8), y: center.y},
								region: {x: (width * 0.4), y: center.y},
								export: {x: (width * 0.2), y: center.y}
							};
                            
                            // attach event to button
							d3.select(element.find("div")[0])
								.selectAll(".country-group")
								.data(groups)
								.enter()
								.append("button")
								.attr({
									type: "button"
								})
								.text(function(d) { return d.name; })
                                .on("click", clusterNodes);
                            
                            // set nodes from data
                            var nodes = data;
                            console.log(nodes);
                            // bind data to force layout
                            force
                                .nodes(nodes)
                                //.links()
                                .on("start", startForce)
                                .on("tick", tick)
                                .on("end", endForce)
                                .start();
                            
                            // draw node groups
                            var node = canvas
                                .selectAll(".node")
                                .data(nodes)
                                .enter()
                                .append("g")
                                .attr({
                                    class: "node",
                                    transform: function(d) { return "translate(" + d.x + "," + d.y + ")"; }
                                })
                            
                                .each(function(group) {
                                    
                                    var currentGroup = d3.select(this);
                                    
                                    // circle
                                    currentGroup
                                        .append("circle")
                                        .attr({
                                            r: radius
                                        });
                                    
                                    // label
                                    currentGroup
                                        .append("text")
                                        .attr({
                                            dx: 0,
                                            dy: "0.35em"
                                        })
                                        .text(function(d) { return d.origin });
                                });
                                
                        };

                        // update the viz
                        draw(newData[0], newData[1]);
                        
                    };
                    
                });
				
			});
			
		}
		
	};
}]);