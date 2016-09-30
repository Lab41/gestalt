// wrap in Immediately Invoked Function Expression to avoid global scope 
(function() {
    'use strict';

    // set layout-service application and register its service
    angular
        .module("layout-service", [])
        .service("layoutService", layoutService);

    // add additional services to be used within the service
    layoutService.$inject = ["$http", "$log"];

    // define the service
    function layoutService($http, $log) {
        // --------------------------------------------------------------------
        // for backend
        // * workspace
        var workspaceBackendBaseUrl = apiConfig.layoutWorkspaceUri;
        var getDefaultWorkspaceUrl = workspaceBackendBaseUrl + "getDefaultWorkspaceByPersona";
        var getAllWorkspacesUrl = workspaceBackendBaseUrl + "getAllWorkspacesByPersona";
        // * panel
        var panelBackendBaseUrl = apiConfig.layoutPanelUri;
        var getDefaultPanelUrl = panelBackendBaseUrl + "getDefaultPanelByWorkspace";
        var getAllPanelsUrl = panelBackendBaseUrl + "getAllPanelsByWorkspace";
        // * storage (TODO: figure out a better way to handle this)
        var currentWorkspace;
        var currentPanel;
        var currentListOfPanels;

        // --------------------------------------------------------------------
        // return a layoutService instance
        var layoutService = {
            // * workspace
            getDefaultWorkspace: getDefaultWorkspace,
            getAllWorkspaces: getAllWorkspaces,
            setCurrentWorkspace: setCurrentWorkspace,
            getCurrentWorkspace: getCurrentWorkspace,
            // *  panel
            getDefaultPanel: getDefaultPanel,
            getAllPanels: getAllPanels,
            setCurrentPanel: setCurrentPanel,
            getCurrentPanel: getCurrentPanel,
            setCurrentListOfPanels: setCurrentListOfPanels,
            // * additional functionalities
            cleanup: cleanup
        };
        return layoutService;

        // --------------------------------------------------------------------
        // function definition used in service instance
        function callBackend(backendUrl) {
            $log.log("****** GET " + backendUrl + " ******");
            return $http.get(backendUrl)
                        .then(function(backendResponse) { return backendResponse.data; });
        }

        // ============================
        // * workspace
        // ============================

        function getDefaultWorkspace(personaId) {
            return callBackend(getDefaultWorkspaceUrl + "/" + personaId).then(function(listOfDefaultWorkspaces){
                return listOfDefaultWorkspaces[0];
            });
        }

        function getAllWorkspaces(personaId) {
            return callBackend(getAllWorkspacesUrl + "/" + personaId);
        }

        function setCurrentWorkspace(workspaceId, workspaceUrlName) {
            var workspace = {
                id: workspaceId,
                url_name: workspaceUrlName
            };
            currentWorkspace = workspace;
            return currentWorkspace;
        }

        function getCurrentWorkspace() {
            return currentWorkspace;
        }

        function unsetCurrentWorkspace() {
            currentWorkspace = null;
        }

        // ============================
        // * panel           
        // ============================

        function getDefaultPanel(workspaceId) {
            return callBackend(getDefaultPanelUrl + "/" + workspaceId).then(function(listOfDefaultPanels){
                return listOfDefaultPanels[0];
            });
        }

        function getAllPanels(workspaceId) {
            return callBackend(getAllPanelsUrl + "/" + workspaceId);
        }

        function setCurrentPanel(panelId, panelUrlName) {
            var panel = {
                id: panelId,
                url_name: panelUrlName
            }
            currentPanel = panel;
            return currentPanel;
        }

        function getCurrentPanel() {
            return currentPanel;
        }

        function unsetCurrentPanel() {
            currentPanel = null;
        }

        function setCurrentListOfPanels(panels) {
            currentListOfPanels = panels;
            return currentListOfPanels;
        }

        function getCurrentListOfPanels() {
            return currentListOfPanels;
        }

        function unsetCurrentListOfPanels() {
            currentListOfPanels = null;
        }

        // ============================
        // * cleanup           
        // ============================
        
        function cleanup() {
            unsetCurrentWorkspace();
            unsetCurrentPanel();
            unsetCurrentListOfPanels();
        }

    }

})();
