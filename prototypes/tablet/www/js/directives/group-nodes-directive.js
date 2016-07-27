angular.module("group-nodes-directive", [])

.directive("groupNodes", ["d3Service", function(d3Service) {
	return {
		restrict: "E",
		scope: {
			vizData: "=",
			grouping: "=",
            startGroup: "=",
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
                var radius = 10;
                var diameter = radius * 2;
				var color = ["orange", "teal", "grey", "#5ba819"];
                var	center = { "x": (width / 2), "y": (height/ 2) };
				
				var force = d3.layout.force()
					.charge(-50)
                    .linkDistance(-10)
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
                        
                        var startGroup = scope.startGroup;
						
						function draw(data, groups) {
                            
                            // update nodes based on cluster groups
                            function clusterNodes() {
                                
                                var groupType = this.innerHTML;
                                    
                                // non-region specific grouping
                                d3.range(nodes.length).map(function(i) {

                                    // current node
                                    var curr_node = nodes[i];
                                    var group = groupType;
                                    var subgroup = foci[groupType][curr_node.origin];

                                    // move into cluster group
                                    curr_node.cluster = group;
                                    curr_node.subgroup = subgroup;

                                    // set coords
                                    curr_node.cx = foci[groupType][subgroup].x;
                                    curr_node.cy = foci[groupType][subgroup].y;

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
                                var k = 0.1 * e.alpha;

                                // push nodes toward focus
                                nodes.forEach(function(o, i) {
                                    
                                    // get focus x,y values
                                    o.y += (foci[o.cluster][o.subgroup].y - o.y) * k;
                                    o.x += (foci[o.cluster][o.subgroup].x - o.x) * k;
                                    
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
                            var foci = {};
                            groups.map(function(o) {
                                
                                // check for starting group
                                if (o.name == startGroup) {
                                    
                                    // add x,y values
                                    // assumes starting is a single group
                                    // if we want to be able to start in a different grouping
                                    // need to adjust logic to accomodate
                                    o.subgroups[0].center_x = center.x;
                                    o.subgroups[0].center_y = center.y;
                                    
                                    // update nodes with default group and subgroup
                                    data.map(function(n) {

                                        // add values from data
                                        n["cluster"] = startGroup;
                                        n["subgroup"] = o.subgroups[0].id;

                                    });
                                    
                                };
                                
                                var subgroups = {};
                                
                                // track cursor for grided layouts
                                var cellHeight = height / o.subgroups.length;
                                var cursorY = cellHeight / 2;
                                
                                // add subgroups to obj
                                o.subgroups.map(function(s) {
                                    
                                    // check for nulls and do math to figure out new coords
                                    if (s.center_x == null && s.center_y == null) {
                                        
                                        // set coords evenly in the available space
                                        var coords = {};
                                        
                                        coords["x"] = width / 5;
                                        coords["y"] = cursorY;
                                        
                                        cursorY += cellHeight;
                                        
                                    } else {
                                    
                                        // nulls mean non-geographic groups
                                        var coords = {};
                                        coords["x"] = s.center_x;
                                        coords["y"] = s.center_y;
                                        
                                    };
                                    
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
                                
                                foci[o.name] = subgroups;
                                
                            });
                            console.log(foci);                            
                            
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