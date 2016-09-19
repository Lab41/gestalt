// wrap in Immediately Invoked Function Expression to avoid global scope 
(function() {
    'use strict';

    // set vis-controller application and register its controller
    angular
        .module("vis-controller", [])
        .controller("visController", visController);

    // add additional services to be used within the controller
    visController.$inject = ["$scope", "$state", "contentService"];

    // define the controller
    function visController($scope, $state, contentService) {
		// --------------------------------------------------------------------
        // define bindable members
        $scope.directiveName;

        $scope.nodes;
        $scope.nodeGroups;
        $scope.dummyData;

        // --------------------------------------------------------------------
        // call functions
        activate(); 

        // --------------------------------------------------------------------
        // define functions
        function activate() {
            console.log("in vis controller!!!!");
            // TODO: for now set Economics workspace's vis as the default
            var currentVisId = 1;

            var getDirectiveName = function(visId) {
                return contentService.getDirectiveName(visId).then(function(directiveName) {
                    console.log("directiveName: " + angular.toJson($scope.directiveName));
                    $scope.directiveName = directiveName;
                    console.log("$scope.directiveName: " + angular.toJson($scope.directiveName));
                });
            };
            var getDummyData = function() {
                $scope.dummyData = [{"name": "category1", "value": 5}, {"name": "category2", "value": 2}, {"name": "category3", "value": 1}];
                console.log("$scope.dummyData: " + angular.toJson($scope.dummyData));
                $scope.dataHasLoaded = true;
            }

            getDirectiveName;
            getDummyData;

        }

        function getListOfCountryNodes() {
            return contentService.getCountryNodes().then(function(listOfCountryNodes) {
                $scope.nodes = listOfCountryNodes
            });
        }

        function getListOfNodeGroups() {
            return contentService.getNodeGroups().then(function(listOfNodeGroups) {
                $scope.nodeGroups = listOfNodeGroups;
            });
        }

    }

})();