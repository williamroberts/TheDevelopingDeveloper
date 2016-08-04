'use strict';

var theDevelopingDeveloperControllers = angular.module('theDevelopingDeveloperControllers');

theDevelopingDeveloperControllers.controller('ContactMeController', ['$scope',
	function ($scope) {
		$scope.email = {
			name: '',
			destinationEmailAddress: 'thedevelopingdeveloper@outlook.com',
			subject: '',
			message: ''
		};
	}
	]);