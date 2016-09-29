angular.module("tile-grid-map-directive", [])

.directive("tileGridMap", ["mapboxService", "$compile", "$timeout", "$rootScope", function(mapboxService, $compile, $timeout, $rootScope) {
    return {
        restrict: "E",
        scope: {
            vizData: "=",
            grouping: "=",
            boundaries: "=",
            theme: "="
        },
        template: "<div><div data-tap-disabled='true' style='height: 800px; width: 100%; background: none;'></div></div>",
        link: function(scope, element, attrs) {

            var canvas = element.find("div")[1];
            var token = mapbox_config.token;
            var radius = 7;
            var blur = 1;
            var opacity = 0.5;
            var interactivity = true;
            var map = {};
            var boundsLayer = {};
            var geoJsonLayer = {};
            var labelsLayer = {};
            var categoryLabelsLayer = {};
            var currentData = {};
            var customLayerOpts = {};
            var emphasizedGrouping = {};
            var emphasizedGroupMembers = [];
            var sortingGroupGeoData = {};
            var sortingGroupLookup = {};
            var colorGroupLookup = {};
            var currentSortGrouping = {};

            // Hard-coded width and height of geographic hexagons
            var dX = 3.4641016151377;
            var dY = 4.0;

            // get mapbox promise
            mapboxService.L().then(function(L) {
                var defaultLayerOpts = {
                    "style": function(feature) {
                        var emphasisClass = emphasizedGrouping.hasOwnProperty("name") && emphasizedGrouping.name !== "default" && !emphasizedGroupMembers.includes(feature.properties.iso) ? "deemphasizeHex" : "";
                        return {
                            "className": "countryHex defaultHex hex-feature-" + feature.properties.iso + " " + emphasisClass
                        };
                    },
                    "onEachFeature": function(feature, layer) {

                        // set up class name
                        var emphasisClass = emphasizedGrouping.hasOwnProperty("name") && emphasizedGrouping.name !== "default" && !emphasizedGroupMembers.includes(feature.properties.iso) ? "deemphasizeHex" : "";
                        var className = "defaultHexLabel hex-label-" + feature.properties.iso + " " + emphasisClass;
                        var fontSize = getHexLabelFontSize(map.getZoom());

						// polygon label
                        var icon = L.divIcon({
                            "html": "<p class='" + className + "' style='font-size:" + fontSize + ";'>" + feature.properties.iso + "</p>"
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

                        // add pop up
                        layer.bindPopup(getPopupHTML(feature), popUpOptions);

                    }

                };

                var boundaryLayerOpts = {
                    "style": {
                        "stroke": true,
                        "weight": 1,
                        "opacity": 0.5,
                        "fill": false,
                        "className": "boundaryPolygon"
                    }
                };

                // Initialize the map
                L.mapbox.accessToken = token;
                var map = L.mapbox.map(canvas);
                map.options.crs = L.CRS.Simple;
                map.options.minZoom = 2;
                map.options.maxZoom = 5;
                map.options.zoom = 3;

                // Dynamically compile and append legend element
                var legendDirective = angular.element("<vis-key class='position-fix'></vis-key>");
                $compile(legendDirective)(scope);
                element.prepend(legendDirective);

                map.on("zoomend", scaleLabels);

                function scaleLabels() {
                    // rescale hex labels
                    labelElements = document.getElementsByClassName("defaultHexLabel");
                    newFontSize = getHexLabelFontSize(map.getZoom());
                    Array.prototype.forEach.call(labelElements, function (targetElement) {
                        targetElement.style.fontSize = newFontSize;
                    });
                };

                function getHexLabelFontSize(zoomLevel) {
                    return 1.0 * (zoomLevel - 2) + "em";
                };

                function addHexLayer(hexData, map) {
                    labelsLayer = L.layerGroup().addTo(map);
                    geoJsonLayer = L.geoJson(hexData, defaultLayerOpts).addTo(map);

                    // center and zoom map based on markers
                    map.fitBounds(geoJsonLayer.getBounds());
                };

                function addBoundaryLayer(boundaryData, map) {
                    boundsLayer = L.geoJson(boundaryData, boundaryLayerOpts).addTo(map);
                };

                function setBoundaryLayerVisiblity(isVisible) {
                    // There's not a default way to show/hide  layer in leaflet
                    // so instead we have to write some css
                    var boundaryPolys = document.getElementsByClassName("boundaryPolygon");

                    // Add/remove 'hidden' class from boundary features based on if you
                    // want them visible or not
                    if(isVisible) {
                        Array.prototype.forEach.call(boundaryPolys, function (boundaryPoly) {
                            boundaryPoly.classList.remove("hidden");
                        });
                    } else {
                        Array.prototype.forEach.call(boundaryPolys, function (boundaryPoly) {
                            boundaryPoly.classList.add("hidden");
                        });
                    }
                };

                function getPopupHTML(feature) {
                   return "<div class='popup-container'><h3>(" + feature.properties.iso + ") " + feature.properties.name + "</h3><hr><ul>" + getAttributesHTML(feature) + "</ul></div>";
                };

                function getAttributesHTML(feature) {
                    var listItems = "";
                    if(feature.properties.hasOwnProperty("sortBy") && Object.keys(feature.properties.sortBy).length > 0) {
                        listItems += "<li class='popup-item'><strong>" + feature.properties.sortBy.grouping + ":</strong>&nbsp;" + feature.properties.sortBy.subgroup + "</li>"
                    }

                    if(feature.properties.hasOwnProperty("colorBy") && Object.keys(feature.properties.colorBy).length > 0) {
                        listItems += "<li class='popup-item'><strong>" + feature.properties.colorBy.grouping + ":</strong>&nbsp;" + feature.properties.colorBy.subgroup + "<svg xmlns='http://www.w3.org/2000/svg' width='2em' height='1em'><rect fill='" + feature.properties.colorBy.color + "' width='2em' height='1em'/></svg></li>";
                    }

                    return listItems;
                }

                function emphasizeData(grouping) {

                    // Remove deemphasis class from existing map elements
                    var mapElements = document.getElementsByClassName("countryHex");
                    Array.prototype.forEach.call(mapElements, function (targetElement) {
                        targetElement.classList.remove("deemphasizeHex");
                    });
                    mapElements = document.getElementsByClassName("defaultHexLabel");
                    Array.prototype.forEach.call(mapElements, function (targetElement) {
                        targetElement.classList.remove("deemphasizeHex");
                    });

                    if(grouping.name !== "default") {
                        emphasizedGrouping = grouping;

                        // Make a structure for looking up group membership by iso
                        emphasizedGroupMembers = []
                        emphasizedGrouping.subgroups.forEach(function(subgroup) {
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
                    } else {
                        emphasizedGrouping = {};
                    }
                };

                function recolorData(grouping) {

                    colorGroupLookup = {};

                    if(grouping.name !== "default") {
                        // Generate legend data
                        var legendData = {};
                        legendData.name = grouping.name;
                        legendData.legend_lookup = {};
                        legendData.legend_data = [];

                        // Generate lookup structure to quickly
                        // match a node to its group
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
                                        colorGroupLookup[node.iso] = subgroup.name;
                                    } else {
                                        // Just print a little warning
                                        console.log("Node without iso property found!");
                                        console.log(node);
                                    }
                                }
                            });
                        });

                        // Setup layer options for custom rendering based on color group
                        customLayerOpts = {
                            "style": function(feature) {
                                var emphasisClass = emphasizedGrouping.hasOwnProperty("name") && emphasizedGrouping.name !== "default" && !emphasizedGroupMembers.includes(feature.properties.iso) ? "deemphasizeHex" : "";
                                return {
                                    "className": "countryHex coloredHex hex-feature-" + feature.properties.iso + " " + emphasisClass,
                                    "fillColor": legendData.legend_lookup[colorGroupLookup[feature.properties.iso]]
                                };
                            },
                            "onEachFeature": function(feature, layer) {
                                var emphasisClass = emphasizedGrouping.hasOwnProperty("name") && emphasizedGrouping.name !== "default" && !emphasizedGroupMembers.includes(feature.properties.iso) ? "deemphasizeHex" : "";
                                var className = "defaultHexLabel hex-label-" + feature.properties.iso + " " + emphasisClass;
                                var fontSize = getHexLabelFontSize(map.getZoom());

                                var icon = L.divIcon({
                                    "html": "<span class='" + className + "' style='color:white;font-size:" + fontSize + ";'>" + feature.properties.iso + "</span>"
                                });

                                L.marker([feature.geometry.coordinates[0][0][1] - (dY/5), feature.geometry.coordinates[0][0][0] - (dX*0.6)], {
                                    "icon": icon
                                }).addTo(labelsLayer);

                                var popUpOptions = {
                                    maxWidth: 350,
                                    minWidth: 300,
                                    className: "tile-grid-popup"
                                };

                                // add pop up
                                layer.bindPopup(getPopupHTML(feature), popUpOptions);
                            }
                        };

                        // Attach color data to the features
                        currentData[0].features.forEach(function(feature) {
                            var subgroupName = colorGroupLookup[feature.properties.iso];
                            addColorByProperties(feature, grouping.name, subgroupName, legendData.legend_lookup[subgroupName]);
                        });

                        if(Object.keys(currentSortGrouping).length === 0) {
                            // Data is not sorted into bins, just redraw
                            redraw();
                        } else {
                            // Re-run the entire grouping process with new
                            // color rules
                            regroupData(currentSortGrouping);
                        }

                        // Broadcast update event with new legend data
                        $rootScope.$broadcast("legendDataChange", { val: legendData });
                    } else {
                        // Clear out custom layer options
                        customLayerOpts = {};

                        // Clear out colorBy properties
                        currentData[0].features.forEach(function(feature) {
                            if(feature.properties.hasOwnProperty("colorBy")) {
                                feature.properties.colorBy = {};
                            }
                        });

                        // If data isn't currently grouped just redraw with
                        // new style applied, otherwise regroup data since
                        // no color is set
                        if(Object.keys(currentSortGrouping).length === 0) {
                            redraw();
                        } else {
                            regroupData(currentSortGrouping);
                        }

                        $rootScope.$broadcast("legendDataClear");
                    }
                };

                function addColorByProperties(feature, grouping, subgroup, color) {
                    // Attach selected color grouping and subgroup metadata
                    // to the feature.properties for labeling purposes
                    feature.properties.colorBy = {};
                    feature.properties.colorBy.grouping = grouping;
                    feature.properties.colorBy.subgroup = subgroup;
                    feature.properties.colorBy.color = color;
                };

                function getGroupColor(groupId) {
                    var colorSum = 0;
                    var r = 0;
                    var g = 0;
                    var b = 0;
                    while(colorSum < 75) {
                        r = getRandomColorNumber();
                        g = getRandomColorNumber();
                        b = getRandomColorNumber();
                        colorSum = r + g + b;
                    }

                    return "rgb(" + r + "," + g + "," + b + ")";
                };

                function getRandomColorNumber() {
                    return Math.floor((Math.random() * 255) + 1);
                };

                function regroupData(grouping) {
                    currentSortGrouping  = grouping;
                    sortingGroupGeoData = {};
                    sortingGroupLookup = {};

                    var featureDeltas = {};
                    var STEPS = 10;

                    map.removeLayer(categoryLabelsLayer);

                    // Cook the data for the selected group
                    if(grouping.name !== 'default') {
                        setBoundaryLayerVisiblity(false);

                        var labelFeatures = {
                            "type": "FeatureCollection",
                            "features": []
                        };

                        var startY = 80.0;
                        var groupSpan = Math.min(240, grouping.subgroups.length * 40);
                        var groupWidth = groupSpan / grouping.subgroups.length;
                        var hexesPerRow = Math.floor(Math.abs(groupWidth) / dX) - 1;

                        sortingGroupGeoData = {};

                        if(Object.keys(colorGroupLookup).length !== 0) {

                            var groupColorsMapping = {};

                            grouping.subgroups.forEach(function(subgroup) {
                                groupColorsMapping[subgroup.name] = [];

                                subgroup.nodes.forEach(function(node) {
                                    var colorGroup = colorGroupLookup[node.iso]
                                    var groupname = subgroup.name + "." + colorGroup;
                                    if(!sortingGroupGeoData.hasOwnProperty(groupname)) {
                                        sortingGroupGeoData[groupname] = {};
                                        sortingGroupGeoData[groupname].size = 0;

                                        // Push name of new color group onto group/color mapping structure
                                        groupColorsMapping[subgroup.name].push(colorGroup);
                                    }

                                    sortingGroupGeoData[groupname].size = sortingGroupGeoData[groupname].size + 1;
                                });
                            });

                            // Sort the color groups by alphabetical order, this affects
                            // how the end up beind displayed
                            Object.keys(groupColorsMapping).forEach(function(key) {
                                groupColorsMapping[key].sort();
                            });

                            Object.keys(sortingGroupGeoData).forEach(function(key) {
                                sortingGroupGeoData[key].numRows = Math.ceil(sortingGroupGeoData[key].size / hexesPerRow);
                            });

                            grouping.subgroups.forEach(function(subgroup, idx) {
                                var currentY = startY;
                                var startX = (-groupSpan/2) + (idx * groupWidth);

                                groupColorsMapping[subgroup.name].forEach(function(colorGroup) {
                                    var groupname = subgroup.name + "." + colorGroup;

                                    // Generate a label for this group
                                    var colorGroupLabelFeature = {
                                        "type": "Feature",
                                        "geometry": {
                                            "type": "Point",
                                            "coordinates": [startX - dX, currentY]
                                        },
                                        "properties": {
                                            "name": colorGroup + " " + sortingGroupGeoData[groupname].size,
                                            "className": "colorGroupLabel"
                                        }
                                    };
                                    labelFeatures.features.push(colorGroupLabelFeature);

                                    // Decrement space for label
                                    currentY -= dY/3;

                                    sortingGroupGeoData[groupname].minX = startX
                                    sortingGroupGeoData[groupname].maxX = startX + groupWidth;
                                    sortingGroupGeoData[groupname].startY = currentY;
                                    sortingGroupGeoData[groupname].nextX = sortingGroupGeoData[groupname].minX;
                                    sortingGroupGeoData[groupname].nextY = sortingGroupGeoData[groupname].startY - (dY / 2);
                                    sortingGroupGeoData[groupname].y = 0;

                                    // update starting Y location for next feature group
                                    // Distance is 1 dY for 1st row, plus 0.75 dy for subsequent rows (since hexes intersect partially)
                                    // plus some padding
                                    currentY = currentY - ((2.5 * dY) + ((dY * 0.75) * (sortingGroupGeoData[groupname].numRows - 1)));
                                });


                                // Make label feature
                                var labelFeature = {
                                    "type": "Feature",
                                    "geometry": {
                                        "type": "Point",
                                        "coordinates": [startX, startY + dY]
                                    },
                                    "properties": {
                                        "name": subgroup.name,
                                        "className": "sortingGroupLabel"
                                    }
                                };
                                labelFeatures.features.push(labelFeature);

                                subgroup.nodes.forEach(function(node) {
                                    if(node !== null) {
                                        if(node.hasOwnProperty('iso')) {
                                            sortingGroupLookup[node.iso] = subgroup.name;
                                        } else {
                                            // Just print a little warning
                                            console.log("Node without iso property found!");
                                            console.log(node);
                                        }
                                    }
                                });
                            });

                        } else {

                            grouping.subgroups.forEach(function(subgroup) {
                                var groupname = subgroup.name;
                                sortingGroupGeoData[groupname] = {};
                                sortingGroupGeoData[groupname].size = subgroup.nodes.length;
                                sortingGroupGeoData[groupname].numRows = Math.ceil(sortingGroupGeoData[groupname].size / hexesPerRow);
                            });
                    
                            grouping.subgroups.forEach(function(subgroup, idx) {
                                var startX = (-groupSpan/2) + (idx * groupWidth);

                                var groupname = subgroup.name;
                                sortingGroupGeoData[groupname].minX = startX;
                                sortingGroupGeoData[groupname].maxX = startX + groupWidth;
                                sortingGroupGeoData[groupname].startY = startY;
                                sortingGroupGeoData[groupname].nextX = sortingGroupGeoData[groupname].minX;
                                sortingGroupGeoData[groupname].nextY = sortingGroupGeoData[groupname].startY - (dY / 2);
                                sortingGroupGeoData[groupname].y = 0;

                                // Make label feature
                                var labelFeature = {
                                    "type": "Feature",
                                    "geometry": {
                                        "type": "Point",
                                        "coordinates": [startX, startY + (dY/3)]
                                    },
                                    "properties": {
                                        "name": groupname,
                                        "className": "sortingGroupLabel"
                                    }
                                };
                                labelFeatures.features.push(labelFeature);

                                subgroup.nodes.forEach(function(node) {
                                    if(node !== null) {
                                        if(node.hasOwnProperty('iso')) {
                                            sortingGroupLookup[node.iso] = groupname;
                                        } else {
                                            // Just print a little warning
                                            console.log("Node without iso property found!");
                                            console.log(node);
                                        }
                                    }
                                });
                            });
                        }

                        // Calculate target location for each feature
                        currentData[0].features.forEach(function(feature) {
                            var sortingGroup = sortingGroupLookup[feature.properties.iso];
                            addSortByProperties(feature, grouping.name, sortingGroup);

                            addNewDelta(featureDeltas, Object.keys(colorGroupLookup).length === 0 ? sortingGroup : sortingGroup + "." + colorGroupLookup[feature.properties.iso], feature, STEPS);
                        });

                        categoryLabelsLayer = L.geoJson(labelFeatures, {
                            pointToLayer: function(feature, latlng) {
                                var icon = L.divIcon({
                                    "html": ""
                                });

                                var marker = L.marker(latlng, { "icon": icon }).bindLabel(feature.properties.name, {
                                    "noHide": true,
                                    "direction": "right",
                                    "offset": [-16,0],
                                    "className": feature.properties.className
                                });

                                return marker;
                            }
                        }).addTo(map);
                    } else {
                        setBoundaryLayerVisiblity(true);

                        var targetLocs = {};
                        scope.vizData[0].features.forEach(function(feature) {
                            if(feature.properties.hasOwnProperty("sortBy")) {
                                featue.properties.sortBy = {};
                            }
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

                    // Animate steps to new state based on deltas and number of steps
                    animateFeatures(featureDeltas, 1, STEPS);
                };

                function addSortByProperties(feature, grouping, subgroup) {
                    // Atttach selected grouping and subgroup metadata to
                    // the feature.properties for labeling purposes
                    feature.properties.sortBy = {};
                    feature.properties.sortBy.grouping = grouping;
                    feature.properties.sortBy.subgroup = subgroup;
                };

                function addNewDelta(featureDeltas, group, feature, numSteps) {
                    if(sortingGroupGeoData.hasOwnProperty(group)) {
                        var centerX = feature.geometry.coordinates[0][0][0] + (dX / 2);
                        var centerY = feature.geometry.coordinates[0][0][1] + (dY / 4);

                        // Velocity for feature to move to target location in the given steps
                        var deltaX = (centerX - sortingGroupGeoData[group].nextX) / numSteps;
                        var deltaY = (centerY - sortingGroupGeoData[group].nextY) / numSteps;

                        featureDeltas[feature.properties.iso] = {};
                        featureDeltas[feature.properties.iso].dX = deltaX;
                        featureDeltas[feature.properties.iso].dY = deltaY;

                        // Reset geo data for a "new line" if end of current row is reached
                        sortingGroupGeoData[group].nextX += dX;
                        if((sortingGroupGeoData[group].nextX + dX) >= (sortingGroupGeoData[group].maxX - dX)) {
                            sortingGroupGeoData[group].y += 1;
                            sortingGroupGeoData[group].nextX = sortingGroupGeoData[group].minX + ((dX / 2) * (sortingGroupGeoData[group].y % 2));
                            sortingGroupGeoData[group].nextY -= dY * 0.75;
                        }
                    }
                };

                function animateFeatures(featureDeltas, currentStep, maxSteps) {
                    currentData[0].features.forEach(function(feature) {
                        if(featureDeltas.hasOwnProperty(feature.properties.iso)) {
                            var deltas = featureDeltas[feature.properties.iso];
                            feature.geometry.coordinates[0].forEach(function(coordinate) {
                                coordinate[0] = coordinate[0] - deltas.dX;
                                coordinate[1] = coordinate[1] - deltas.dY;
                            });
                        }
                    });

                    redraw();

                    currentStep += 1;
                    if(currentStep <= maxSteps) {
                        $timeout(function() {
                            animateFeatures(featureDeltas, currentStep, maxSteps);
                        }, 50);
                    } else {
                        map.fitBounds(geoJsonLayer.getBounds());
                    }
                };

                function redraw() {
                    map.removeLayer(geoJsonLayer);
                    map.removeLayer(labelsLayer);

                    // Use custom options if they exists, otherwise use default
                    var layerOpts = Object.keys(customLayerOpts).length === 0 ? defaultLayerOpts : customLayerOpts;

                    labelsLayer = L.layerGroup().addTo(map);
                    geoJsonLayer = L.geoJson(currentData, layerOpts).addTo(map);
                };

                // watch for hexagon data
                scope.$watchGroup(["vizData"], function(newData, oldData) {
                    // async check
                    if (newData[0] !== undefined) {

                        currentData = JSON.parse(JSON.stringify(newData[0]));

                        currentData[0].features = currentData[0].features.filter(function(feature) {
                            return feature.properties.iso !== null;
                        });

                        addHexLayer(currentData, map);
                    };
                });

                // watch for boundary data
                scope.$watchGroup(["boundaries"], function(newData, oldData) {
                    // async check
                    if (newData[0] !== undefined) {
                        addBoundaryLayer(newData[0], map);
                    }
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
                    if(args.val.action_name === 'color') {
                        // Based on the selected arg apply new grouping
                        var newGrouping = scope.grouping.find(function(group) {
                            return group.name === args.val.control_name;
                        });
                        if(newGrouping !== undefined) {
                            recolorData(newGrouping);
                        }
                    }
                    if(args.val.action_name === 'filter') {
                        // Emphasize the selected group
                        var newFilter = scope.grouping.find(function(group) {
                            return group.name === args.val.control_name;
                        });
                        if(newFilter !== undefined) {
                            emphasizeData(newFilter);
                        }
                    }
                });

            });

        }

    };
}]);
