// wrap in Immediately Invoked Function Expression to avoid global scope 
(function() {
    'use strict';

    // set app-controller application and register its controller
    angular
        .module("app-controller", [])
        .controller("appController", appController);

    // add additional services to be used within the controller
    appController.$inject = ["$rootScope", "$scope", "$state", "$stateParams", "authenticationService", "layoutService"];

    // define the controller
    function appController($rootScope, $scope, $state, $stateParams, authenticationService, layoutService) {
        // --------------------------------------------------------------------
        // define bindable members
        // * slide panel
        $scope.leftVisible = false;
        $scope.rightVisible = false;
        $scope.showLeft = showLeft;
        $scope.showRight = showRight;
        $scope.close = close;
        $scope.slidePanelContent = {};
        // * panel navigation
        $scope.listOfPanels;

        // --------------------------------------------------------------------
        // call functions
        activate(); 

        // --------------------------------------------------------------------
        // define functions
        function activate() {
            // * slide panel
            addInteractivityToSlidePanel();
            addSlidePanelContent();  
            // * panel navigation
            getListOfPanels();
        }

        // ============================
        // * slide panel 
        // ============================
    
        function showLeft(event) {
            $scope.leftVisible = true;
            event.stopPropagation();
        }

        function showRight(event) {
            $scope.rightVisible = true;
            event.stopPropagation();
        }

        function closePanel() {
            $scope.leftVisible = false;
            $scope.rightVisible = false;
        }

        function addInteractivityToSlidePanel() {

            function _close() {
                $scope.$apply(function() {
                    closePanel();
                });
            }

            $rootScope.$on("documentClicked", _close);
            $rootScope.$on("escapedPressed", _close);

        }

        function addSlidePanelContent() {
            /**
             * Slide panel requires the following information:
             * - current persona's name
             * - current theme
             * - current workspace
             * - workspaces associated with current persona
             */
            var getListOfWorkspaces = function() {
                return layoutService
                        .getAllWorkspaces(currentPersona.id)
                        .then(function(listOfWorkspaces) {
                            return listOfWorkspaces
                        });

            };
            var setSlidePanelContent = function(listOfWorkspaces) {
                $scope.slidePanelContent = {
                    currentPersona: currentPersona.name,
                    theme: $scope.$parent.theme,
                    currentWorkspaceId: layoutService.getCurrentWorkspace().id,
                    listOfWorkspaces: listOfWorkspaces
                };

            };

            // get all workspaces associated with the current persona 
            // in order to fill the content of the slide panel 
            var currentPersona = authenticationService.getCurrentPersona();
            getListOfWorkspaces()         
                .then(setSlidePanelContent);

        }

        // ============================
        // * panel navigation 
        // ============================
        
        function getListOfPanels() {
            return layoutService
                    .getAllPanels(layoutService.getCurrentWorkspace().id)
                    .then(function (listOfPanels) {
                        $scope.listOfPanels = listOfPanels;
                    });
        }

        
    }

})();