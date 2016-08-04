'use strict';

describe('AustraliasBigThingsController', function() {
	var testData = {
		states : ['New South Wales',
					'Western Australia',
					'Australian Capital Territory',
					'Victoria',
					'Tasmania',
					'South Australia',
					'Northern Territory'],
		mapAustraliaAndTasmania : {
			center: new google.maps.LatLng(-28.274398, 133.775136), // Australia with Tasmania
			zoom: 4,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			scrollwheel: false
		},
		bigThing : {
            id : 1,
            name : 'Giant Mushroom',
            latitude : -35.245721,
            longitude : 149.065548,
            address : 'Belconnen Markets, 10 Lathlain St, Belconnen ACT 2617'
        },
	}
	var australiasBigThingsController;
	var MockAustraliasBigThingsService;
	var MockUtils;
	var scope;

	beforeEach(function () {
		module('theDevelopingDeveloperControllers');
		module('theDevelopingDeveloperServices');
		module('theDevelopingDeveloperFactories');
		module('theDevelopingDeveloperUtils');
	});

	beforeEach(inject(function ($q, GMLocation, AustraliasBigThingsService, Utils, $rootScope, $controller) {
		MockAustraliasBigThingsService = AustraliasBigThingsService;
		spyOn(MockAustraliasBigThingsService, 'getAll').and.callFake(function () {
			var promise = $q.defer();
			promise.resolve({ data : { states : testData.states } });
			return promise.promise;
		});

		scope = $rootScope.$new();
		australiasBigThingsController = $controller('AustraliasBigThingsController', {
			$scope : scope,
			AustraliasBigThingsService : MockAustraliasBigThingsService,
			Utils : MockUtils
		});
		scope.$digest();
	}));

	describe('init', function () {
		it('should set all the states', function () {
			expect(scope.states).toBe(testData.states);
		});
		it('should set the map options (Australia and Tasmania)', function () {
			expect(scope.mapOptions).toEqual(testData.mapAustraliaAndTasmania);
		})
	});

	describe('handleSelection', function () {
		it('should remove selected item from list if already in list', function () {
			scope.selectedBigThings.push(testData.bigThing);
			expect(scope.selectedBigThings.length).toBe(1);
			scope.handleSelection(testData.bigThing);
			expect(scope.selectedBigThings.length).toBe(0);
		});
		it('should add selected item to list if NOT already in list', function () {
			expect(scope.selectedBigThings.length).toBe(0);
			scope.handleSelection(testData.bigThing);
			expect(scope.selectedBigThings.length).toBe(1);
		});
	});
});