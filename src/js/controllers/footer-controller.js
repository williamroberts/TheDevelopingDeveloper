'use strict';

var theDevelopingDeveloperControllers = angular.module('theDevelopingDeveloperControllers');

theDevelopingDeveloperControllers.controller('FooterController', ['JSONService', '$scope',
	function (JSONService, $scope) {
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
				if (!!links[i].sublinks && links[i].sublinks.length > 0) { // TODO remove empty sublinks [] from json file
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