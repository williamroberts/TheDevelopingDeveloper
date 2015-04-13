'use strict';

var theDevelopingDeveloperControllers = angular.module('theDevelopingDeveloperControllers');

theDevelopingDeveloperControllers.controller('AustraliasBigThingsController', ['GMLocation', 'AustraliasBigThingsService', 'Utils', '$scope',
	function(GMLocation, AustraliasBigThingsService, Utils, $scope) {

		$scope.mapOptions = {
			center: new google.maps.LatLng(-28.274398, 133.775136), // Australia with Tasmania
			zoom: 4,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			scrollwheel: false
		};
		$scope.origin = '';
		$scope.selectedBigThings = [];

		$scope.states = [];

		$scope.handleSelection = function(bigThing) {
			var bigThingObj  = new GMLocation(bigThing.id, 
				bigThing.name,
				bigThing.address, 
				bigThing.latitude, 
				bigThing.longitude);
			var currIdxOfItem = $scope.selectedBigThings.indexOf(bigThingObj);
			// The following should be added to lib.js as a function(itemToSearchFor, array) returning the index if found, -1 if not
			var indexOfItemInArray = -1;
			for (var i = 0; i < $scope.selectedBigThings.length; i++) {
				if ($scope.selectedBigThings[i].id === bigThingObj.id) {
					indexOfItemInArray = i;
				}
			}
			if (indexOfItemInArray > -1) {
				$scope.selectedBigThings.splice(indexOfItemInArray, 1);
			} else {
				$scope.selectedBigThings.push(bigThingObj);
			}
		}

		AustraliasBigThingsService
		.getAll()
		.then(function(result) {
			$scope.states = result.data.states;
		},
		function(error) {
		// handle error
		});
	}
	]);