// wrap in Immediately Invoked Function Expression to avoid global scope 
(function() {
    'use strict';

    // set d3-factory application and register its factory
    angular
        .module("d3-factory", [])
        .factory("d3Factory", d3Factory);

    // add additional services to be used within the factory
    d3Factory.$inject = ["$document", "$q", "$rootScope", "$window"];

    // define the factory
    function d3Factory($document, $q, $rootScope, $window) {
    	
		var d = $q.defer();
		var d3factory = {
			d3: function() {
				return d.promise;
			}
		};
		
		//create script tag for d3 source
		var scriptTag = $document[0].createElement("script");
		scriptTag.type = "text/javascript";
		scriptTag.async = true;
		scriptTag.src = "lib/d3.js";
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
		
		//return d3 object
	    return d3factory;
		
		function onScriptLoad() {
			
			//load client in the browser
			$rootScope.$apply(function() {
				d.resolve($window.d3);
			});
			
		};
	
    }

})();
