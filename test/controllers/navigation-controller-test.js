'use strict';

describe('NavigationController', function() {
	var navigationController;
	var MockJSONService;
	var scope;

	beforeEach(function () {
		module('theDevelopingDeveloperControllers');
		module('theDevelopingDeveloperServices');
	});

	beforeEach(inject(function ($q, JSONService, $controller, $rootScope) {
		MockJSONService = JSONService;
		spyOn(MockJSONService, 'getJson').and.callFake(function (param) {
			if (param === 'json/nav-links.json') {
				var promise = $q.defer();
				promise.resolve({ data : { navigationData : 'These are the navigation links' } });
				return promise.promise;
			}
		});

		scope = $rootScope.$new();
		navigationController = $controller('NavigationController', {
			$scope: scope,
			JSONService: MockJSONService
		});
		$rootScope.$apply();
	}));

	it('should get the navigation links', function () {
		expect(MockJSONService.getJson).toHaveBeenCalledWith('json/nav-links.json');
		expect(scope.navigationData).toEqual('These are the navigation links');
		expect(scope.navbarCollapsed).toEqual(true);
	});
});