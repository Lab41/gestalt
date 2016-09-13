// wrap in Immediately Invoked Function Expression to avoid global scope 
(function() {
    'use strict';

    // set content-factory application and register its factory
    angular
        .module("content-factory", [])
        .factory("contentFactory", contentFactory);

    // add additional services to be used within the factory
    contentFactory.$inject = ["$http", "$log"];

    // define the factory
    function contentFactory($http, $log) {
        // --------------------------------------------------------------------
        // for backend
        // * story
		var storyBackendBaseUrl = api_config.content_story_uri;
        var getAllStoriesUrl = storyBackendBaseUrl + "getAllStoriesByWorkspaceAndPanel";
        // * vis
        var visBackendBaseUrl = api_config.content_vis_uri;
        var getCdisUrl = visBackendBaseUrl + "cdis";
        var getCountryGroupUrl = visBackendBaseUrl + "countries/groups";
        var getGeojsonUrl = visBackendBaseUrl + "geojson";

        // --------------------------------------------------------------------		
		// return a contentFactory instance
        var contentFactory = {
            getAllStories: getAllStories,
            getCdis: getCdis,
            getCountryGroup: getCountryGroup,
            getGeojson: getGeojson
        };
		return contentFactory;

        // --------------------------------------------------------------------
        // function definition used in factory instance
        function callBackend(backendUrl) {
            $log.log("****** GET " + backendUrl + " ******");
            return $http.get(backendUrl)
                        .then(function(backendResponse) { return backendResponse.data; });
        }

        function getAllStories(workspaceId, panelId) {
            return callBackend(getAllStoriesUrl + "/workspace/" + workspaceId + "/panel/" + panelId);
        }

        // TODO: clean this up
        function getCdis() {
            return callBackend(getCdisUrl + "/");
        }

        function getCountryGroup() {
            return callBackend(getCountryGroupUrl + "/");
        }

        function getGeojson(gridType) {
            return callBackend(getGeojsonUrl + "/" + gridType + "/")
                    .then(function(listOfGeojson){
                        return listOfGeojson[0];
                    });
        }

    }

})();