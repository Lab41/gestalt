// wrap in Immediately Invoked Function Expression to avoid global scope 
(function() {
    'use strict';

    // set content-service application and register its service
    angular
        .module("content-service", [])
        .service("contentService", contentService);

    // add additional services to be used within the service
    contentService.$inject = ["$http", "$log"];

    // define the service
    function contentService($http, $log) {
        // --------------------------------------------------------------------
        // for backend
        // * story
		var storyBackendBaseUrl = api_config.content_story_uri;
        var getAllStoriesUrl = storyBackendBaseUrl + "getAllStoriesByWorkspaceAndPanel";
        // * vis
        var visBackendBaseUrl = api_config.content_vis_uri;
        var getCdisUrl = visBackendBaseUrl + "cdis/";
        var getCountryGroupUrl = visBackendBaseUrl + "countries/groups/";
        var getGeojsonUrl = visBackendBaseUrl + "geojson";
        var getDynamicDirectivesUrl = visBackendBaseUrl + "angular/directives/1/";

        // --------------------------------------------------------------------		
		// return a contentService instance
        var contentService = {
            getAllStories: getAllStories,
            getCdis: getCdis,
            getCountryGroup: getCountryGroup,
            getGeojson: getGeojson
        };
		return contentService;

        // --------------------------------------------------------------------
        // function definition used in service instance
        function callBackend(backendUrl) {
            $log.log("****** GET " + backendUrl + " ******");
            return $http.get(backendUrl)
                        .then(function(backendResponse) { return backendResponse.data; });
        }

        function getAllStories(workspaceId, panelId) {
            return callBackend(getAllStoriesUrl + "/workspace/" + workspaceId + "/panel/" + panelId);
        }

        function getCdis() {
            // TODO: remove this? It's not used. 
            return callBackend(getCdisUrl);
        }

        function getCountryGroup() {
            return callBackend(getCountryGroupUrl);
        }

        function getGeojson(gridType) {
            // TODO: remove this? It's not used
            return callBackend(getGeojsonUrl + "/" + gridType + "/")
                    .then(function(listOfGeojson){
                        return listOfGeojson[0];
                    });
        }

        function getDynamicDirectives() {
            return callBackend(getDynamicDirectivesUrl);
        }

    }

})();