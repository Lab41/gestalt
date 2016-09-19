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
        var getDirectiveNameUrl = visBackendBaseUrl + "getDirectiveNameByVis";
        // * vis: econ
        var getCdisUrl = visBackendBaseUrl + "cdis/";
        var getCountryGroupUrl = visBackendBaseUrl + "countries/groups/";
        // * storage (TODO: figure out a better way to handle this)
        var currentStory;
        var currentVis;

        // --------------------------------------------------------------------		
		// return a contentService instance
        var contentService = {
            // * story
            getDefaultStory: getDefaultStory,
            getAllStories: getAllStories,
            setCurrentStory: setCurrentStory,
            getCurrentStory: getCurrentStory,
            // * idea
            getAllIdeas: getAllIdeas,
            // * vis
            getDirectiveName: getDirectiveName,
            setCurretVis: setCurrentVis,
            getCurrentVis: getCurrentVis,
            // * vis: econ
            getCountryNodes: getCountryNodes,
            getNodeGroups: getNodeGroups,
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
            // TODO: verify first that there is only one default workspace and handle it if there's none
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
        
        function getDirectiveName(visId) {
            // there is only one directive name linked to each vis, but $http call returns a list
            // so this is the hack
            return callBackend(getDirectiveNameUrl + "/" + visId).then(function(listOfDirectives) {
                return listOfDirectives[0].name;
            });
        }

        function setCurrentVis(visId, visUrlName) {
            var vis = {
                id: visId,
                url_name: visUrlName
            }
            currentVis = vis;
            return currentVis;
        }

        function getCurrentVis() {
            return currentVis;
        }

        function unsetCurrentVis() {
            currentVis = null;
        }

        // ============================
        // * vis: econ        
        // ============================
        
        function getCountryNodes() {
            console.log("getCountryNodes");
            return callBackend(getCdisUrl);
        }

        function getNodeGroups() {
            console.log("getNodeGroups");
            return callBackend(getCountryGroupUrl);
        }



        // ============================
        // * cleanup           
        // ============================
        
        function cleanup() {
            unsetCurrentStory();
            unsetCurrentVis();
        }

    }

})();