angular.module("tile-grid-map-directive", [])

.directive("tileGridMap", ["mapboxService", function(mapboxService) {
	return {
		restrict: "E",
		scope: {
			vizData: "="
		},
		template: "<div data-tap-disabled='true' style='height: 500px; width: 100%; background: none;'></div>",
		link: function(scope, element, attrs) {
			
			var canvas = element.find("div")[0];
			var token = "";
			var style = "";
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
                
                map.options.crs = L.CRS.Simple;

                // add style
                //L.mapbox.styleLayer(style).addTo(map);
                
                function draw(data, map, interactive) {

                    var geoJsonLayer = L.geoJson(data, {

                        // modify color
                        style: function(feature) {
                            /*switch (feature.properties.type) {
                                case "article": return { color: articleColor };
                                    break;
                                default "tweet": return { color: tweetColor };
                            }*/
                            return { className: "default" };
                        },

                        // add labels
                        onEachFeature: function (feature, layer) {
							
							var polygonLabel = L.marker(layer.getBounds().getCenter(), {
								icon: L.divIcon({
									html: "<p>" + feature.properties.iso + "</p>",
									iconSize: [60,60]
								})
							}).addTo(map);

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

                    }).addTo(map);

                    // center and zoom map based on markers
                    map.fitBounds(geoJsonLayer.getBounds(), {
                        //padding: [0,12],
                        //minZoom: 5
                    });

                };

                // bind data
                scope.$watch("vizData", function(newData, oldData) {

                    // async check
                    if (newData !== undefined) {

                        draw(newData, map, interactivity);

                    };

                });

            });
			
		}
		
	};
}]);