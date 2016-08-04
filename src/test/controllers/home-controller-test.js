'use strict';

describe('HomeController', function() {
	var mockData = {
		backgroundImagePathsJsonPath : 'json/welcome-background-images.json',
		backgroundImagePaths : 'BackgroundImagePath',
		backgroundImagePath : 'BackgroundImage',
		quotesJsonPath : 'json/quotes.json',
		quotes : 'Quotes',
		quote : 'Quote' 
	}

	var homeController;
	var scope;
	var MockJSONService;
	var MockUtils;

	beforeEach(function () {
		module('theDevelopingDeveloperControllers');
		module('theDevelopingDeveloperServices');
		module('theDevelopingDeveloperUtils');
	});

	beforeEach(inject(function ($q, JSONService, Utils, $controller, $rootScope) {
		MockJSONService = JSONService;
		spyOn(MockJSONService, 'getJson').and.callFake(function (param) {
			var promise = $q.defer();
			if (param === mockData.backgroundImagePathsJsonPath) {
				promise.resolve({ data : { images : mockData.backgroundImagePaths } });
				return promise.promise;
			} else if (param === mockData.quotesJsonPath) {
				promise.resolve({ data : { quotes : mockData.quotes } });
				return promise.promise;
			}
		});

		MockUtils = Utils;
		spyOn(MockUtils, 'getRandomElementFromArray').and.callFake(function (param) {
			if (param === mockData.backgroundImagePaths) {
				return mockData.backgroundImagePath;
			} else if (param === mockData.quotes) {
				return mockData.quote;
			}
		});

		scope = $rootScope.$new();
		homeController = $controller('HomeController', {
			$scope : scope,
			JSONService : MockJSONService,
			Utils : MockUtils
		});
		$rootScope.$apply();
	}));

	it('should get the path to an main background image', function() {
		expect(MockJSONService.getJson).toHaveBeenCalledWith(mockData.backgroundImagePathsJsonPath);
		expect(MockJSONService.getJson).toHaveBeenCalledWith(mockData.quotesJsonPath);

		expect(MockUtils.getRandomElementFromArray).toHaveBeenCalledWith(mockData.backgroundImagePaths);
		expect(MockUtils.getRandomElementFromArray).toHaveBeenCalledWith(mockData.quotes);
		
		expect(scope.welcomeBackgroundImage).toEqual(mockData.backgroundImagePath);
		expect(scope.quote).toEqual(mockData.quote);
	});

});