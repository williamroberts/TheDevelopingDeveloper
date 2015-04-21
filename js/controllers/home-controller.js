'use strict';

var theDevelopingDeveloperViewControllers = angular.module('theDevelopingDeveloperControllers');

theDevelopingDeveloperViewControllers.controller('HomeController', ['JSONService', 'Utils', '$scope',
	function (JSONService, Utils, $scope) {
		$scope.welcomeBackgroundImage = '';
		$scope.quote = '';
		JSONService.getJson('json/welcome-background-images.json').then(function (result) {
			$scope.welcomeBackgroundImage = Utils.getRandomElementFromArray(result.data.images);
		});
		JSONService.getJson('json/quotes.json').then(function (result) {
			$scope.quote = Utils.getRandomElementFromArray(result.data.quotes);
		});
	}
	]);