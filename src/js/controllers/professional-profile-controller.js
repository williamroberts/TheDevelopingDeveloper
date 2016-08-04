'use strict';

var theDevelopingDeveloperControllers = angular.module('theDevelopingDeveloperControllers');

theDevelopingDeveloperControllers.controller('ProfessionalProfileController', ['JSONService', '$scope',
	function (JSONService, $scope) {
		$scope.profile = [];

		JSONService.getJson('json/professional-profile.json').then(function(result) {
			$scope.profile = result.data.pageData;
		});
	}
	]);