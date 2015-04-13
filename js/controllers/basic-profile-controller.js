'use strict';

var theDevelopingDeveloperControllers = angular.module('theDevelopingDeveloperControllers');

theDevelopingDeveloperControllers.controller('BasicProfileController', ['JSONService', '$scope',
	function (JSONService, $scope) {
		$scope.basicInfos = [];

		JSONService.getJson('json/basic-profile-info.json').then(function(result) {
			$scope.basicInfos = result.data.pageData;
		});
	}
	]);