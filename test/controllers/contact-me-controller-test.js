'use strict';

describe('ContactMeController', function() {
	var contactMeController;
	var scope;

	beforeEach(function () {
		module('theDevelopingDeveloperControllers');
	});

	beforeEach(inject(function ($controller, $rootScope) {
		scope = $rootScope.$new();
		contactMeController = $controller('ContactMeController', {
			$scope: scope
		});
	}));

	it('should have the skeleton data for an email', function() {
		expect(scope.email).toEqual({
			name: '',
			destinationEmailAddress: 'thedevelopingdeveloper@outlook.com',
			subject: '',
			message: ''
		});
	});
});