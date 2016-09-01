// wrap in Immediately Invoked Function Expression to avoid global scope 
(function() {
    'use strict';

    // set mapbox-factory application and register its factory
    angular
        .module("mapbox-factory", [])
        .factory("mapboxFactory", mapboxFactory);

    // add additional services to be used within the factory
    mapboxFactory.$inject = ["$document", "$q", "$rootScope", "$window", "agentFactory"];

    // define the factory
    function mapboxFactory($document, $q, $rootScope, $window, agentFactory) {
		
		var d = $q.defer();
		var mapboxfactory = {
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
		
		// get USER AGENT data stored in factory
		agentFactory.getData().then(function(data) {
			
			function onScriptLoad() {

				// check os
				//if (os == "Android") {
					
					// serve up mapbox
					$rootScope.$apply(function() {
						d.resolve($window.L);
					});
					
				/*} else {
					
					// serve up mapbox gl
					$rootScope.$apply(function() {
						d.resolve($window.mapboxgl);
					});
					
				};*/
				
			};
			
			var os = data.os;
		
			//create script tag for source
			var scriptTag = $document[0].createElement("script");
			scriptTag.type = "text/javascript";
			scriptTag.async = true;
			//scriptTag.src = os == "Android" ? mbox : gl;
			scriptTag.src = mbox;
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
		
		// return a mapboxFactory instance
	    return mapboxfactory;
		
    }

})();