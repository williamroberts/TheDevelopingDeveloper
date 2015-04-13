'use strict';

var theDevelopingDeveloperServices = angular.module('theDevelopingDeveloperServices');

theDevelopingDeveloperServices.service('F1PointsSystemService', ['$http',
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