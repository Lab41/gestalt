angular.module("tile-grid-map-directive", [])

.directive("tileGridMap", ["mapboxService", "$timeout", "$rootScope", function(mapboxService, $timeout, $rootScope) {
	return {
		restrict: "E",
		scope: {
			vizData: "=",
            grouping: "=",
			theme: "="
		},
		template: "<div data-tap-disabled='true' style='height: 700px; width: 100%; background: none; margin-top:1em;'></div>",
		link: function(scope, element, attrs) {
			
			var canvas = element.find("div")[0];
			var token = mapbox_config.token;
			var radius = 7;
			var blur = 1;
			var opacity = 0.5;
            var interactivity = true;
            var map = {};
            var geoJsonLayer = {};
            var currentData = {};
					
            // get mapbox promise
            mapboxService.L().then(function(L) {

                var circleMarker = {
                    radius: 5,
                    fillOpacity: opacity,
                    stroke: false
                };

                L.mapbox.accessToken = token;

                // initialize map object
                var map = L.mapbox.map(canvas);

                // use standard non-geographic coordinate system
                map.options.crs = L.CRS.Simple;

                function draw(data, map, interactive, styleUrl) {console.log(data);

                    // style url
                    var style = mapbox_config.style[styleUrl];

                    // add style
                    //L.mapbox.styleLayer(style).addTo(map);

                    geoJsonLayer = L.geoJson(data/*, {

                        // modify color
                        style: function(feature) {

                        },

                        // add labels
                        onEachFeature: function (feature, layer) {

                            // set popup options
                            var popUpOptions = {
                                offset: L.point(0, 10)
                            };

                            // custom popup content
                            var label = feature.properties;
                            var content = "<p>" + label.name + "</p>";

                            // add pop up
                            layer.bindPopup(content, popUpOptions);

                            // add polygon label
                            L.marker(layer.getBounds().getCenter(), {
                                icon: L.divIcon({
                                    html: "<p>" + feature.properties.iso + "</p>",
                                    iconSize: [20,20]
                                })
                            }).addTo(map);

                        }

                    }*/).addTo(map);

                    // center and zoom map based on markers
                    map.fitBounds(geoJsonLayer.getBounds());
                };

                function regroupData(grouping) {
                    

                    var featureDeltas = {};
                    var STEPS = 10;

                    // Hard-coded width and height of geographic hexagons
                    var dX = 3.4641016151377;
                    var dY = 4.0;

                    // Cook the data for the selected group
                    if(grouping.name !== 'default') {
                        var groupWidth = 270.0 / grouping.subgroups.length;

                        var groupGeoData = {};
                        var groupLookup = {};

                        grouping.subgroups.forEach(function(subgroup, idx) {
                            groupGeoData[idx] = {};
                            groupGeoData[idx].name = subgroup.name;
                            groupGeoData[idx].minX = -135.0 + (idx * groupWidth);
                            groupGeoData[idx].maxX = -135.0 + ((idx + 1) * groupWidth);
                            groupGeoData[idx].nextX = groupGeoData[idx].minX + (dX / 2);
                            groupGeoData[idx].nextY = 60.0 - (dY / 2);


                            subgroup.nodes.forEach(function(node) {
                                if(node !== null) {
                                    if(node.hasOwnProperty('iso')) {
                                        groupLookup[node.iso] = idx;
                                    } else {
                                        // Just print a little warning
                                        console.log("Node without iso property found!");
                                        console.log(node);
                                    }
                                }
                            });
                        });

                        // Calculate centroid of existing feature
                        currentData[0].features.forEach(function(feature) {
                            var group = groupLookup[feature.properties.iso];
                            var centerX = feature.geometry.coordinates[0][0][0] + (dX / 2);
                            var centerY = feature.geometry.coordinates[0][0][1] + (dY / 4);

                            var deltaX = (centerX - groupGeoData[group].nextX) / STEPS;
                            var deltaY = (centerY - groupGeoData[group].nextY) / STEPS;

                            featureDeltas[feature.properties.iso] = {};
                            featureDeltas[feature.properties.iso].dX = deltaX;
                            featureDeltas[feature.properties.iso].dY = deltaY;

                            groupGeoData[group].nextX += dX;
                            if((groupGeoData[group].nextX + dX) >= groupGeoData[group].maxX) {
                                groupGeoData[group].nextX = groupGeoData[group].minX + (dX / 2);
                                groupGeoData[group].nextY -= dY;
                            }
                        });
                    } else {
                        var targetLocs = {};
                        console.log(scope.vizData);
                        scope.vizData[0].features.forEach(function(feature) {
                            targetLocs[feature.properties.iso] = {};
                            targetLocs[feature.properties.iso].x = feature.geometry.coordinates[0][0][0] + (dX / 2);
                            targetLocs[feature.properties.iso].y = feature.geometry.coordinates[0][0][1] + (dY / 4);
                        });
                        console.log(targetLocs);

                        currentData[0].features.forEach(function(feature) {
                            var centerX = feature.geometry.coordinates[0][0][0] + (dX / 2);
                            var centerY = feature.geometry.coordinates[0][0][1] + (dY / 4);

                            var deltaX = (centerX - targetLocs[feature.properties.iso].x) / STEPS;
                            var deltaY = (centerY - targetLocs[feature.properties.iso].y) / STEPS;

                            featureDeltas[feature.properties.iso] = {};
                            featureDeltas[feature.properties.iso].dX = deltaX;
                            featureDeltas[feature.properties.iso].dY = deltaY;
                        });
                    }

                    drawStep(currentData, featureDeltas, 1, STEPS);
                };

                function drawStep(data, featureDeltas, currentStep, maxSteps) {
                    data[0].features.forEach(function(feature) {
                        feature.geometry.coordinates[0].forEach(function(coordinate) {
                            var deltas = featureDeltas[feature.properties.iso];
                            coordinate[0] = coordinate[0] - deltas.dX;
                            coordinate[1] = coordinate[1] - deltas.dY;
                        });
                    });
                    map.removeLayer(geoJsonLayer);
                    geoJsonLayer = L.geoJson(data).addTo(map);

                    currentStep += 1;
                    if(currentStep <= maxSteps) {
                        $timeout(function() {
                            drawStep(data, featureDeltas, currentStep, maxSteps);
                        }, 10);
                    } else {
                        map.fitBounds(geoJsonLayer.getBounds());
                    }
                }

                // bind data
                scope.$watchGroup(["vizData", "theme"], function(newData, oldData) {
                    currentData = JSON.parse(JSON.stringify(newData[0]));

                    // async check
                    if (newData[0] !== undefined) {

                        draw(currentData, map, interactivity, newData[1]);

                    };
                });
                
                // watch for story idea changes
                $rootScope.$on("mapStoryIdeaChange", function(event, args) {
                    if(args.val.action_name === 'cluster') {
                        // Based on the selected arg apply new grouping
                        var newGrouping = scope.grouping.find(function(group) {
                            return group.name === args.val.control_name;
                        });
                        if(newGrouping !== undefined) {
                            regroupData(newGrouping);
                        }
                    }
                });

            });

        }

    };
}]);
