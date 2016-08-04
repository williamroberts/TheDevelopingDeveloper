'use strict';

describe('PersonalProfileController', function() {
	var testData = {
		jsonPath : 'json/personal-profile.json',
		profile : 'This is my personal profile'
	}
	var personalProfileController;
	var MockJSONService;
	var scope;

	beforeEach(function () {
		module('theDevelopingDeveloperControllers');
		module('theDevelopingDeveloperServices');
	});

	beforeEach(inject(function ($q, JSONService, $controller, $rootScope) {
		MockJSONService = JSONService;
		spyOn(MockJSONService, 'getJson').and.callFake(function (param) {
			if (param === testData.jsonPath) {
				var promise = $q.defer();
				promise.resolve({ data : { pageData : testData.profile } });
				return promise.promise;
			}
		});

		scope = $rootScope.$new();
		personalProfileController = $controller('PersonalProfileController', {
			$scope: scope,
			JSONService: MockJSONService
		});
	}));

	it('should get my personal profile', function() {
		scope.$digest();
		expect(MockJSONService.getJson).toHaveBeenCalledWith(testData.jsonPath);
		expect(scope.profile).toEqual(testData.profile);
	});
});