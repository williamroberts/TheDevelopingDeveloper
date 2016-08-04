'use strict';

var theDevelopingDeveloperFilters = angular.module('theDevelopingDeveloperFilters');

theDevelopingDeveloperFilters.filter('Trust', ['$sce', 
	function($sce){
		return function(input) {
			return $sce.trustAsHtml(input);
		};
	}
	]);

theDevelopingDeveloperFilters.filter('Ordinal', [
	function() {
		return function(input) {
			var inputAsString = '' + input;
			var lastChar = inputAsString.charAt(inputAsString.length-1);
			if ((input < 10 || input > 20)) {
				if (lastChar === "1") {
					return inputAsString + "st";
				} else if (lastChar === "2") {
					return inputAsString + "nd";
				} else if (lastChar === "3") {
					return inputAsString + "rd";
				}
			}
			return inputAsString + "th";
		};
	}
	]);