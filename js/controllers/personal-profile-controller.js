'use strict';

var theDevelopingDeveloperControllers = angular.module('theDevelopingDeveloperControllers');

theDevelopingDeveloperControllers.controller('PersonalProfileController', ['JSONService', '$scope',
	function (JSONService, $scope) {
		$scope.profile = [];

		JSONService.getJson('json/personal-profile.json').then(function(result) {
			$scope.profile = result.data.pageData;
		});
	}
	]);