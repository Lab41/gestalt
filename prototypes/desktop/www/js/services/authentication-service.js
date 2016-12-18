// wrap in Immediately Invoked Function Expression to avoid global scope 
(function() {
    'use strict';

    // set authentication-service application and register its service
    angular
        .module("authentication-service", [])
        .service("authenticationService", authenticationService);

    // add additional services to be used within the service
    authenticationService.$inject = ["$http", "$log", "$rootScope", "$window"];

    // define the service
    function authenticationService($http, $log, $rootScope, $window) {
        // --------------------------------------------------------------------
        // for backend 
        var backendBaseUrl = apiConfig.authenticationUri;
        var getAllPersonasUrl = backendBaseUrl + "getAllPersonas";
        var getSinglePersonaUrl = backendBaseUrl + "getSinglePersona";

        // --------------------------------------------------------------------
        // for local storage 
        var currentPersonaInLocalStorage = "currentGestaltPersona";
        // ensure that view is the same when application is opened in multiple tabs
        angular.element($window).on("storage", function(event) {
            if(event.key === currentPersonaInLocalStorage) {
                $rootScope.$apply();
            }
        });                            

        // --------------------------------------------------------------------
        // return an authenticationService instance
        var authenticationService = {
            getAllPersonas: getAllPersonas,
            setCurrentPersona: setCurrentPersona,
            getCurrentPersona: getCurrentPersona,
            unsetCurrentPersona: unsetCurrentPersona,
            cleanup: cleanup
        }
        return authenticationService;

        // --------------------------------------------------------------------
        // function definition used in service instance
        function callBackend(backendUrl) {
            $log.log("****** GET " + backendUrl + " ******");
            return $http.get(backendUrl)
                        .then(function(backendResponse) { return backendResponse.data; });
        }

        function getAllPersonas() {
            return callBackend(getAllPersonasUrl);
        }

        function getPersona(personaId) {
            // available but NOT USED 
            return callBackend(getSinglePersonaUrl + "/" + personaId);
        }

        function setCurrentPersona(personaId, personaName) {
            var currentPersona = {
                id: personaId,
                name: personaName
            };
            $window.localStorage && $window.localStorage.setItem(currentPersonaInLocalStorage, JSON.stringify(currentPersona));
        }

        function getCurrentPersona() {
            return JSON.parse($window.localStorage && $window.localStorage.getItem(currentPersonaInLocalStorage));
        }

        function unsetCurrentPersona() {
            $window.localStorage && $window.localStorage.removeItem(currentPersonaInLocalStorage);
        }

        function cleanup() {
            unsetCurrentPersona();
        }

    }

})();

