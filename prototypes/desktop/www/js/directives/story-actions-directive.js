// wrap in Immediately Invoked Function Expression to avoid global scope 
(function() {
    'use strict';

    // set slide-panel-directive application and register its directive
    angular
        .module("story-actions-directive", [])
        .directive("storyActions", storyActionsDirective);

    function storyActionsDirective() {
        var storyActionsDirective = {
            restrict: "E",
            template: "<div><button ng-repeat='action in listOfActions' type='button' ng-click='applyAction(action.id)'>{{ action.name }}</button></div>",
            scope: {
                actiongroup: "=",
            },
            controller: storyActionsController,
        };
        return storyActionsDirective;
    } 

    storyActionsController.$inject = ["$rootScope", "$scope", "$state", "contentService"];
    function storyActionsController($rootScope, $scope, $state, contentService) {
        // --------------------------------------------------------------------
        // define bindable members
        $scope.listOfActions;
        $scope.applyAction = applyAction;

        // --------------------------------------------------------------------
        // call functions   
        activate();

        // --------------------------------------------------------------------
        // define functions 
        function activate() {
            getListOfActions($scope.actiongroup);
        }

        function getListOfActions(actionGroupId) {
            contentService
                .getAllActions(actionGroupId)
                .then(function(listOfActions) {
                    $scope.listOfActions = listOfActions;
                })
        }

        // TODO
        function applyAction(actionId) {
            console.log("in applyAction");
            return;
        }
    }

/*
    	return function($scope) {
                
                // story idea functionality
                $scope.changeIdea = function(ideaId, controlId) {
                
                    // get current idea corresponding impact metric
                    contentService.getData("story/idea/" + ideaId + "/metric/" + controlId + "/").then(function(data) {

                        // broadcast so other visualizations can update
                        $rootScope.$broadcast("storyIdeaChange", { val: data[0] });
                        
                        // transition state url
                        $state.go("app.panel.story.visual", {
                            si: ideaId,
    						sc: controlId
                        },{
    						notify: false,
    						reload: false
    					});

*/
                    

        

})();