'use strict'

var theDevelopingDeveloperUtils = angular.module('theDevelopingDeveloperUtils');

theDevelopingDeveloperUtils.factory('Utils', [
	function() {

		return ({
			getDistanceBetweenTwoPoints : getDistanceBetweenTwoPoints,
			getRandomElementFromArray : getRandomElementFromArray,
			getDayOfYearFromDate : getDayOfYearFromDate,
			isLeapYear : isLeapYear,
			formatNumber : formatNumber
		});

		function getDistanceBetweenTwoPoints(point1, point2) {
			var earthsRadiusInKM = 6371;
			var dLat = deg2rad(point2.lat-point1.lat);
			var dLon = deg2rad(point2.long-point1.long); 
			var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
					Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
					Math.sin(dLon/2) * Math.sin(dLon/2); 
			var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
			return earthsRadiusInKM * c;
		}

		function getRandomElementFromArray(array) {
			var numberOfElements = array.length;
			return array[Math.floor(Math.random()*numberOfElements)];
		}

		function getDayOfYearFromDate(date) {
			var start = new Date(date.getFullYear(), 0, 0);
			var diff = date - start;
			var oneDayInMillis = 1000 * 60 * 60 * 24;
			var dayOfYear = Math.ceil(diff / oneDayInMillis);
			return dayOfYear;
		}

		function isLeapYear(date) {
			var year = date.getFullYear();
			return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
		}

		function formatNumber(number) {
			var ordinal = getNumberOrdinal(number);
			var csNumber = numberWithCommas(number);
			return csNumber + ordinal;
		}

		function getNumberOrdinal(number) {
			var lastCharOfNumber = (number % 10);
			switch (lastCharOfNumber) {
				case 1: return 'st';
				case 2: return 'nd';
				case 3: return 'rd';
				default: return 'th';
			}
		}

		function numberWithCommas(number) {
		    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		}

		function deg2rad(deg) {
			return deg * (Math.PI/180)
		}

	}
]);