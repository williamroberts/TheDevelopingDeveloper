'use strict';

describe('BasicProfileController', function() {
	var testData = {
		jsonPath : 'json/basic-profile-info.json',
		profile : 'This is my basic profile'
	}
	var basicProfileController;
	var MockJSONService;
	var scope;

	beforeEach(function () {
		module('theDevelopingDeveloperServices');
		module('theDevelopingDeveloperControllers');
	});

	beforeEach(inject(function ($q, JSONService, $controller, $rootScope) {
		MockJSONService = JSONService;
		spyOn(MockJSONService, 'getJson').and.callFake(function (param) {
			if (param === testData.jsonPath) {
				var promise = $q.defer();
				promise.resolve({ data : { pageData : testData.profile} });
				return promise.promise;
			}
		});

		scope = $rootScope.$new();
		basicProfileController = $controller('BasicProfileController', {
			$scope : scope,
			JSONService : MockJSONService
		});
		$rootScope.$apply();
	}));

	it('should get my basic profile', function() {
		expect(MockJSONService.getJson).toHaveBeenCalledWith(testData.jsonPath);
		expect(scope.basicInfos).toEqual(testData.profile);
	});
});
