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
	
	// get USER AGENT data stored in service
	agentService.getData().then(function(data) {
		
		function onScriptLoad() {

			// check os
			if (os == "Android") {
				
				// serve up mapbox
				$rootScope.$apply(function() {
					d.resolve($window.L);
				});
				
			} else {
				
				// serve up mapbox gl
				$rootScope.$apply(function() {
					d.resolve($window.mapboxgl);
				});
				
			};
			
		};
		
		var os = data.os;
	
		//create script tag for source
		var scriptTag = $document[0].createElement("script");
		scriptTag.type = "text/javascript";
		scriptTag.async = true;
		scriptTag.src = os == "Android" ? mbox : gl;
		//scriptTag.src = gl;
		scriptTag.onreadystatechange = function() {
			
			//check state
			if(this.readyState == "complete") {
				
				onScriptLoad();
				
			};
			
		};
		
		scriptTag.onload = onScriptLoad;
		
		//add script tage to document
		var s = $document[0].getElementsByTagName("body")[0];
		s.appendChild(scriptTag);
		
	});
	
	//return object
    return mapboxservice;
	
}]);