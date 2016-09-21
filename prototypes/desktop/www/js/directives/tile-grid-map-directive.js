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
			var style = {
				dark: mapbox_config.style.dark, 
				light: mapbox_config.style.light
			};
					
            // get mapboxgl promise
			mapboxService.mapboxgl().then(function(mapboxgl) {

				mapboxgl.accessToken = token;
				var style2= {
				"version": 8,
				"name": "Empty",
				"metadata": {
				"mapbox:autocomposite": true,
				"mapbox:type": "template"
				},
				"glyphs": "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
				"sources": {},
				"layers": [
				{
				"id": "background",
				"type": "background",
				"paint": {
				"background-color": "rgba(0,0,0,0)"
				}
				}
				]
				};

				// initialize map object
				var map = new mapboxgl.Map({
					container: canvas,
					//style: style[scope.theme],
					style: style2,
					interactive: interactivity,
					center: [0, 0],
    				zoom: 1.5,
					minZoom: 1.5
				});

				// bind data
				scope.$watch("vizData", function(newData, oldData) {

					// async check
					if (newData !== undefined) {

						function draw(data) {
							
							function mapboxProjection(lonlat) {
							  var p = map.project(new mapboxgl.LngLat(lonlat[0], lonlat[1]))
							  return [p.x, p.y];
							};
							
							function pointOnCircle(angle) {
								return {
									"type": "Point",
									"coordinates": [
										Math.cos(angle) * radius,
										Math.sin(angle) * radius
									]
								};
							}

							// wait for style to load
							map.on("style.load", function(e) {

								// add a new source with clustering true
								map.addSource("nodes", {
									type: "geojson",
									data: data
								});
								
								map.addSource('point', {
									"type": "geojson",
									"data": pointOnCircle(0)
								});
								
								map.addLayer({
									id: "tilegrid",
									type: "fill",
									source: "nodes",
									layout: {},
									paint: {
										"fill-color": "#667080",
										"fill-opacity": 0.4,
										"fill-outline-color": "#667080"
									}
								});
								
								map.addLayer({
									"id": "point",
									"source": "point",
									"type": "circle",
									"paint": {
										"circle-radius": 10,
										"circle-color": "#007cbf"
									}
								});

								function animateMarker(timestamp) {
									// Update the data to a new position based on the animation timestamp. The
									// divisor in the expression `timestamp / 1000` controls the animation speed.
									map.getSource('point').setData(pointOnCircle(timestamp / 1000));

									// Request the next frame of the animation.
									requestAnimationFrame(animateMarker);
								}

								// Start the animation.
								animateMarker(0);

							});

						};

						// update the viz
						draw(newData[0]);

					};

				});

			});
			
		}
		
	};
}]);