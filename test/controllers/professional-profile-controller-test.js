'use strict';

describe('ProfessionalProfileController', function() {
	var testData = {
		jsonPath : 'json/professional-profile.json',
		profile : 'This is my resume'
	}
	var professionalProfileController;
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
		professionalProfileController = $controller('ProfessionalProfileController', {
			$scope: scope,
			JSONService: MockJSONService
		});
		$rootScope.$apply();
	}));

	it('should get my professional profile', function() {
		expect(MockJSONService.getJson).toHaveBeenCalledWith(testData.jsonPath);
		expect(scope.profile).toEqual(testData.profile);
	});
});