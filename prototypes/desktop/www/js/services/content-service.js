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
		var storyBackendBaseUrl = apiConfig.contentStoryUri;
        var getDefaultStoryUrl = storyBackendBaseUrl + "getDefaultStoryByWorkspaceAndPanel";
        var getAllStoriesUrl = storyBackendBaseUrl + "getAllStoriesByWorkspaceAndPanel";
        // * idea
        var getAllIdeasUrl = storyBackendBaseUrl + "getAllIdeasByStory";
        // * vis
        var visBackendBaseUrl = apiConfig.contentVisUri;
        var getCdisUrl = visBackendBaseUrl + "cdis/";
        var getCountryGroupUrl = visBackendBaseUrl + "countries/groups/";
        var getGeojsonUrl = visBackendBaseUrl + "geojson";
        var getDynamicDirectivesUrl = visBackendBaseUrl + "angular/directives/1/";
        // * storage (TODO: figure out a better way to handle this)
        var currentStory;

        // --------------------------------------------------------------------		
		// return a contentService instance
        var contentService = {
            getDefaultStory: getDefaultStory,
            getAllStories: getAllStories,
            setCurrentStory: setCurrentStory,
            getCurrentStory: getCurrentStory,
            getAllIdeas: getAllIdeas,

            // TODO: do we need these functions below?
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

        // ============================
        // * story           
        // ============================
        
        function getDefaultStory(workspaceId, panelId) {
            return callBackend(getDefaultStoryUrl + "/workspace/" + workspaceId + "/panel/" + panelId).then(function(listOfDefaultStories){
                return listOfDefaultStories[0];
            });
        }

        function getAllStories(workspaceId, panelId) {
            return callBackend(getAllStoriesUrl + "/workspace/" + workspaceId + "/panel/" + panelId);
        }

        function setCurrentStory(storyId, storyUrlName) {
            var story = {
                id: storyId,
                url_name: storyUrlName
            }
            currentStory = story;
            return currentStory;
        }

        function getCurrentStory() {
            return currentStory;
        }

        function unsetCurrentStory() {
            currentStory = null;
        }

        // ============================
        // * idea           
        // ============================

        function getAllIdeas(storyId) {
            return callBackend(getAllIdeasUrl + "/" + storyId);
        }

        // ============================
        // * vis           
        // ============================
        

        // ============================
        // * miscellaneous           
        // ============================
        
        // TODO: do we need these functions below?
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

        // ============================
        // * cleanup           
        // ============================
        
        function cleanup() {
            unsetCurrentStory();
        }

    }

})();