'use strict';

var theDevelopingDeveloperServices = angular.module('theDevelopingDeveloperServices');

theDevelopingDeveloperServices.service('AustraliasBigThingsService', ['$http',
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