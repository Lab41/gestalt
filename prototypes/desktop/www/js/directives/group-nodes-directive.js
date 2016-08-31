angular.module("group-nodes-directive", [])

.directive("groupNodes", ["d3Service", "contentService", function(d3Service, contentService) {
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
                
                ///////////////////////////////////////////////
                /////////////// d3 SET-UP START ///////////////
                ///////////////////////////////////////////////
                                
                // set sizes from attributes in html element
                // if not attributes present - use default
				var width = parseInt(attrs.canvasWidth) || 500;
                var height = parseInt(attrs.canvasHeight) || width;
                var radius = 3;
                var diameter = radius * 2;
				var color = ["orange", "teal", "grey", "#5ba819"];
                var	center = { "x": (width / 2), "y": (height/ 2) };
                var charge = {
                    default: -50,
                    geo: -8
                };
                var transition = {
                    time: 500
                };
                
                // x-scale
                var xScale = d3.scale.ordinal();
                
                // circle scale
                var cScale = d3.scale.linear();
				
                // set up force layout algorithm
				var force = d3.layout.force()
					.charge(charge.default)
                    //.linkDistance(50)
                    .size([(width - diameter), (height - diameter)]);
                
                // set up svg canvas
                var canvas = d3.select(element[0])
                    .append("svg")
                    .attr({
                        viewBox: "0 0 " + width + " " + height
                    });
                
                /////////////////////////////////////////////
                /////////////// d3 SET-UP END ///////////////
                /////////////////////////////////////////////
                
                // bind data
                scope.$watchGroup(["vizData", "grouping"], function(newData, oldData) {
                    
                    var startGroup = scope.startGroup;
                    
                    // track which group is currently filtered for
                    var currentGroup = startGroup;
                    var subgroups = [];
                        
                    // async check
                    if (newData[0] !== undefined && newData[1] !== undefined) {
						
						function draw(data, groups) {
                            
                            ///////////////////////////////////////////////
                            /////////////// d3 RENDER START ///////////////
                            ///////////////////////////////////////////////
                                                   
                            // map data to c-scale
                            cScale.domain(d3.extent(data, function(d) { return d.count; }));
                            cScale.range([radius, height * 0.5]);
                            
                            // update nodes based on cluster groups
                            function clusterNodes() {
                                
                                // network health
                                contentService.getData("visualization/network/health/").then(function(data) {

                                    // set scope
                                    scope.$parent.healthMetrics = data;

                                });
                                
                                var groupType = this.innerHTML;
                                
                                // check group type
                                if (groupType == "country") {
                                    
                                    // reset force charge so layout is more accurate
                                    force.charge(charge.geo);
                                    
                                } else {
                                    
                                    // reset force to default
                                    force.charge(charge.default);
                                    
                                };
                                
                                force.start();
                                    
                                // non-region specific grouping
                                d3.range(nodes.length).map(function(i) {

                                    // current node
                                    var curr_node = nodes[i];
                                    var group = groupType;
                                    var subgroup = foci[groupType][curr_node.id];

                                    // move into cluster group
                                    curr_node.cluster = group;
                                    curr_node.subgroup = subgroup;

                                    // set coords
                                    curr_node.cx = foci[groupType][subgroup].x;
                                    curr_node.cy = foci[groupType][subgroup].y;

                                });

                                // resume force layout
                                force.resume();	
                                
                                // update labels
                                updateLabels(groupType);
                                
                            };
                            
                            // force layout started
                            function startForce(e) {
                                
                                // update cluster labels
                                updateLabels(currentGroup);
                                
                            };
                            
                            // update cluster labels
                            function updateLabels(group) {
                                
                                // set new group
                                currentGroup = group;
                                
                                groups.forEach(function(d) {
                                    
                                    // check group name
                                    if (d.name == currentGroup) {
                                        
                                        // set new subgroup
                                        subgroups = d.subgroups;
                                        
                                        // add foci coords to object
                                        subgroups.map(function(d) {
                                            d.x = foci[group][d.id].x;
                                            d.y = foci[group][d.id].y * 0.2;
                                        });
                                        
                                    };
                                    
                                });
                                
                                // calc max/min scales
                                var xDomain = subgroups.map(function(d) { return d.name; });
                                
                                // add data to x-scale layout algorithm
                                xScale.domain(xDomain);
                                xScale.rangePoints([radius, width - radius]);
                                
                                // check for group type
                                if (currentGroup == "country") {
                                    
                                    // hide labels so viz is legible
                                    subgroups = [];
                                    
                                };
                                
                                // GROUP LABEL
                                var label = canvas
                                    .selectAll(".group-label")
                                    .data(subgroups);

                                // update selection
                                label
                                    .transition()
                                    .duration(transition.time)
                                    .attr({
                                        class: "group-label",
                                        dx: function(d) { return d.x },
                                        dy: function(d) { return d.y }
                                    })
                                    .text(function(d) { return d.name; });

                                // enter selection
                                label
                                    .enter()
                                    .append("text")
                                    .transition()
                                    .duration(transition.time)
                                    .attr({
                                        class: "group-label",
                                        dx: function(d) { return d.x; },
                                        dy: function(d) { return d.y }
                                    })
                                    .text(function(d) { return d.name; });

                                // exit selection
                                label
                                    .exit()
                                    .transition()
                                    .duration(transition.time)
                                    .remove();
                                
                            };
                            
                            // force ticks
                            function tick(e) {
                                
                                // force direction and shape of clusters
                                var k = e.alpha;

                                // set new node location
                                nodes.forEach(function(o, i) {
									
                                    // get focus x,y values
                                    o.y += (foci[o.cluster][o.subgroup].y - o.y) * k;
                                    o.x += (foci[o.cluster][o.subgroup].x - o.x) * k;
                                                                 
                                });
                                
                                // push nodes toward focus
                                node
                                    .attr({
                                        transform: function(d) { return "translate(" + d.x + "," + d.y + ")"; }
                                    });

                            };
                            
                            // force layout done
                            function endForce(e) {
                                console.log("do something when layout complete");                                
                            };
                                                     
                            // calc circle radius when area is mapped to count
                            function calcRadius(value) {
                                
                                return Math.sqrt(value / Math.PI);
                                
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
                                var cellWidth = width / o.subgroups.length;
								var halfCell = cellWidth / 2;
                                var cursorX = halfCell;
                                
                                // add subgroups to obj
                                o.subgroups.map(function(s) {//console.log(s)
                                    
                                    // check for nulls and do math to figure out new coords
                                    if (s.center_x == null && s.center_y == null) {
                                        
                                        // set coords evenly in the available space
                                        var coords = {};
                                        
                                        coords["x"] = cursorX;
                                        coords["y"] = height / 2;
                                        
                                        cursorX += cellWidth;
                                        
									// default group
                                    } else {
                                    
                                        // nulls mean non-geographic groups
                                        var coords = {};
                                        coords["x"] = s.center_x;
                                        coords["y"] = s.center_y;
                                        
                                        
                                    };
                                    
                                    // add values to use as lookups later
                                    subgroups[s.id] = coords;
                                    
                                    // add nodes as subgroups
                                    s.nodes.map(function(n) {
                                        
                                        // check for null node arrays
                                        // TODO see if endponit can expose empty array vs. null array
                                        if (n !== null) {

                                            subgroups[n.iso] = s.id;
                                            
                                        };
                                        
                                    });
                                    
                                });
                                
                                foci[o.name] = subgroups;
                                
                            });
                            
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
                            
                            // NODE
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
                                            r: function(d) { return cScale(calcRadius(d.count)); }
                                        });
                                    
                                    // label
                                    currentGroup
                                        .append("text")
                                        .attr({
                                            dx: 0,
                                            dy: "0.35em"
                                        })
                                        .text(function(d) { return d.id });
                                });
                                
                        };

                        // update the viz
                        draw(newData[0], newData[1]);
                        
                        /////////////////////////////////////////////
                        /////////////// d3 RENDER END ///////////////
                        /////////////////////////////////////////////
                        
                    };
                    
                });
				
			});
			
		}
		
	};
}]);