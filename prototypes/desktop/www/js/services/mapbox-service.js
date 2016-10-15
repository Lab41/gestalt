angular.module("mapbox-service", [])

.factory("mapboxService", ["$document", "$window", "$q", "$rootScope", "agentService", function($document, $window, $q, $rootScope, agentService) {
	
	var d = $q.defer();
	var mapboxservice = {
		mapboxgl: function() {
			return d.promise;
		},
		L: function() {
			return d.promise;
		}
	};
	
	// sources
	var gl = mapbox_config.gl;
	var mbox = mapbox_config.raster;
	var leafletLabel = mapbox_config.leaflet_label;
	
	// get USER AGENT data stored in service
	agentService.getData().then(function(data) {
		
		function onScriptLoad() {

			// serve up mapbox
			$rootScope.$apply(function() {
				d.resolve($window.L);
			});
			
		};

		function loadLeafletLabels() {
			//create script tag for source
			var leafletScriptTag = $document[0].createElement("script");
			leafletScriptTag.type = "text/javascript";
			leafletScriptTag.async = true;
			leafletScriptTag.src = leafletLabel;
			leafletScriptTag.onreadystatechange = function() {
				
				//check state
				if(this.readyState == "complete") {
					
					onScriptLoad();
					
				};
				
			};
			
			leafletScriptTag.onload = onScriptLoad;
			
			//add script tage to document
			var s = $document[0].getElementsByTagName("body")[0];
			s.appendChild(leafletScriptTag);
		};
	
		//create script tag for source
		var scriptTag = $document[0].createElement("script");
		scriptTag.type = "text/javascript";
		scriptTag.async = true;
		scriptTag.src = mbox;
		scriptTag.onreadystatechange = function() {
			
			//check state
			if(this.readyState == "complete") {
				
				loadLeafletLabels();
				
			};
			
		};
		
		scriptTag.onload = loadLeafletLabels;
		
		//add script tage to document
		var s = $document[0].getElementsByTagName("body")[0];
		s.appendChild(scriptTag);
		
	});
	
	//return object
    return mapboxservice;
	
}]);