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
        // -- story
		var storyBackendBaseUrl = api_config.content_story_uri;
        var getAllStoriesUrl = storyBackendBaseUrl + "getAllStoriesByPersonaAndPanel";
        // -- vis
        var visBackendBaseUrl = api_config.content_vis_uri;

        // --------------------------------------------------------------------		
		// return a contentFactory instance
        var contentFactory = {
            getListOfStories: getListOfStories
        };
		return contentFactory;


        // --------------------------------------------------------------------
        // function definition used in factory instance
        function callBackend(backendUrl) {
            $log.log("****** GET " + backendUrl + " ******");
            return $http.get(backendUrl)
                        .then(function(backendResponse) { return backendResponse.data; });
        }

        function getListOfStories(personaId, panelId) {
            return callBackend(getAllStoriesUrl + "/persona/" + personaId + "/panel/" + panelId);
        }

    }

})();