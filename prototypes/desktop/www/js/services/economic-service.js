// wrap in Immediately Invoked Function Expression to avoid global scope 
(function() {
    'use strict';

    // set economic-service application and register its service
    angular
        .module("economic-service", [])
        .service("economicService", economicService);

    // add additional services to be used within the service
    economicService.$inject = ["$http", "$log"];

    // define the service
    function economicService($http, $log) {
        // --------------------------------------------------------------------
        // for backend
        var economicBackendBaseUrl = api_config.content_economic_service_uri;
        // * nominal gdp
        var getAllNominalGdpUrl = economicBackendBaseUrl + "getAllNominalGdpByCountry";
        var getSingleNominalGdpUrl = economicBackendBaseUrl + "getSingleNominalGdpByCountryAndDate"
        // * real gdp
        var getAllRealGdpUrl = economicBackendBaseUrl + "getAllRealGdpByCountry";
        var getSingleRealGdpUrl = economicBackendBaseUrl + "getSingleRealGdpByCountryAndDate";
        var getRegionRealGdpUrl = economicBackendBaseUrl + "getAllRealGdpByRegionAndDate";
        // * country area
        var getCountryAreaUrl = economicBackendBaseUrl + "getCountryAreaByCountry";
        // * region
        var getRegionCountriesUrl = economicBackendBaseUrl + "getAllCountriesByRegion";

        // --------------------------------------------------------------------     
        // return a economicService instance
        var economicService = {
            // * nominal gdp
            getAllNominalGdp: getAllNominalGdp,
            getSingleNominalGdp: getSingleNominalGdp,
            // * real gdp
            getAllRealGdp: getAllRealGdp,
            getSingleRealGdp: getSingleRealGdp,
            getRegionRealGdp: getRegionRealGdp,
            // * country area
            getCountryArea: getCountryArea,
            // * region
            getRegionCountries: getRegionCountries
        };
        return economicService;

        // --------------------------------------------------------------------
        // function definition used in service instance
        function callBackend(backendUrl) {
            $log.log("****** GET " + backendUrl + " ******");
            return $http.get(backendUrl)
                        .then(function(backendResponse) { return backendResponse.data; });
        }

        // ============================
        // * nominal gdp           
        // ============================
        
        function getAllNominalGdp(countryId) {
            return callBackend(getAllNominalGdpUrl + "/" + countryId);
        }

        function getSingleNominalGdp(countryId, date) {
            // TODO: verify first that there is a single nominal GDP per year for each country and handle it if there's none
            return callBackend(getSingleNominalGdpUrl + "/country/" + countryId + "/date/" + date).then(function(listOfRealGdps){
                return listOfRealGdps[0];
            });
        }

        // ============================
        // * real gdp           
        // ============================

        function getAllRealGdp(countryId) {
            return callBackend(getAllRealGdpUrl + "/" + countryId);
        }

        function getSingleRealGdp(countryId, date) {
            // TODO: verify first that there is a single real GDP per year for each country and handle it if there's none
            return callBackend(getSingleRealGdpUrl + "/country/" + countryId + "/date/" + date).then(function(listOfRealGdps){
                return listOfRealGdps[0];
            });
        }

        function getRegionRealGdp(regionType, regionName, date) {
            return callBackend(getRegionRealGdpUrl + "/region_type/" + regionType + "/region_name/" + regionName + "/date/" + date);
        }

        // ============================
        // * country area      
        // ============================
        
        function getCountryArea(countryId) {
            // TODO: verify first that there is only one area year after year and handle it if there's none
            return callBackend(getRegionRealGdpUrl + "/" + countryId).then(function(listOfCountryAreas){
                return listOfCountryAreas[0];
            });
        }

        // ============================
        // * region      
        // ============================
        
        function getRegionCountries(regionId) {
            return callBackend(getRegionCountriesUrl + "/" + regionId);
        }

    }

})();