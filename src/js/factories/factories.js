'use strict';

var theDevelopingDeveloperFactories = angular.module('theDevelopingDeveloperFactories');

theDevelopingDeveloperFactories.factory('F1Driver', [
	function() {
		var F1Driver = function(code, givenName, familyName, nationality, results, pointsTotal) {
			this.code = code;
			this.givenName = givenName;
			this.familyName = familyName;
			this.nationality = nationality;
			this.results = results;
			this.pointsTotal = pointsTotal;
		};

		return F1Driver;
	}
	]);

theDevelopingDeveloperFactories.factory('GMLocation', [
	function() {
		var GMLocation = function (id, name, address, lat, long) {
			this.id = id;
			this.name = name;
			this.address = address;
			this.lat = lat;
			this.long = long;
		}

		return GMLocation;
	}
	]);