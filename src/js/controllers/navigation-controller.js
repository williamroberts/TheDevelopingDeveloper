'use strict';

var theDevelopingDeveloperControllers = angular.module('theDevelopingDeveloperControllers');

theDevelopingDeveloperControllers.controller('NavigationController', ['JSONService', '$scope', '$http', 
	function (JSONService, $scope, $http) {
		$scope.navigationData = '';
		$scope.navbarCollapsed = true;

		JSONService.getJson('json/nav-links.json').then(function(result) {
			$scope.navigationData = result.data.navigationData; 
		});
	}
	]);

