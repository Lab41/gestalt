angular.module("tile-grid-map-directive", [])

.directive("tileGridMap", ["mapboxService", function(mapboxService) {
	return {
		restrict: "E",
		scope: {
			vizData: "=",
			theme: "="
		},
		template: "<div data-tap-disabled='true' style='height: 500px; width: 100%; background: none;'></div>",
		link: function(scope, element, attrs) {
			
			var canvas = element.find("div")[0];
			var token = mapbox_config.token;
			var radius = 7;
			var blur = 1;
			var opacity = 0.5;
            var interactivity = true;
					
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
                
                function draw(data, map, interactive, styleUrl) {
					
					// style url
					var style = mapbox_config.style[styleUrl];
					
					// add style
					//L.mapbox.styleLayer(style).addTo(map);

                    var geoJsonLayer = L.geoJson(data, {

                        // modify color
                        style: function(feature) {

								return { className: "default" };
                            /*switch (feature.properties.type) {
                                case "article": return { color: articleColor };
                                    break;
                                default "tweet": return { color: tweetColor };
                            }*/
                            
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
							
							var polygonLabel = L.marker(layer.getBounds().getCenter(), {
								icon: L.divIcon({
									html: "<p>" + feature.properties.iso + "</p>",
									iconSize: [20,20]
								})
							}).addTo(map);

                        }

                    }).addTo(map);

                    // center and zoom map based on markers
                    map.fitBounds(geoJsonLayer.getBounds(), {
                        //padding: [0,12],
                        //minZoom: 5
                    });

                };

                // bind data
                scope.$watchGroup(["vizData", "theme"], function(newData, oldData) {

                    // async check
					if (newData[0] !== undefined) {

                        draw(newData[0], map, interactivity, newData[1]);

                    };

                });

            });
			
		}
		
	};
}]);