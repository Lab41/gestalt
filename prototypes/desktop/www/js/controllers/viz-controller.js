// wrap in Immediately Invoked Function Expression to avoid global scope 
(function() {
    'use strict';

    // set viz-controller application and register its controller
    angular
        .module("viz-controller", [])
        .controller("vizController", vizController);

    // add additional services to be used within the controller
    vizController.$inject = ["$q", "$scope", "$state", "contentService"];

    // define the controller
    function vizController($q, $scope, $state, contentService) {
		// --------------------------------------------------------------------
        // define bindable members
        $scope.nodes;
        $scope.nodeGroups;
        $scope.dynamicDirectives;
        $scope.dummyData = [{"name": "category1", "value": 5}, {"name": "category2", "value": 2}, {"name": "category3", "value": 1}];

        // --------------------------------------------------------------------
        // call functions
        activate(); 

        // --------------------------------------------------------------------
        // define functions
        function activate() {
            // TODO: for now set Economics workspace's vis as the default
            getEconomicsData();
        }

        function getEconomicsData() {
            // retrieve data in parallel
            return $q.all([
                        contentService.getCdis(),
                        contentService.getCountryGroup(),
                        contentService.getDynamicDirectives()
                    ])
                    .then(function(listOfNodes, listOfNodeGroups, data)
                    {
                        $scope.nodes = listOfNodes;
                        $scope.nodeGroups = listOfNodeGroups;
                        $scope.dynamicDirectives = data;
                    });
        }

        function getGestaltData() {
            // TODO
            return
        }

        function getOlympicsData() {
            // TODO
            return
        }
    
    }

})();