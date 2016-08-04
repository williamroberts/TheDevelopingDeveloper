'use strict';

describe('FooterController', function() {
	var sublink1 = {
						title : 'Sublink 1 Title',
						href : 'Sublink 1 href',
						newWindow : false
					};
	var link1 = {
					title : 'Link 1 Title',
					href : 'Link 1 href',
					newWindow: false,
				};
	var link2 = {
					title : 'Link 2 Title',
					sublinks : [ sublink1 ]
				};
	var testData = {
		jsonPath : 'json/nav-links.json',
		navigationData : {
			title : 'Nav Title',
			introduction : 'Nav Introduction',
			links : [ link1, link2 ]
		}
	}
	var footerController;
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
				promise.resolve({ data : { navigationData : testData.navigationData } });
				return promise.promise;
			}
		});

		scope = $rootScope.$new();
		footerController = $controller('FooterController', {
			$scope: scope,
			JSONService: MockJSONService
		});
		$rootScope.$apply();
	}));

	it('should get the footer information', function() {
		expect(MockJSONService.getJson).toHaveBeenCalledWith(testData.jsonPath);
		
		expect(scope.footerData.title).toEqual(testData.navigationData.title);
		expect(scope.footerData.introduction).toEqual(testData.navigationData.introduction);
		expect(scope.footerData.links).toEqual([ link1, sublink1 ]);
	});
});