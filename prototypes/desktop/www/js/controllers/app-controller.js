// wrap in Immediately Invoked Function Expression to avoid global scope 
(function() {
    'use strict';

    // set app-controller application and register its controller
    angular
        .module("app-controller", [])
        .controller("appController", appController);

    // add additional services to be used within the controller
    appController.$inject = ["$rootScope", "$scope", "$stateParams", "authenticationFactory", "layoutFactory"];

    // define the controller
    function appController($rootScope, $scope, $stateParams, authenticationFactory, layoutFactory) {
        // --------------------------------------------------------------------
        // define bindable members
        // * slide panel
        $scope.leftVisible = false;
        $scope.rightVisible = false;
        $scope.showLeft = showLeft;
        $scope.showRight = showRight;
        $scope.close = close;
        $scope.slidePanelContent = {};

        // --------------------------------------------------------------------
        // call functions
        activate(); 

        // --------------------------------------------------------------------
        // define functions
        function activate() {
            addInteractivityToSlidePanel();
            addSlidePanelContent();   
        }

        // * slide panel
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
                return layoutFactory.getAllWorkspaces(currentPersona.id)
                                    .then(function(listOfWorkspaces) {
                                        return listOfWorkspaces
                                    });

            };
            var setSlidePanelContent = function(listOfWorkspaces) {
                $scope.slidePanelContent = {
                    currentPersona: currentPersona.name,
                    theme: $scope.$parent.theme,
                    currentWorkspaceId: layoutFactory.getCurrentWorkspaceId(),
                    listOfWorkspaces: listOfWorkspaces
                };

            };

            // get all workspaces associated with the current persona 
            // in order to fill the content of the slide panel 
            var currentPersona = authenticationFactory.getCurrentPersona();
            getListOfWorkspaces()         
                .then(setSlidePanelContent);


        }




    }

})();