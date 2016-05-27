angular.module("dot-density-map-directive", [])

.directive("dotDensityMap", ["mapboxService", "agentService", "$timeout", "$rootScope", function(mapboxService, agentService, $timeout, $rootScope) {
	return {
		restrict: "E",
		scope: {
			vizData: "="
		},
		template: "<div data-tap-disabled='true' id='map'></div>",
		link: function(scope, element, attrs) {
			
			var canvas = element.find("div")[0];
			var token = "pk.eyJ1Ijoic3Rvcm11IiwiYSI6ImNpbWN0YmVzYjAwMnl1aWtraHYwaGNyYmcifQ.gTNJf31kwAdljd9u7cRGyg";
			var style = "mapbox://styles/stormu/cimcuz8rw00er9pm08vd7d0mw";
			var tweetColor = "#BA46F7";
			var articleColor = "#78FF78";
			var radius = 7;
			var blur = 1;
			var opacity = 0.5;
			var interactivity = true;
			
			// get USER AGENT data stored in service
			agentService.getData().then(function(data) {
				
				var os = data.os;
				
				// check os
				//if (os == "Android") {
					
					// get mapbox promise
					mapboxService.L().then(function(L) {
						
						var circleMarker = {
							radius: 5,
							fillOpacity: opacity,
							stroke: false
						};
						
						// alter openPopup method so that multiple popups may be opened simultaneously
			            L.Map = L.Map.extend({
			                openPopup: function(popup) {
			                    //this.closePopup(); 
			                    this._popup = popup;
			                    return this.addLayer(popup).fire('popupopen', {
			                        popup: this._popup
			                    });
			                }
			            });
						
						L.mapbox.accessToken = token;
						
						// initialize map object
						var map = L.mapbox.map(canvas);
						
						// add style
						L.mapbox.styleLayer(style).addTo(map);
						
						function draw(data, map, interactive) {
									
							var geoJsonLayer = L.geoJson(data, {
								
								// modify color
								style: function(feature) {
									switch (feature.properties.type) {
										case "article": return { color: articleColor };
										case "tweet": return { color: tweetColor };
									}
								},
								
								// add marker
								pointToLayer: function(feature, latlng) {
									switch (feature.properties.type) {
										case "article": return L.circleMarker(latlng, circleMarker);
										case "tweet": return L.circleMarker(latlng, circleMarker);
										case "location": return L.marker(latlng, { icon: L.divIcon({className: "facility"}) });
									}
								},
								
								// add labels
	                            onEachFeature: function (feature, layer) {
	
	                                // set popup options
	                                var popUpOptions = {
	                                    offset: L.point(0, 10)
	                                };
	
	                                // custom popup content
	                                var label = feature.properties.properties.label;
                            		var threat = label.assessment == null ? "Unassessed" : label.assessment;
                            		var content = "<p>" + label.title + "</p><p>Threat level: <span class='" + threat + "'>" + threat + "</span></p>";
                            		
                            		// check for location
                            		if (feature.properties.type == "location") {
                            			
                            			// add pop up
	                                	layer.bindPopup(content, popUpOptions);
	                                
                            		};
	
	                            }
								
							}).addTo(map);
							
							var tempFacilityLayer = L.geoJson(scope.$parent.content.embassies, {
								
								// modify color
								style: function(feature) {
									switch (feature.properties.type) {
										case "article": return { color: articleColor };
										case "tweet": return { color: tweetColor };
									}
								},
								
								// add marker
								pointToLayer: function(feature, latlng) {
									switch (feature.properties.type) {
										case "article": return L.circleMarker(latlng, circleMarker);
										case "tweet": return L.circleMarker(latlng, circleMarker);
										case "location": return L.marker(latlng, { icon: L.divIcon({className: "facility " + feature.properties.label.assessment }) });
									}
								},
								
								// add labels
	                            onEachFeature: function (feature, layer) {
	
	                                // set popup options
	                                var popUpOptions = {
	                                    offset: L.point(0, 10)
	                                };
	
	                                // custom popup content
	                                var label = feature.properties.label;
                            		var threat = label.assessment == null ? "Unassessed" : label.assessment;
                            		var content = "<p>" + label.name + "</p><p>Threat level: <span class='" + threat + "'>" + threat + "</span></p>";
                            		
                            		// check for location
                            		if (feature.properties.type == "location") {
                            			
                            			// add pop up
	                                	layer.bindPopup(content, popUpOptions);
	                                
                            		};
	
	                            }
								
							}).addTo(map);

	                        // center and zoom map based on markers
	                        map.fitBounds(geoJsonLayer.getBounds());
	                        
		                        // check for interactivity
		                        if (!interactive) {
		                        
			                        // disable drag and zoom handlers
									map.dragging.disable();
									map.touchZoom.disable();
									map.doubleClickZoom.disable();
									map.scrollWheelZoom.disable();
									map.keyboard.disable();
									
									// disable tap handler, if present
									if (map.tap) map.tap.disable();
									
								};
	                        
						};
						
						$rootScope.$on("mapChange", function(event, args) {
							
							element.find("div").remove();
							var newMap = angular.element("<div data-tap-disabled='true' style='height: " + args.height + "'></div>");
							element.append(newMap);
							
							// resize map & move to top
							element.parent()[0].style["z-index"] = args.zIndex;
			                
			                var circleMarker = {
								radius: 5,
								fillOpacity: opacity,
								stroke: false
							};
							
							L.mapbox.accessToken = token;
							
							var canvas = element.find("div")[0];
							
							// initialize map object
							var map = L.mapbox.map(canvas);
							
							// add style
							L.mapbox.styleLayer(style).addTo(map);

			                draw(scope.vizData, map, args.interactive);
			                
						});
							
						// bind data
						scope.$watch("vizData", function(newData, oldData) {
							
							// async check
							if (newData !== undefined) {
								
								draw(newData, map, false);
								
							};
							
						});
						
					});
					
				/*} else {
			
					// get mapboxgl promise
					mapboxService.mapboxgl().then(function(mapboxgl) {
						
						mapboxgl.accessToken = token;
						
						// initialize map object
						var map = new mapboxgl.Map({
							container: canvas,
							style: style,
							interactive: interactivity
						});
		                
		                // bind data
		                scope.$watch("vizData", function(newData, oldData) {
		                	
		                    // async check
		                    if (newData !== undefined) {
		
		                        function draw(data) {
		                            
		                            // wait for style to load
		                            map.on("style.load", function(e) {
		                            
		                                // add a new source with clustering true
		                                map.addSource("markers", {
		                                    type: "geojson",
		                                    data: data
		                                });
		                               
		                               	// add layer for embassies
		                                // layers all have the same style which is why
		                                // this is separate from other marker layers
		                                map.addLayer({
		                                    "id": "embassies",
		                                    "interactive": true,
		                                    "type": "symbol",
		                                    "source": "markers",
		                                    "layout": {
		                                        "icon-image": "location-dark",
		                                        "text-field": "F",
		                                        "icon-size": 0.8
		                                    },
		                                    "paint": {
		                                    	"icon-opacity": 0.7,
		                                    	"text-color": "white"
		                                    },
		                                    "filter": [ 'all',
											      [ '==', 'type', "location" ]
											    ]
		                                });
		                                
		                                // each feature
		                                data.features.forEach(function(feature) {
		                                	
		                                	// check type
		                                	if (feature.properties.type == "location") {
		                                		
		                                		var label = feature.properties.label;
		                                		var threat = label.assessment == undefined ? "Unassessed" : label.assessment;
		                                		
		                                		// add info
		                                		new mapboxgl.Popup({closeOnClick: true, closeButton: true})
												    .setLngLat(feature.geometry.coordinates)
												    .setHTML("<p>" + label.title + "</p><p>Threat level: <span class='" + threat + "'>" + threat + "</span></p>")
												    .addTo(map);
		                                		
		                                	};
		                                	
		                                });
		                               
		                               var layers = [["tweet", tweetColor],["article", articleColor]];
										
										layers.forEach(function (layer, i) {
		                                    map.addLayer({
		                                        "id": "marker-" + i,
		                                        //"interactive": true,
		                                        "type": "circle",
		                                        "source": "markers",
		                                        "paint": {
		                                            "circle-color": layer[1],
		                                            "circle-radius": radius,
		                                            "circle-blur": blur,
		                                            "circle-opacity": opacity
		                                        },
		                                        "filter": [ 'all',
											      [ '==', 'type', layer[0] ]
											    ]
		                                    });
		                                });
		                                
		                                // check if a single coordinate b/c bounds will be invalid if so
		                                if (data.features.length > 1) {
		                                
			                                // get bounds of data
				                            var bounds = new mapboxgl.LngLatBounds();
				                            
				                            data.features.forEach(function(feature) {
			                            	
				                            	// check for multipoint geometry
				                            	if (feature.geometry.type == "MultiPoint") {
				                            		
				                            		// loop through points
				                            		feature.geometry.coordinates.forEach(function(point) {
				                            			
				                            			// put point in bounds geometry
				                            			bounds.extend(point);
				                            			
				                            		});
				                            		
				                            	} else {
				                            	
				                            		// put point in bounds geometry
				                            		bounds.extend(feature.geometry.coordinates);
				                            	
			                            		};
		
				                            });
										    
										    // fit map to bounds in geojson
										    map.fitBounds(bounds, { padding: "25" });
										    
									    } else {
									    	
									    	// fly to coordinate location
									    	map.flyTo({
									    		center: data.features[0].geometry.coordinates
									    	});
									    	
									    };
		                                
		                            });
		                            
		                           // show pop up on click
		                          map.on('click', function (e) {
		                          	
									    // Use featuresAt to get features within a given radius of the click event
									    // Use layer option to avoid getting results from other layers
									    map.featuresAt(e.point, {layer: "embassies", radius: radius, includeGeometry: true}, function (err, features) {console.log(features);
									        if (err) throw err;
									        // if there are features within the given radius of the click event,
									        // fly to the location of the click event
									        if (features.length) {
									            // Get coordinates from the symbol and center the map on those coordinates
									            //map.flyTo({center: features[0].geometry.coordinates});
									            var featureName = features[0].properties.label.title;
									            var tooltip = new mapboxgl.Popup()
									                .setLngLat(e.lngLat)
									                .setHTML('<p>' + featureName + '</p>')
									                .addTo(map);
									        }
									    });
									});
		
		                        };
		                        
		                        // update the viz
		                        draw(newData);
		                        
		                    };
		                    
		                });
						
					});
					
				};*/
				
			});
			
		}
		
	};
}]);