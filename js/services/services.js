'use strict';

var theDevelopingDeveloperServices = angular.module('theDevelopingDeveloperServices');

theDevelopingDeveloperServices.service('JSONService', ['$http',
	function($http) {
		return {
			getJson : function(location) {
				return $http.get(location);
			},
			getJsonp : function(location) {
				return $http.jsonp(location);
			}
		}
	}
	]);

theDevelopingDeveloperServices.factory('WorldBankAPIService', ['Utils', '$http',
	function(Utils, $http) {

		return ({
			getEstimatedWorldPopulationForDate : getEstimatedWorldPopulationForDate,
			getEstimatedBritishPopulationForDate : getEstimatedBritishPopulationForDate,
			getEstimatedPopulationForDayOfYear : getEstimatedPopulationForDayOfYear
		});

		function getEstimatedWorldPopulationForDate(date) {
			var startYear = date.getFullYear();
			var endYear = startYear + 1;
			return $http.jsonp('http://api.worldbank.org/countries/1W/indicators/SP.POP.TOTL?date=' + startYear + ':' + endYear + '&format=jsonP&prefix=JSON_CALLBACK');
		}

		function getEstimatedBritishPopulationForDate(date) {
			var startYear = date.getFullYear();
			var endYear = startYear + 1;
			return $http.jsonp('http://api.worldbank.org/countries/GB/indicators/SP.POP.TOTL?date=' + startYear + ':' + endYear + '&format=jsonP&prefix=JSON_CALLBACK');
		}

		function getEstimatedPopulationForDayOfYear(isLeapYear, dayOfYear, startPopulation, endPopulation) {
			var diff = endPopulation - startPopulation;
			return Math.round(startPopulation + (dayOfYear * (diff / (isLeapYear ? 366 : 365))));
		}

	}
	]);

theDevelopingDeveloperServices.factory('AustraliasBigThingsService', ['$http',
	function($http) {
		var australiasBigThings = 'json/australias-big-things.json';

		return ({
			getAll : getAll
		})

		function getAll() {
			return $http.get(australiasBigThings);
		}
	}
	]);

theDevelopingDeveloperServices.factory('F1PointsSystemService', ['$http',
	function($http) {
		var currentPointsSystem = 'json/current-f1-points-system.json';
		var baseUrl = 'http://ergast.com/api/f1/';

		return ({
			getCurrentPointsSystem : getCurrentPointsSystem,
			getSeasons : getSeasons,
			getRaceScheduleForSeason : getRaceScheduleForSeason,
			getDriversForSeason : getDriversForSeason,
			getRaceResultsForDriverAndSeason : getRaceResultsForDriverAndSeason
		})

		function getCurrentPointsSystem() {
			return $http.get(currentPointsSystem);
		}

		function getSeasons() {
			return $http.get(baseUrl + 'seasons.json?limit=100');
		}

		function getRaceScheduleForSeason(season) {
			return $http.get(baseUrl + season + '.json');
		}

		function getDriversForSeason(season) {
			return $http.get(baseUrl + season + '/drivers.json?limit=100');
		}

		function getRaceResultsForDriverAndSeason(driver, season) {
			return $http.get(baseUrl + season + '/drivers/' + driver.driverId + '/results.json');
		}
	}
	]);