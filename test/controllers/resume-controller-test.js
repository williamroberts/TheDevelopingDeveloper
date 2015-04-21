'use strict';

describe('ResumeController', function() {
	var testData = {
		jsonPath : 'json/resume.json',
		resume : 'This is my resume'
	}
	var resumeController;
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
				promise.resolve({ data : { pageData : testData.resume } });
				return promise.promise;
			}
		});

		scope = $rootScope.$new();
		resumeController = $controller('ResumeController', {
			$scope: scope,
			JSONService: MockJSONService
		});
		$rootScope.$apply();
	}));

	it('should get my resume', function() {
		expect(MockJSONService.getJson).toHaveBeenCalledWith(testData.jsonPath);
		expect(scope.resume).toEqual(testData.resume);
	});
});