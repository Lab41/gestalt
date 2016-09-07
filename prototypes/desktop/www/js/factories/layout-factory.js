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
        var workspaceBackendBaseUrl = api_config.layout_workspace_uri;
        var panelBackendBaseUrl = api_config.layout_panel_uri;
        var getDefaultWorkspaceUrl = workspaceBackendBaseUrl + "getDefaultWorkspaceByPersona";
        var getDefaultPanelUrl = panelBackendBaseUrl + "getDefaultPanelByWorkspace";
        
        // --------------------------------------------------------------------
        // return a layoutFactory instance
        var layoutFactory = {
            getDefaultWorkspace: getDefaultWorkspace,
            getDefaultPanel: getDefaultPanel
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
            // TODO: verify first that there is only one default workspace
            return callBackend(getDefaultWorkspaceUrl + "/" + personaId).then(function(listOfDefaultWorkspaces){
                return listOfDefaultWorkspaces[0];
            });
        }

        function getDefaultPanel(workspaceId) {
            // TODO: verify first that there is only one default panel
            return callBackend(getDefaultPanelUrl + "/" + workspaceId).then(function(listOfDefaultPanels){
                return listOfDefaultPanels[0];
            });
        }
        
    }

})();
