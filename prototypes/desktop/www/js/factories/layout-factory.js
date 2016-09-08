// wrap in Immediately Invoked Function Expression to avoid global scope 
(function() {
    'use strict';

    // set layout-factory application and register its factory
    angular
        .module("layout-factory", [])
        .factory("layoutFactory", layoutFactory);

    // add additional services to be used within the factory
    layoutFactory.$inject = ["$http", "$log"];

    // define the factory
    function layoutFactory($http, $log) {
        // --------------------------------------------------------------------
        // for backend
        // -- workspace
        var workspaceBackendBaseUrl = api_config.layout_workspace_uri;
        var getDefaultWorkspaceUrl = workspaceBackendBaseUrl + "getDefaultWorkspaceByPersona";
        var getAllWorkspacesUrl = workspaceBackendBaseUrl + "getAllWorkspacesByPersona";
        // -- panel
        var panelBackendBaseUrl = api_config.layout_panel_uri;
        var getDefaultPanelUrl = panelBackendBaseUrl + "getDefaultPanelByWorkspace";
        // -- storage (TODO: figure out a better way to handle this)
        var currentWorkspaceId;
        var currentPanelId;

        // --------------------------------------------------------------------
        // return a layoutFactory instance
        var layoutFactory = {
            getDefaultWorkspace: getDefaultWorkspace,
            getDefaultPanel: getDefaultPanel,
            getAllWorkspaces: getAllWorkspaces,
            setCurrentWorkspaceId: setCurrentWorkspaceId,
            getCurrentWorkspaceId: getCurrentWorkspaceId,
            setCurrentPanelId: setCurrentPanelId,
            getCurrentPanelId: getCurrentPanelId,
            cleanup: cleanup
        }
        return layoutFactory;

        // --------------------------------------------------------------------
        // function definition used in factory instance
        function callBackend(backendUrl) {
            $log.log("****** GET " + backendUrl + " ******");
            return $http.get(backendUrl)
                        .then(function(backendResponse) { return backendResponse.data; });
        }

        function getDefaultWorkspace(personaId) {
            // TODO: verify first that there is only one default workspace and handle it if there's none
            return callBackend(getDefaultWorkspaceUrl + "/" + personaId).then(function(listOfDefaultWorkspaces){
                return listOfDefaultWorkspaces[0];
            });
        }

        function getDefaultPanel(workspaceId) {
            // TODO: verify first that there is only one default panel and handle it if there's none
            return callBackend(getDefaultPanelUrl + "/" + workspaceId).then(function(listOfDefaultPanels){
                return listOfDefaultPanels[0];
            });
        }

        function getAllWorkspaces(personaId) {
            return callBackend(getAllWorkspacesUrl + "/" + personaId);
        }

        function setCurrentWorkspaceId(workspaceId) {
            currentWorkspaceId = workspaceId;
        }

        function getCurrentWorkspaceId() {
            return currentWorkspaceId;
        }

        function unsetCurrentWorkspaceId() {
            currentWorkspaceId = null;
        }

        function setCurrentPanelId(panelId) {
            currentPanelId = panelId;
        }

        function getCurrentPanelId() {
            return currentPanelId;
        }

        function unsetCurrentPanelId() {
            currentPanelId = null;
        }

        function cleanup() {
            unsetCurrentWorkspace();
            unsetCurrentPanel();
        }

    }

})();
