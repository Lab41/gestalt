angular.module("voronoi-diagram-directive", [])

.directive("voronoiDiagram", ["d3Service", "$interval", function(d3Service, $interval) {
	return {
		restrict: "E",
		scope: {
			vizData: "=",
            canvasWidth: "=",
            canvasHeight: "="
		},
        template: "<div><p style='position: absolute; font-size: 3em; top: -150px; right: 1em;'>$0.00</p</div>",
		link: function(scope, element, attrs) {
            
            // set up the dom node to attach the d3 to
            // this could be any valid d3 selector like a class
            var domNode = element[0];
            
            // set sizes from attributes in html element
            // if not attributes present - use default
            var width = parseInt(attrs.canvasWidth) || 700;
            var height = parseInt(attrs.canvasHeight) || width;
            
            // set other layout attributes
			
			// get d3 promise
			d3Service.d3().then(function(d3) {
                
                ///////////////////////////////////////////////
                /////////////// d3 SET-UP START ///////////////
                ///////////////////////////////////////////////

                // create svg canvas
                var canvas = d3.select(domNode)
                    .append("svg")
                    .attr({
                        viewBox: "0 0 " + width + " " + height
                    });
                var filter = canvas.append("defs")
                  .append("filter")
                    .attr("id", "blur")
                  .append("feGaussianBlur")
                    .attr("stdDeviation", 5);
                
                var sites = d3.range(100)
                    .map(function(d) { return [Math.random() * width, Math.random() * height]; });
                var voronoi = d3.geom.voronoi()
                    .x(function(d) { return d[0]; })
                    .y(function(d) { return d[1]; })
                    .clipExtent([[0, 0], [width, height]]);
                
               var polygon = canvas.selectAll("path")
                    .data(voronoi(sites)) 
                    .enter().append("path")
                    .attr("d", function(d, i) { return "M" + d.join("L") + "Z"; })
                    .datum(function(d, i) { return d.point; })

                /*var polygon = canvas.append("g")
                    .attr("class", "polygons")
                  .selectAll("path")
                  .data(voronoi.polygons(sites))
                  .enter().append("path")
                    .call(redrawPolygon);*/

                var link = canvas.append("g")
                    .attr("class", "links")
                  .selectAll("line")
                  .data(voronoi.links(sites))
                  .enter().append("line")
                .style("stroke", function(d, i) { return i % 8 == 0 ? "#ff5800" : "#8d8d8d"; })
                .style("stroke-width", function(d, i) { return i % 8 == 0 ? Math.random() * 10 : "#8d8d8d"; })
                    .call(redrawLink);
        
               /*var line = d3.svg.line();
                 var path = canvas
                  .selectAll(".animate")
                  .data(voronoi.links(sites))
                  .enter().append("path")
                 .attr("d", line(voronoi.links(sites)[0]));
                
                var totalLength = path.node().getTotalLength();

                path
                  .attr("stroke-dasharray", totalLength + " " + totalLength)
                  .attr("stroke-dashoffset", totalLength)
                  .transition()
                    .duration(2000)
                    .ease("linear")
                    .attr("stroke-dashoffset", 0);*/

                var site = canvas.append("g")
                    .attr("class", "sites")
                  .selectAll("circle")
                  .data(sites)
                  .enter().append("circle")
                    .attr("r", 2.5)
                .attr("filter", "url(#blur)")
                    .call(redrawSite);
                
                canvas.append("g")
                    .attr("class", "sites")
                  .selectAll("circle")
                  .data(sites)
                  .enter().append("circle")
                    .attr("r", 5)
                .attr("filter", function(d, i) { return i % 8 == 0 ? "" : "url(#blur)"; })
                .style("fill", function(d, i) { return i % 8 == 0 ? "#ff5800" : "#8d8d8d"; })
                    .call(redrawSite);
                
                function moved() {
                    var track = 0;
                    var polygons = [
                        [width/2, height/2],
                        [300,300],
                        [400,400],
                        [310,350],
                        [400,510]
                    ]
                    var myVar = setInterval(function(){ myTimer() }, 1000);

                    setTimeout(function() {
                        myStopFunction();
                    },7000)

                function myTimer() {
                    sites[0] = polygons[track]//d3.mouse(this);
                  redraw();
                    track++
                }

                function myStopFunction() {
                    clearInterval(myVar);
                }

                }

                function redraw() {
                  var diagram = voronoi(sites);
                  polygon = polygon.data(diagram.polygons()).call(redrawPolygon);
                  link = link.data(diagram.links()), link.exit().remove();
                  link = link.enter().append("line").merge(link).call(redrawLink);
                  site = site.data(sites).call(redrawSite);
                }

                function redrawPolygon(polygon) {
                  polygon
                      .attr("d", function(d) { return d ? "M" + d.join("L") + "Z" : null; });
                }

                function redrawLink(link) {
                  link
                      .attr("x1", function(d) { return d.source[0]; })
                      .attr("y1", function(d) { return d.source[1]; })
                      .attr("x2", function(d) { return d.target[0]; }).transition().duration(1500).attr({x2: 400,y2: 15})
                      .attr("y2", function(d) { return d.target[1]; }).transition().duration(1500).attr({x2: 400,y2: 15});
                
                }

                function redrawSite(site) {
                  site
                      .attr("cx", function(d) { return d[0]; })
                      .attr("cy", function(d) { return d[1]; });
                }
                
                /////////////////////////////////////////////
                /////////////// d3 SET-UP END ///////////////
                /////////////////////////////////////////////
				
			});
			
		}
		
	};
    
}]);