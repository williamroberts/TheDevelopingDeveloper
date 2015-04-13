'use strict';

var theDevelopingDeveloperViewControllers = angular.module('theDevelopingDeveloperControllers');

theDevelopingDeveloperViewControllers.controller('HomeController', ['JSONService', 'Utils', '$scope', '$routeParams',
	function (JSONService, Utils, $scope, $routeParams) {
		$scope.welcomeBackgroundImage = "";
		$scope.quote = "";
		JSONService.getJson('json/welcome-background-images.json').then(
			function(result) {
				if (typeof $routeParams.bg !== 'undefined') {
					$scope.welcomeBackgroundImage = {
						"url": "/img/welcome-backgrounds/" + $routeParams.bg + ".png"
					};
				} else {
					$scope.welcomeBackgroundImage = Utils.getRandomElementFromArray(result.data.images);
				}
			}
			);
		JSONService.getJson('json/quotes.json').then(function(result) {
			$scope.quote = Utils.getRandomElementFromArray(result.data.quotes);
		});
	}
	]);