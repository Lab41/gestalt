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
        // * handling sources
        var getAllSourcesUrl = economicBackendBaseUrl + "getAllSources";
        // * handling series
        var getAllSeriesUrl = economicBackendBaseUrl + "getAllSeriesByTableName";
        // * handling values
        var getAllValuesUrl = economicBackendBaseUrl + "extractSeriesValuesBySeries";
        var getAllValuesByMostRecentDateUrl = economicBackendBaseUrl + "extractSeriesValuesBySeriesAndMostRecentDate";
        var getValuesByCountryUrl = economicBackendBaseUrl + "extractSeriesValuesByCountry";
        var getValuesByCountryAndMostRecentDateUrl = economicBackendBaseUrl + "extractSeriesValuesByCountryAndMostRecentDate";
        var getValuesByCountryAndDateUrl = economicBackendBaseUrl + "extractSeriesValuesByCountryAndDate";
        var getValuesByRegionUrl = economicBackendBaseUrl + "extractSeriesValuesByRegion";
        var getValuesByRegionAndMostRecentDateUrl = economicBackendBaseUrl + "extractSeriesValuesByRegionAndMostRecentDate";
        var getValuesByRegionAndDateUrl = economicBackendBaseUrl + "extractSeriesValuesByRegionAndDate";
        // * handling subgroups
        var getAllSubgroupsUrl = economicBackendBaseUrl + "getAllSubgroupsByGroup";
        var getAllCountriesUrl = economicBackendBaseUrl + "getAllCountriesBySubgroup";
        // * handling MV (the table that stores all the data front-end needs)
        var insertSeriesUrl = economicBackendBaseUrl + "insertSeriesToMV";
        var cleanupMVUrl = economicBackendBaseUrl + "cleanupMV";

        // --------------------------------------------------------------------     
        // return a economicService instance
        var economicService = {
            // * all functionalities to manipulate economic data
            // * handling sources
            getAllSources: getAllSources,
            // * handling series
            getAllSeries: getAllSeries,
            // * handling values
            getAllValues: getAllValues,
            getAllValuesByMostRecentDate: getAllValuesByMostRecentDate,
            getValuesByCountry: getValuesByCountry,
            getValuesByCountryAndMostRecentDate: getValuesByCountryAndMostRecentDate,
            getValuesByCountryAndDate: getValuesByCountryAndDate,
            getValuesByRegion: getValuesByRegion,
            getValuesByRegionAndMostRecentDate: getValuesByRegionAndMostRecentDate,
            getValuesByRegionAndDate: getValuesByRegionAndDate,
            // * handling subgroups
            getAllSubgroups: getAllSubgroups,
            getAllCountries: getAllCountries,
            // * handle MV (the table that stores all the data front-end needs)
            insertSeries: insertSeries,
            cleanupMV: cleanupMV,
            // --------------------------------------------
            // * nominal gdp
            getCountryNominalGdps: getCountryNominalGdps,
            getCountryNominalGdp: getCountryNominalGdp,
            // * real gdp
            getCountryRealGdps: getCountryRealGdps,
            getCountryRealGdp: getCountryRealGdp,
            getRegionRealGdp: getRegionRealGdp,
            // * country area
            getCountryArea: getCountryArea,
            getRegionArea: getRegionArea,
            // * region
            getGroupRegions: getGroupRegions,
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
        // * handling sources
        // ============================
        function getAllSources() {
            return callBackend(getAllSourcesUrl);
        }

        // ============================
        // * handling series
        // ============================
        function getAllSeries(tableName) {
            return callBackend(getAllSeriesUrl + "/" + tableName);
        }

        // ============================
        // * handling values
        // ============================
        function getAllValues(seriesId) {
            return callBackend(getAllValuesUrl + "/" + seriesId);
        }

        function getAllValuesByMostRecentDate(seriesId) {
            return callBackend(getAllValuesByMostRecentDateUrl + "/" + seriesId);
        }

        function getValuesByCountry(seriesId, countryId) {
            return callBackend(getValuesByCountryUrl + "/series/" + seriesId + "/country/" + countryId);
        }

        function getValuesByCountryAndMostRecentDate(seriesId, countryId) {
            return callBackend(getValuesByCountryAndMostRecentDateUrl + "/series/" + seriesId + "/country/" + countryId);
        }

        function getValuesByCountryAndDate(seriesId, countryId, date) {
            return callBackend(getValuesByCountryAndDateUrl + "/series/" + seriesId + "/country/" + countryId + "/date/" + date);
        }

        function getValuesByRegion(seriesId, groupId, subgroupId) {
            return callBackend(getValuesByRegionUrl + "/series/" + seriesId + "/group/" + groupId + "/subgroup/" + subgroupId);
        }

        function getValuesByRegionAndMostRecentDate(seriesId, groupId, subgroupId) {
            return callBackend(getValuesByRegionAndMostRecentDateUrl + "/series/" + seriesId + "/group/" + groupId + "/subgroup/" + subgroupId);
        }

        function getValuesByRegionAndDate(seriesId, groupId, subgroupId, date) {
            return callBackend(getValuesByRegionAndDateUrl + "/series/" + seriesId + "/group/" + groupId + "/subgroup/" + subgroupId + "/date/" + date);
        }

        // ============================
        // * handling subgroups
        // ============================
        function getAllSubgroups(groupId) {
            return callBackend(getAllSubgroupsUrl + "/" + groupId);
        }

        function getAllCountries(groupId, subgroupId) {
            return callBackend(getAllCountriesUrl + "/group/" + groupId + "/subgroup/" + subgroupId);
        }

        // ============================
        // * handling MV
        // ============================
        function insertSeries(tableName, seriesId) {
            return callBackend(insertSeriesUrl + "/table_name/" + tableName + "/series/" + seriesId);
        }

        function cleanupMV() {
            return callBackend(cleanupMVUrl);
        }

        // ============================
        // * nominal gdp           
        // ============================
        
        function getCountryNominalGdps(seriesId, countryId) {
            return getValuesByCountry(seriesId, countryId);
        }

        function getCountryNominalGdp(seriesId, countryId, date) {
            // TODO: verify first that there is a single nominal GDP per year for each country and handle it if there's none
            return getValuesByCountryAndDate(seriesId, countryId, date).then(function(listOfNominalGdps){
                return listOfNominalGdps[0];
            });
        }

        // ============================
        // * real gdp           
        // ============================

        function getCountryRealGdps(seriesId, countryId) {
            return getValuesByCountry(seriesId, countryId);
        }

        function getCountryRealGdp(seriesId, countryId, date) {
            // TODO: verify first that there is a single real GDP per year for each country and handle it if there's none
            return getValuesByCountryAndDate(seriesId, countryId, date).then(function(listOfRealGdps){
                return listOfRealGdps[0];
            });
        }

        function getRegionRealGdp(seriesId, groupId, subgroupId, date) {
            return getValuesByRegionAndDate(seriesId, groupId, subgroupId, date);
        }

        // ============================
        // * country area      
        // ============================
        
        function getCountryArea(seriesId, countryId) {
            // TODO: verify first that there is only one area year after year and handle it if there's none
            return getValuesByCountry(seriesId, countryId).then(function(listOfCountryAreas){
                return listOfCountryAreas[0];
            });
        }

        function getRegionArea(seriesId, groupId, subgroupId) {
            return getValuesByRegion(seriesId, groupId, subgroupId);
        }

        // ============================
        // * region      
        // ============================
        
        function getGroupRegions(groupId) {
            return getAllSubgroups(groupId);
        }

        function getRegionCountries(groupId, subgroupId) {
            return getAllCountries(groupId, subgroupId);
        }

    }

})();
