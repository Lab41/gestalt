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
            var labelsLayer = {};
            var categoryLabelsLayer = {};
            var currentData = {};
            var customLayerOpts = {};

            var colorIndex = 0;
            var colorLookup = {};
            var colors = ["#0044CC", "#51A351", "#EC4E20", "#1C3A13", "#1098F7", "#F89406", "#BD362F", "#2E294E", "#6BAA75", "#373F47", "#0088CC"]
		      
            // Hard-coded width and height of geographic hexagons
            var dX = 3.4641016151377;
            var dY = 4.0;

            // get mapbox promise
            mapboxService.L().then(function(L) {
                var defaultLayerOpts = {
                    "style": function(feature) {
                        return {
                            "className": "countryHex defaultHex",
                            "color": "#202020"
                        };
                    },
                    "onEachFeature": function(feature) {
                        var icon = L.divIcon({
                            "className": "defaultHexLabel",
                            "html": "<span style='color:rgba(30,30,30,1.0);'>" + feature.properties.iso + "</span>",
                        });
                        console.log(feature.geometry.coordinates);

                        L.marker([feature.geometry.coordinates[0][0][1] - (dY/10), feature.geometry.coordinates[0][0][0] - (dX/1.8)], {
                            "icon": icon
                        }).addTo(labelsLayer);
                    }
                };

                L.mapbox.accessToken = token;

                // initialize map object
                map = L.mapbox.map(canvas);
                
				// use standard non-geographic coordinate system
                map.options.crs = L.CRS.Simple;
                
                function draw(data, map, interactive, styleUrl) {
                    labelsLayer = L.layerGroup().addTo(map);
                    geoJsonLayer = L.geoJson(data, defaultLayerOpts).addTo(map);

                    // center and zoom map based on markers
                    map.fitBounds(geoJsonLayer.getBounds());
                };

                function recolorData(grouping) {
                    if(grouping.name !== "default") {
                        // Generate lookup structure to quickly
                        // match a node to its group
                        var groupLookup = {};
                        grouping.subgroups.forEach(function(subgroup) {
                            subgroup.nodes.forEach(function(node) {
                                if(node !== null) {
                                    if(node.hasOwnProperty('iso')) {
                                        groupLookup[node.iso] = subgroup.name;
                                    } else {
                                        // Just print a little warning
                                        console.log("Node without iso property found!");
                                        console.log(node);
                                    }
                                }
                            });
                        });

                        customLayerOpts = {
                            "style": function(feature) {
                                return {
                                    "className": "countryHex coloredHex",
                                    "fillColor": getGroupColor(groupLookup[feature.properties.iso])
                                };
                            },
                            "onEachFeature": function(feature) {
                                var icon = L.divIcon({
                                    "className": "defaultHexLabel",
                                    "html": "<span style='color:white;'>" + feature.properties.iso + "</span>",
                                });

                                L.marker([feature.geometry.coordinates[0][0][1] - (dY/5), feature.geometry.coordinates[0][0][0] - (dX/1.7)], {
                                    "icon": icon
                                }).addTo(labelsLayer);
                            }
                        };

                        map.removeLayer(geoJsonLayer);
                        map.removeLayer(labelsLayer);

                        labelsLayer = L.layerGroup().addTo(map);
                        geoJsonLayer = L.geoJson(currentData, customLayerOpts).addTo(map);
                    } else {
                        // Clear out custom layer options
                        customLayerOpts = {};

                        map.removeLayer(geoJsonLayer);
                        map.removeLayer(labelsLayer);

                        // Create layers with default layer options
                        labelsLayer = L.layerGroup().addTo(map);
                        geoJsonLayer = L.geoJson(currentData, defaultLayerOpts).addTo(map);
                    }
                }

                function getGroupColor(groupId) {
                    if(colorLookup.hasOwnProperty(groupId)) {
                        return colorLookup[groupId];
                    } else {
                        colorLookup[groupId] = colors[(colorIndex % colors.length)];
                        colorIndex += 1;

                        return colorLookup[groupId];
                    }
                }

                function regroupData(grouping) {

                    var featureDeltas = {};
                    var STEPS = 10;

                    map.removeLayer(categoryLabelsLayer);

                    // Cook the data for the selected group
                    if(grouping.name !== 'default') {
                        var labelFeatures = {
                            "type": "FeatureCollection",
                            "features": []
                        };

                        var groupWidth = 150.0 / grouping.subgroups.length;

                        var groupGeoData = {};
                        var groupLookup = {};

                        grouping.subgroups.forEach(function(subgroup, idx) {
                            groupGeoData[idx] = {};
                            groupGeoData[idx].name = subgroup.name;
                            groupGeoData[idx].minX = -75.0 + (idx * groupWidth);
                            groupGeoData[idx].maxX = -75.0 + ((idx + 1) * groupWidth);
                            groupGeoData[idx].nextX = groupGeoData[idx].minX + (dX / 2);
                            groupGeoData[idx].nextY = 60.0 - (dY / 2);

                            // Make label feature
                            var labelFeature = {
                                "type": "Feature",
                                "geometry": {
                                    "type": "Point",
                                    "coordinates": [groupGeoData[idx].minX, 63.0]
                                },
                                "properties": {
                                    "name": subgroup.name
                                }
                            };
                            labelFeatures.features.push(labelFeature);

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

                            groupGeoData[group].nextX += (dX + (dX/5));
                            if((groupGeoData[group].nextX + dX) >= groupGeoData[group].maxX) {
                                groupGeoData[group].nextX = groupGeoData[group].minX + (dX / 2);
                                groupGeoData[group].nextY -= (dY + (dY/6));
                            }
                        });

                        categoryLabelsLayer = L.geoJson(labelFeatures, {
                            pointToLayer: function(feature, latlng) {
                                var icon = L.divIcon({
                                    "html": "<span style='font-size:2em;font-weight:700;'>" + feature.properties.name + "</span>",
                                });

                                return L.marker(latlng, {
                                    "icon": icon
                                });
                            }
                        }).addTo(map);
                    } else {
                        var targetLocs = {};
                        scope.vizData[0].features.forEach(function(feature) {
                            targetLocs[feature.properties.iso] = {};
                            targetLocs[feature.properties.iso].x = feature.geometry.coordinates[0][0][0] + (dX / 2);
                            targetLocs[feature.properties.iso].y = feature.geometry.coordinates[0][0][1] + (dY / 4);
                        });

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
                    map.removeLayer(labelsLayer);

                    // Use custom options if they exists, otherwise use default
                    var layerOpts = Object.keys(customLayerOpts).length === 0 ? defaultLayerOpts : customLayerOpts;

                    labelsLayer = L.layerGroup().addTo(map);
                    geoJsonLayer = L.geoJson(data, layerOpts).addTo(map);

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
                    console.log(args.val);
                    if(args.val.action_name === 'cluster') {
                        // Based on the selected arg apply new grouping
                        var newGrouping = scope.grouping.find(function(group) {
                            return group.name === args.val.control_name;
                        });
                        if(newGrouping !== undefined) {
                            regroupData(newGrouping);
                        }
                    }
                    if(args.val.action_name === 'color') {
                        // Based on the selected arg apply new grouping
                        var newGrouping = scope.grouping.find(function(group) {
                            return group.name === args.val.control_name;
                        });
                        if(newGrouping !== undefined) {
                            recolorData(newGrouping);
                        }
                    }
                });

            });
			
		}
		
	};
}]);