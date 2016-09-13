// wrap in Immediately Invoked Function Expression to avoid global scope 
(function() {
    'use strict';

    // set viz-controller application and register its controller
    angular
        .module("viz-controller", [])
        .controller("vizController", vizController);

    // add additional services to be used within the controller
    vizController.$inject = ["$q", "$scope", "$state", "contentFactory"];

    // define the controller
    function vizController($q, $scope, $state, contentFactory) {
		// --------------------------------------------------------------------
        // define bindable members
        $scope.nodes;
        $scope.nodeGroups;
        $scope.geojson;

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
                        contentFactory.getCdis(),
                        contentFactory.getCountryGroup(),
                        contentFactory.getGeojson($state.params.grid)
                    ])
                    .then(function(listOfNodes, listOfNodeGroups, geojson)
                    {
                        $scope.nodes = listOfNodes;
                        $scope.nodeGroups = listOfNodeGroups;
                        $scope.geojson = geojson;
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