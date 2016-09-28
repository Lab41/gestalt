// wrap in Immediately Invoked Function Expression to avoid global scope 
(function() {
    'use strict';

    // set panel-controller application and register its controller
    angular
        .module("story-controller", [])
        .controller("storyController", storyController);

    // add additional services to be used within the controller
    storyController.$inject = ["$scope", "contentService"];

    // define the controller
    function storyController($scope, contentService) {
        // --------------------------------------------------------------------
        // define bindable members
        $scope.listOfIdeas;        

        // --------------------------------------------------------------------
        // call functions   
        activate();

        // --------------------------------------------------------------------
        // define functions    
        function activate() {
            var currentStoryId = contentService.getCurrentStory().id;
            // get all ideas from a story
            getListOfIdeas(currentStoryId);
        }
        
        function getListOfIdeas(storyId) {
            contentService
                .getAllIdeas(storyId)
                .then(function (listOfIdeas) {
                    $scope.listOfIdeas = listOfIdeas;
                });
        }

    }

})();