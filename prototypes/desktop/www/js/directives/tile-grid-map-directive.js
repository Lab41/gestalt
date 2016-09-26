angular.module("tile-grid-map-directive", [])

.directive("tileGridMap", ["mapboxService", "$timeout", "$rootScope", function(mapboxService, $timeout, $rootScope) {
    return {
        restrict: "E",
        scope: {
            vizData: "=",
            grouping: "=",
            theme: "="
        },
        template: "<div data-tap-disabled='true' style='height: 100%; width: 100%; background: none;'></div>",
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
            var emphasizedGrouping = {};
            var emphasizedValue = "default";
            var emphasizedGroupMembers = [];

            var colorIndex = 0;
            var colorLookup = {};
            var colors = ["#0044CC", "#51A351", "#EC4E20", "#1C3A13", "#1098F7", "#F89406", "#BD362F", "#2E294E", "#6BAA75", "#373F47", "#0088CC", "#000000"]

            // Hard-coded width and height of geographic hexagons
            var dX = 3.4641016151377;
            var dY = 4.0;

            // get mapbox promise
            mapboxService.L().then(function(L) {
                var defaultLayerOpts = {
                    "style": function(feature) {
                        var emphasisClass = emphasizedValue !== "default" && !emphasizedGroupMembers.includes(feature.properties.iso) ? "deemphasizeHex" : "";
                        return {
                            "className": "countryHex defaultHex hex-feature-" + feature.properties.iso + " " + emphasisClass,
                            "color": "#202020"
                        };
                    },
                    "onEachFeature": function(feature, layer) {

                        // set up class name
                        var emphasisClass = emphasizedValue !== "default" && !emphasizedGroupMembers.includes(feature.properties.iso) ? "deemphasizeHex" : "";
                        var className = "defaultHexLabel hex-label-" + feature.properties.iso + " " + emphasisClass;
                        var fontSize = getHexLabelFontSize(map.getZoom());

						// polygon label
                        var icon = L.divIcon({
                            "html": "<span class='" + className + "' style='color:rgba(30,30,30,1.0);font-size:" + fontSize + ";'>" + feature.properties.iso + "</span>"
                        });

						// add polygon label to labels layer
                        L.marker([feature.geometry.coordinates[0][0][1] - (dY/5), feature.geometry.coordinates[0][0][0] - (dX*0.6)], {
                            "icon": icon
                        }).addTo(labelsLayer);

                        var popUpOptions = {
                            maxWidth: 350,
                            minWidth: 300,
                            className: "tile-grid-popup"
                        };

                        // custom popup content
                        var label = feature.properties;
                        var content = "<div class='popup-container'><h3> (" + feature.properties.iso + ") " + label.name + "</h3><hr><ul><li class='popup-item'>" + "test" + "</li><li class='popup-item'>" + "test" + "</li><li class='popup-item'>" + "test" + "</li></ul></div>";

                        // add pop up
                        layer.bindPopup(content, popUpOptions);

                    }

                };

                L.mapbox.accessToken = token;

                // initialize map object
                var map = L.mapbox.map(canvas);

                // use standard non-geographic coordinate system
                map.options.crs = L.CRS.Simple;

                map.on("zoomend", scaleLabels);

                function scaleLabels() {
                    // rescale category labels
                    var labelElements = document.getElementsByClassName("categoryLabel");
                    var newFontSize = getCategoryLabelFontSize(map.getZoom());
                    Array.prototype.forEach.call(labelElements, function (targetElement) {
                        targetElement.style.fontSize = newFontSize;
                    });

                    // rescale hex labels
                    labelElements = document.getElementsByClassName("defaultHexLabel");
                    newFontSize = getHexLabelFontSize(map.getZoom());
                    Array.prototype.forEach.call(labelElements, function (targetElement) {
                        targetElement.style.fontSize = newFontSize;
                    });
                };

                function getCategoryLabelFontSize(zoomLevel) {
                    return 1.2 * (zoomLevel - 2) + "em";
                }

                function getHexLabelFontSize(zoomLevel) {
                    return 1.0 * (zoomLevel - 2) + "em";
                }

                function draw(data, map, interactive, styleUrl) {
                    labelsLayer = L.layerGroup().addTo(map);
                    geoJsonLayer = L.geoJson(data, defaultLayerOpts).addTo(map);

                    // center and zoom map based on markers
                    map.fitBounds(geoJsonLayer.getBounds());
                };

                function emphasizeData() {

                    // Remove deemphasis class from existing map elements
                    var mapElements = document.getElementsByClassName("countryHex");
                    Array.prototype.forEach.call(mapElements, function (targetElement) {
                        targetElement.classList.remove("deemphasizeHex");
                    });
                    mapElements = document.getElementsByClassName("defaultHexLabel");
                    Array.prototype.forEach.call(mapElements, function (targetElement) {
                        targetElement.classList.remove("deemphasizeHex");
                    });

                    if(emphasizedValue !== "default") {
                        // Make a structure for looking up group membership by iso
                        emphasizedGroupMembers = []
                        emphasizedGrouping.subgroups.forEach(function(subgroup) {
                            if(subgroup.name === emphasizedValue) {
                                subgroup.nodes.forEach(function(node) {
                                    if(node !== null) {
                                        if(node.hasOwnProperty('iso')) {
                                            emphasizedGroupMembers.push(node.iso);
                                        } else {
                                            // Just print a little warning
                                            console.log("Node without iso property found!");
                                            console.log(node);
                                        }
                                    }
                                });
                            }
                        });

                        currentData[0].features.forEach(function(feature) {
                            if(!emphasizedGroupMembers.includes(feature.properties.iso)) {
                                // Get feature and label for matching iso
                                var targetFeature = document.getElementsByClassName("hex-feature-" + feature.properties.iso)[0];
                                var targetLabel = document.getElementsByClassName("hex-label-" + feature.properties.iso)[0];

                                // Apply deemphasizeHex class to make features muted
                                targetFeature.classList.add("deemphasizeHex");
                                targetLabel.classList.add("deemphasizeHex");
                            }
                        });
                    }
                };

                function recolorData(grouping) {
                    if(grouping.name !== "default") {
                        // Generate legend data
                        var legendData = {};
                        legendData.name = grouping.name;
                        legendData.legend_lookup = {};
                        legendData.legend_data = [];

                        // Generate lookup structure to quickly
                        // match a node to its group
                        var groupLookup = {};
                        grouping.subgroups.forEach(function(subgroup) {
                            var groupColor = getGroupColor(subgroup.name);
                            legendData.legend_lookup[subgroup.name] = groupColor;
                            legendData.legend_data.push({
                                "name": subgroup.name,
                                "color": groupColor,
                                "count": subgroup.nodes.length
                            });
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
                                var emphasisClass = emphasizedValue !== "default" && !emphasizedGroupMembers.includes(feature.properties.iso) ? "deemphasizeHex" : "";
                                return {
                                    "className": "countryHex coloredHex hex-feature-" + feature.properties.iso + " " + emphasisClass,
                                    "fillColor": legendData.legend_lookup[groupLookup[feature.properties.iso]]
                                };
                            },
                            "onEachFeature": function(feature, layer) {
                                var emphasisClass = emphasizedValue !== "default" && !emphasizedGroupMembers.includes(feature.properties.iso) ? "deemphasizeHex" : "";
                                var className = "defaultHexLabel hex-label-" + feature.properties.iso + " " + emphasisClass;
                                var fontSize = getHexLabelFontSize(map.getZoom());

                                var icon = L.divIcon({
                                    "html": "<span class='" + className + "' style='color:white;font-size:" + fontSize + ";'>" + feature.properties.iso + "</span>"
                                });

                                L.marker([feature.geometry.coordinates[0][0][1] - (dY/5), feature.geometry.coordinates[0][0][0] - (dX*0.6)], {
                                    "icon": icon
                                }).addTo(labelsLayer);

                                // set popup options
                                var popUpOptions = {
                                    offset: L.point(0, 10)
                                };

                                // custom popup content
                                var label = feature.properties;
                                var content = "<p>" + label.name + "</p>";

                                // add pop up
                                layer.bindPopup(content, popUpOptions);
                            }
                        };

                        map.removeLayer(geoJsonLayer);
                        map.removeLayer(labelsLayer);

                        labelsLayer = L.layerGroup().addTo(map);
                        geoJsonLayer = L.geoJson(currentData, customLayerOpts).addTo(map);

                        $rootScope.$broadcast("legendDataChange", { val: legendData });
                    } else {
                        // Clear out custom layer options
                        customLayerOpts = {};

                        map.removeLayer(geoJsonLayer);
                        map.removeLayer(labelsLayer);

                        // Create layers with default layer options
                        labelsLayer = L.layerGroup().addTo(map);
                        geoJsonLayer = L.geoJson(currentData, defaultLayerOpts).addTo(map);

                        $rootScope.$broadcast("legendDataClear");
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

                        var groupSpan = Math.max(225, grouping.subgroups.length * 25);
                        var groupWidth = groupSpan / grouping.subgroups.length;

                        var groupGeoData = {};
                        var groupLookup = {};

                        grouping.subgroups.forEach(function(subgroup, idx) {
                            groupGeoData[idx] = {};
                            groupGeoData[idx].name = subgroup.name;
                            groupGeoData[idx].minX = (-groupSpan/2) + (idx * groupWidth);
                            groupGeoData[idx].maxX = (-groupSpan/2) + ((idx + 1) * groupWidth);
                            groupGeoData[idx].nextX = groupGeoData[idx].minX + (dX / 2);
                            groupGeoData[idx].nextY = 60.0 - (dY / 2);
                            groupGeoData[idx].y = 1;

                            // Make label feature
                            var labelFeature = {
                                "type": "Feature",
                                "geometry": {
                                    "type": "Point",
                                    "coordinates": [groupGeoData[idx].minX, 65.0]
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
                            if(groupGeoData.hasOwnProperty(group)) {
                                var centerX = feature.geometry.coordinates[0][0][0] + (dX / 2);
                                var centerY = feature.geometry.coordinates[0][0][1] + (dY / 4);

                                var deltaX = (centerX - groupGeoData[group].nextX) / STEPS;
                                var deltaY = (centerY - groupGeoData[group].nextY) / STEPS;

                                featureDeltas[feature.properties.iso] = {};
                                featureDeltas[feature.properties.iso].dX = deltaX;
                                featureDeltas[feature.properties.iso].dY = deltaY;

                                groupGeoData[group].nextX += dX;
                                if((groupGeoData[group].nextX + dX) >= (groupGeoData[group].maxX - (dX/3))) {
                                    groupGeoData[group].y += 1;
                                    groupGeoData[group].nextX = groupGeoData[group].minX + ((dX / 2) * (groupGeoData[group].y % 2));
                                    groupGeoData[group].nextY -= dY * 0.75;
                                }
                            }
                        });

                        categoryLabelsLayer = L.geoJson(labelFeatures, {
                            pointToLayer: function(feature, latlng) {
                                var fontSize = getCategoryLabelFontSize(map.getZoom());
                                var icon = L.divIcon({
                                    "html": "<span class='categoryLabel' style='font-size:" + fontSize + ";font-weight:500;'>" + feature.properties.name + "</span>",
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
                        if(featureDeltas.hasOwnProperty(feature.properties.iso)) {
                            feature.geometry.coordinates[0].forEach(function(coordinate) {
                                var deltas = featureDeltas[feature.properties.iso];
                                coordinate[0] = coordinate[0] - deltas.dX;
                                coordinate[1] = coordinate[1] - deltas.dY;
                            });
                        }
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

                    // async check
                    if (newData[0] !== undefined) {

                        currentData = JSON.parse(JSON.stringify(newData[0]));

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
                            console.log(newGrouping);
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
                    if(args.val.action_name === 'emphasize') {
                        // Select grouping based on metric value
                        var groupingName = args.val.metrics[0].name;
                        emphasizedGrouping = scope.grouping.find(function(group) {
                            return group.name === groupingName;
                        });
                        emphasizedValue = args.val.metric_name;

                        emphasizeData();
                    }
                });

            });

        }

    };
}]);
