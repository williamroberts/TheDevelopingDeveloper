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