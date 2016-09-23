angular.module("screenshot-service", [])

.factory("screenshotService", ["$http", "$location", function($http, $location) {

    var urlBase= api_config.feedback_service_uri;
    var screenshotService = {};
    
    // SCREENSHOT
    screenshotService.postScreenCapture = function() {
        
        var url = $location.$$absUrl;
        var width = 1690;
        var height = 604;
			
        // set up a valid object
        var obj = {
        	"width": width,
        	"height": height,
            "url": url
    	};                             
        
        // post it
        return $http.post(urlBase + "viewport/" + width + "/" + height + "/", obj);

    };

    return screenshotService;

}]);
