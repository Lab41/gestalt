angular.module("dendrogram-directive", [])

.directive("dendrogram", ["d3Service", "$window", function(d3Service, $window){
    return {
        restrict: "E",
        scope: {
            vizData: "=",
            canvasWidth: "=",
            canvasHeight: "=",
            format: "="
        },
        link: function(scope, element, attrs){
            
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
            
            // get the format type
            var format = attrs.format || "linear";
            var isLinear = format == "linear" ? true : false;

            // get d3 promise
            d3Service.d3().then(function(d3) {
                
                ///////////////////////////////////////////////
                /////////////// d3 SET-UP START ///////////////
                ///////////////////////////////////////////////
                
                // set up tree layout
                var tree = d3.layout.tree()
                    .children(function(d) { return d.children; })
                    .separation(function(a, b) { return isLinear ? (a.parent == b.parent ? 1 : 2) : ((a.parent == b.parent ? 1 : 2) / a.depth); });
                
                // radial projection layout
                var diagonal = d3.svg.diagonal.radial()
                    .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });
                
                // create svg canvas
                var canvas = d3.select(domNode)
                    .append("svg")
                    .attr({
                        viewBox: "0 0 " + width + " " + height
                    })
                
                    // add group to be able to manipulate entire structure as a unit
                    .append("g")
                    .attr({
                        transform: isLinear ? "translate(0,0)" : "translate(" + (width / 2) + "," + (width / 2) + ")"
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
                            
                            // get depth level of data
                            getDepth = function (obj) {
                                
                                var depth = 0;
                                
                                // check children
                                if (obj.children) {
                                    
                                    obj.children.forEach(function(d) {
                                        
                                        var tmpDepth = getDepth(d);
                                        
                                        //check temp depth
                                        if (tmpDepth > depth) {
                                            
                                            depth = tmpDepth;
                                            
                                        };
                                        
                                    });
                                    
                                };
                                
                                return 1 + depth;
                            };

                            var depth = getDepth(data);
                            
                            // construct the svg path for a link
                            function elbow(d, i) {
                                return "M" + d.source.y + "," + d.source.x + "H" + d.target.y + "V" + d.target.x + (d.target.children ? "" : "h" + ((width / depth) / 2));
                            };
                            
                            // add data specific values to layout algorithm
                            tree.size([isLinear ? height : 360, isLinear ? (width - (width / depth)) : (((width / 2) * 0.8) - depth)]);
                            var nodes = tree.nodes(data);
                            
                            // set selection
                            var link = canvas
                                .selectAll(".link")
                                .data(tree.links(nodes));
                            
                            // enter selection
                            link
                                .enter()
                                .append("path")
                                .attr({
                                    class: "link",
                                    d: isLinear ? elbow : diagonal
                                });
                            
                            // set selection
                            var node = canvas
                                .selectAll(".node")
                                .data(nodes);
                            
                            // enter selection
                            node
                                .enter()
                                .append("g")
                                .attr({
                                    class: "node",
                                    transform: function(d) { return isLinear ? "translate(" + d.y + "," + d.x + ")" : "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; }
                                })
                            
                                .each(function(node) {
                                
                                    var currentNode = d3.select(this);
                                
                                    // check format for label placement
                                    if (isLinear) {
                                
                                        // name label
                                        currentNode
                                            .append("text")
                                            .attr({
                                                class: "label-name",
                                                x: 8,
                                                y: -8
                                            })
                                            .text(node.name);

                                        // type label
                                        /*currentNode
                                            .append("text")
                                            .attr({
                                                class: "label-type",
                                                x: 8,
                                                dy: 18
                                            })
                                            .text(node.type);*/
                                        
                                    } else {
                                        
                                        // name label
                                        currentNode
                                            .append("text")
                                            .attr({
                                                class: "label-name",
                                                dy: ".31em",
                                                "text-anchor": node.x < 180 ? "start" : "end",
                                                transform: node.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"
                                            })
                                            .text(node.name);
                                        
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