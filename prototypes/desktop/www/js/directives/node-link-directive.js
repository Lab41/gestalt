angular.module("node-link-directive", [])

.directive("nodeLink", ["d3Service", function(d3Service) {
	return {
		restrict: "E",
		scope: {
			vizData: "=",
			grouping: "=",
            startGroup: "=",
            canvasWidth: "=",
            canvasHeight: "="
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
            var radius = 4;
            var diameter = radius * 2;
            var	center = { "x": (width / 2), "y": (height/ 2) };
            var transition = {
                time: 3000
            };
            
            // get d3 promise
            d3Service.d3().then(function(d3) {
                
                ///////////////////////////////////////////////
                /////////////// d3 SET-UP START ///////////////
                ///////////////////////////////////////////////
				
                // set up force layout algorithm
				var force = d3.layout.force()
					.charge(-150)
                    .linkDistance(50)
                    .size([(width - diameter), (height - diameter)]);
                
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
                scope.$watchGroup(["vizData", "grouping"], function(newData, oldData) {
                    
                    var startGroup = scope.startGroup;
    
                    // async check
                    if (newData[0] !== undefined /*&& newData[1] !== undefined*/) {
						
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
                                /*var subgroups = ["blah", "de", "da"];
                                
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
                                */
                            };
                            
                            // force ticks
                            function tick(e) {
                                
                                // force direction and shape of clusters
                                /*var k = 0.1 * e.alpha;

                                // push nodes toward focus
                                nodes.forEach(function(o, i) {
                                    
                                    // get focus x,y values
                                    o.y += (foci[o.cluster][o.subgroup].y - o.y) * k;
                                    o.x += (foci[o.cluster][o.subgroup].x - o.x) * k;
                                    
                                });*/
                                
                                link
                                    .attr({
                                        x1: function(d) { return d.source.x; },
                                        y1: function(d) { return d.source.y; },
                                        x2: function(d) { return d.target.x; },
                                        y2: function(d) { return d.target.y; }
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
                            
                            // map raw links to d3 index-specific objects for layout algorithm
                            // 3rd param is the connector key in the raw data that connects nodes
                            function mapLinks(links, nodes, key) {
                                
                                var data = [];
                                
                                links.forEach(function(l) {
                                    
                                    // set up the source node
                                    var source = nodes.filter(function(o, i) {
                                        
                                        // add index to obj
                                        // note: d3 replaces any "index" key
                                        o.i = i;
                                        
                                        return o[key] === l.source;
                                        
                                    })[0].i;
                                    
                                    // set up target node
                                    var target = nodes.filter(function(o, i) {
                                        
                                        // add index to obj
                                        // note: d3 replaces any "index" key
                                        o.i = i;
                                        
                                        return o[key] === l.target;
                                        
                                    })[0].i;
                                    
                                    // push to new array
                                    data.push({
                                        source: source,
                                        target: target
                                    });
                                    
                                });
                               
                                return data;
                                
                            };
                            
                            // make foci objects for each group
                            var foci = {};
                            /*groups.map(function(o) {
                                
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
                                var cursorX = cellWidth / 2;
                                
                                // add subgroups to obj
                                o.subgroups.map(function(s) {
                                    
                                    // check for nulls and do math to figure out new coords
                                    if (s.center_x == null && s.center_y == null) {
                                        
                                        // set coords evenly in the available space
                                        var coords = {};
                                        
                                        coords["x"] = cursorX;
                                        coords["y"] = height * 0.25;
                                        
                                        cursorX += cellWidth;
                                        
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
                                
                            });*/
                            
                            // set up nodes/links
                            var nodes = data.nodes;                            
                            var links = mapLinks(data.links, nodes, "name"); // remap links b/c d3 wants use an index to connect nodes
                            
                            // bind data to force layout
                            force
                                .nodes(nodes)
                                .links(links)
                                //.on("start", startForce)
                                .on("tick", tick)
                                //.on("end", endForce)
                                .start();
                            
                            // LINK
                            var link = canvas
                                .selectAll("line")
                                .data(links)
                                .enter()
                                .append("line");
                            
                            // draw node groups
                            var node = canvas
                                .selectAll("circle")
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
                                            dx: "1em",
                                            dy: "0.35em"
                                        })
                                        .text(function(d) { return d.name });
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