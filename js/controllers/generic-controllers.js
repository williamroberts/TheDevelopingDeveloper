'use strict';

var theDevelopingDeveloperGenericControllers = angular.module('theDevelopingDeveloperGenericControllers');

theDevelopingDeveloperGenericControllers.controller('NavigationController', ['JSONService', '$scope', '$http', 
	function (JSONService, $scope, $http) {
		$scope.navigationData = '';
		$scope.navbarCollapsed = true;

		JSONService.getJson('json/nav-links.json').then(function(result) {
			$scope.navigationData = result.data.navigationData; 
		});
	}
	]);

theDevelopingDeveloperGenericControllers.controller('FooterController', ['JSONService', '$scope', '$http',
	function (JSONService, $scope, $http) {
		$scope.footerData = {
			title: '',
			introduction: '',
			links: []
		};
		JSONService.getJson('json/nav-links.json').then(function(result) {
			$scope.footerData.title = result.data.navigationData.title;
			$scope.footerData.introduction = result.data.navigationData.introduction;
			var links = result.data.navigationData.links;
			for (var i = 0; i < links.length; i++) {
				if (!!links[i].sublinks && links[i].sublinks.length > 0) {
					for (var j = 0; j < links[i].sublinks.length; j++) {
						$scope.footerData.links.push(links[i].sublinks[j]);
					}
				} else {
					$scope.footerData.links.push(links[i]);
				}
			}
		});
	}
	]);

/////////////////////////
//   API CONTROLLERS   //
/////////////////////////
theDevelopingDeveloperGenericControllers.controller('WorldBankController', ['WorldBankAPIService', 'Utils', '$scope', 
	function (WorldBankAPIService, Utils, $scope) {
		var dateOfBirth = new Date(1986, 1, 18);

		$scope.worldPopulationAtDateOfBirth = "";
		$scope.britishPopulationAtDateOfBirth = "";

		WorldBankAPIService
		.getEstimatedWorldPopulationForDate(dateOfBirth)
		.then(function(result) {
			var estimatedWorldPopulation = WorldBankAPIService.getEstimatedPopulationForDayOfYear(Utils.isLeapYear(dateOfBirth), Utils.getDayOfYearFromDate(dateOfBirth), Number(result.data[1][1].value), Number(result.data[1][0].value));
			$scope.worldPopulationAtDateOfBirth = Utils.formatNumber(estimatedWorldPopulation);
		});

		WorldBankAPIService
		.getEstimatedBritishPopulationForDate(dateOfBirth)
		.then(function(result) {
			var estimatedBritishPopulation = WorldBankAPIService.getEstimatedPopulationForDayOfYear(Utils.isLeapYear(dateOfBirth), Utils.getDayOfYearFromDate(dateOfBirth), Number(result.data[1][1].value), Number(result.data[1][0].value));
			$scope.britishPopulationAtDateOfBirth = Utils.formatNumber(estimatedBritishPopulation);
		});
	}
	]);