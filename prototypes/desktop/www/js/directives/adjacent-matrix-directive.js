angular.module("adjacent-matrix-directive", [])

.directive("adjacentMatrix", ["d3Service", function(d3Service){
    return {
        restrict: "E",
        scope: {
            vizData: "=",
            canvasWidth: "=",
            canvasHeight: "=",
        },
        link: function(scope, element, attrs){
            
            //get d3 promise
            d3Service.d3().then(function(d3) {
                
                // set sizes from attributes in html element
                // if not attributes present - use default
                var width = parseInt(attrs.canvasWidth) || 500;
                var height = parseInt(attrs.canvasHeight) || 500;
                                
                // create sv canvas
                var canvas = d3.select(element[0])
                    .append("svg")
                    .attr({
                        viewBox: "0 0 " + width + " " + height
                    });
				
                // check for new data
                scope.$watch("vizData", function(newData, oldData) {
					//console.log("--------------------- watch triggered ---------------------");
                    //console.log("------- old data -------"); console.log(oldData);
                    //console.log("------- new data -------"); console.log(newData);
                    
                    // async check
                    if (newData !== undefined) {console.log(newData);
                    
                        // check new vs old
                        //var isMatching = angular.equals(newData, oldData);

                        // if false
                        //if (!isMatching) {

                            // update the viz
                            draw(newData);

                        //};
                        
                        function draw(data) {//console.log(data);

                            var x = d3.scale.ordinal().rangeBands([0, width]),
                                z = d3.scale.linear().domain([0, 4]).clamp(true),
                                c = d3.scale.category10().domain(d3.range(10));
                           
                            var color = ["orange", "teal", "grey", "#5ba819"];

                            var matrix = [],
                              nodes = data.nodes,
                              n = nodes.length;
                            var links = data.links;

  // Compute index per node.
  nodes.forEach(function(node, i) {
    node.index = i;
    node.count = 0;
    matrix[i] = d3.range(n).map(function(j) { return {x: j, y: i, z: 0}; });
  });
                            
                                        var edges = [];
links.forEach(function(e) {
    
    function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};
    var sourceNode = nodes.filter(function(n) {
        return n.name === e.source;
    })[0].name;
        var targetNode = nodes.filter(function(n) {
            return n.name === e.target;
        })[0].name;

    edges.push({
        source: getRandomInt(0, nodes.length - 1),
        target: getRandomInt(0, nodes.length - 1)
    });
});
                            
                            links = edges;

  // Convert links to matrix; count occurrences.
  links.forEach(function(link) {
    matrix[link.source][link.target].z += link.value;
    matrix[link.target][link.source].z += link.value;
    matrix[link.source][link.source].z += link.value;
    matrix[link.target][link.target].z += link.value;
    nodes[link.source].count += link.value;
    nodes[link.target].count += link.value;
  });

  // Precompute the orders.
  var orders = {
    name: d3.range(n).sort(function(a, b) { return d3.ascending(nodes[a].name, nodes[b].name); }),
    count: d3.range(n).sort(function(a, b) { return nodes[b].count - nodes[a].count; }),
    group: d3.range(n).sort(function(a, b) { return nodes[b].group - nodes[a].group; })
  };

  // The default sort order.
  x.domain(orders.name);
                            
                            function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};
                            
                            // background to create faux grid
                            canvas
                                .append("rect")
                                .attr({
                                    height: height,
                                    width: width
                                });
console.log(matrix);
  var row = canvas.selectAll(".row")
      .data(matrix)
    .enter().append("g")
      .attr("class", "row")
      .attr("transform", function(d, i) { return "translate(0," + x(i) + ")"; })
      .each(row);

  row.append("line")
      .attr("x2", width);

                            
  row.append("text")
      .attr("x", 0)
      .attr("y", x.rangeBand() / 2)
      .attr("dy", ".32em")
      .attr("text-anchor", "start")
      .text(function(d, i) { return nodes[i].name; });

  var column = canvas.selectAll(".column")
      .data(matrix)
    .enter().append("g")
      .attr("class", "column")
      .attr("transform", function(d, i) { return "translate(" + x(i) + ")rotate(-90)"; });

  column.append("line")
      .attr("x1", -width);
                            
                            

  column.append("text")
      .attr("x", -80)
      .attr("y", 50)
      .attr("dy", ".32em")
      .attr("text-anchor", "start")
      .text(function(d, i) { return nodes[i].name; });


  function row(row) {
    var cell = d3.select(this)//.selectAll(".cell")
        //.data(row.filter(function(d) { return d.z; }))
      //.enter()
    .append("rect")
        .attr("class", "cell")
        .attr("x", function(d) { return x(d.x); })
        .attr("width", x.rangeBand())
        .attr("height", x.rangeBand())
        .style("fill-opacity", function(d) { return z(d.z); })
        .style("fill", /*function(d) { return nodes[d.x].group == nodes[d.y].group ?*/ "currentColor" /*: null; }*/)
        .on("mouseover", mouseover)
        .on("mouseout", mouseout);
  }

  function mouseover(p) {
    d3.selectAll(".row text").classed("active", function(d, i) { return i == p.y; });
    d3.selectAll(".column text").classed("active", function(d, i) { return i == p.x; });
  }

  function mouseout() {
    d3.selectAll("text").classed("active", false);
  }

                            /* change order */
                            /*
  d3.select("#order").on("change", function() {
    clearTimeout(timeout);
    order(this.value);
  });

  function order(value) {
    x.domain(orders[value]);

    var t = canvas.transition().duration(2500);

    t.selectAll(".row")
        .delay(function(d, i) { return x(i) * 4; })
        .attr("transform", function(d, i) { return "translate(0," + x(i) + ")"; })
      .selectAll(".cell")
        .delay(function(d) { return x(d.x) * 4; })
        .attr("x", function(d) { return x(d.x); });

    t.selectAll(".column")
        .delay(function(d, i) { return x(i) * 4; })
        .attr("transform", function(d, i) { return "translate(" + x(i) + ")rotate(-90)"; });
  }*/

                            /*
  var timeout = setTimeout(function() {
    order("group");
    d3.select("#order").property("selectedIndex", 2).node().focus();
  }, 5000);*/



                        };
                        
                    };
                    
                });       
                
            });
            
        }
    }
    
}]);