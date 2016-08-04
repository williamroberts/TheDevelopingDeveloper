'use strict';

var theDevelopingDeveloperControllers = angular.module('theDevelopingDeveloperControllers');

theDevelopingDeveloperControllers.controller('ResumeController', ['JSONService', '$scope',
	function (JSONService, $scope) {
		$scope.resume = [];

		JSONService.getJson('json/resume.json').then(function (result) {
			$scope.resume = result.data.pageData;
		});
	}
	]);