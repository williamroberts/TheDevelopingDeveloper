'use strict';

describe('F1PointsSystemController', function() {
	function generateMockDriverWithResults (driverLabel, consistentFinishingPosition) {
		var numberOfRounds = 3;
		var mockDriverResults = [];
		for (var i = 1; i <= numberOfRounds; i++) {
			mockDriverResults.push({ round : i, Results : [ { position : consistentFinishingPosition }] });
		}
		return { driver : driverLabel, results : mockDriverResults };
	}
	function generateDriverFinalStanding (driverWithResults) {
		var finishingPositions = [];
		for(var i = 0; i < driverWithResults.results.length; i++) {
			finishingPositions.push(driverWithResults.results[i].Results[0].position);
		}
		return {
			driver : driverWithResults.driver,
			results : finishingPositions
		};
	}

	var alwaysFinishesFirst = generateMockDriverWithResults('Driver2', 1);
	var alwaysFinishesSecond = generateMockDriverWithResults('Driver3', 2);
	var alwaysFinishesThird = generateMockDriverWithResults('Driver1', 3);
	var results = {}
	results[alwaysFinishesFirst.driver] = alwaysFinishesFirst.results;
	results[alwaysFinishesSecond.driver] = alwaysFinishesSecond.results;
	results[alwaysFinishesThird.driver] = alwaysFinishesThird.results;

	var driverStandings = [ generateDriverFinalStanding(alwaysFinishesFirst), 
							generateDriverFinalStanding(alwaysFinishesSecond),
							generateDriverFinalStanding(alwaysFinishesThird) ];

	var mockData = {
		season : new Date().getFullYear(),
		seasons : [ { season : 2013 }, { season : 2014 }, { season : 2015 } ],
		points : [ { position: 1, points: 10 }, { position: 2, points: 8 }, { position: 3, points: 6 } ],
		races : [ 'Race1', 'Race2', 'Race3' ],
		drivers : [ alwaysFinishesFirst.driver, alwaysFinishesSecond.driver, alwaysFinishesThird.driver ],
		results : results,
		driverStandings : driverStandings
	}

	var f1PointsSystemController;
	var scope;
	var MockF1PointsSystemService;
	var MockF1Driver;

	beforeEach(function () {
		module('theDevelopingDeveloperControllers');
		module('theDevelopingDeveloperServices');
		module('theDevelopingDeveloperFactories');
	});

	beforeEach(inject(function ($q, F1Driver, F1PointsSystemService, $rootScope, $controller) {
		MockF1Driver = F1Driver;
		MockF1PointsSystemService = F1PointsSystemService;
		spyOn(MockF1PointsSystemService, 'getCurrentPointsSystem').and.callFake(function () {
			var promise = $q.defer();
			promise.resolve({ data : { points : mockData.points } });
			return promise.promise;
		});
		spyOn(MockF1PointsSystemService, 'getSeasons').and.callFake(function () {
			var promise = $q.defer();
			promise.resolve({ data : { MRData : { SeasonTable : { Seasons : mockData.seasons } } } });
			return promise.promise;
		});
		spyOn(MockF1PointsSystemService, 'getRaceScheduleForSeason').and.callFake(function (season) {
			var promise = $q.defer();
			promise.resolve({ data : { MRData : { RaceTable : { Races: mockData.races } } } });
			return promise.promise;
		});
		spyOn(MockF1PointsSystemService, 'getDriversForSeason').and.callFake(function (season) {
			var promise = $q.defer();
			promise.resolve({ data : { MRData : { DriverTable : { Drivers : mockData.drivers } } } });
			return promise.promise;
		});
		spyOn(MockF1PointsSystemService, 'getRaceResultsForDriverAndSeason').and.callFake(function (driver, season) {
			var promise = $q.defer();
			promise.resolve({ data : { MRData : { RaceTable : { Races : mockData.results[driver] } } } });
			return promise.promise;
		});

		scope = $rootScope.$new();
		f1PointsSystemController = $controller('F1PointsSystemController', {
			$scope : scope,
			F1PointsSystemService : MockF1PointsSystemService,
			F1Driver : MockF1Driver
		});
	}));

	describe('init', function () {
		beforeEach(function() {
			scope.$digest();
		});

		describe('getSeasons', function () {
			it('should get available seasons', function() {
				expect(MockF1PointsSystemService.getSeasons).toHaveBeenCalled();
				expect(scope.seasons).toEqual(mockData.seasons);
			});
		});

		describe('getCurrentPointsSystem', function () {
			it('should get the current points system', function () {
				expect(MockF1PointsSystemService.getCurrentPointsSystem).toHaveBeenCalled();
				expect(scope.pointsSystem).toEqual(mockData.points);
			});
		});

		describe('getChampionshipTableForSeason', function () {
			it('should get all races for selected season', function () {
				expect(scope.seasonPoints.season).toBe(mockData.season);
				expect(MockF1PointsSystemService.getRaceScheduleForSeason).toHaveBeenCalledWith(mockData.season);
				expect(scope.seasonPoints.schedule).toBe(mockData.races);
			});
			it('should get the results for each driver during the season', function () {
				expect(MockF1PointsSystemService.getDriversForSeason).toHaveBeenCalledWith(mockData.season);
				expect(MockF1PointsSystemService.getRaceResultsForDriverAndSeason.calls.count()).toBe(mockData.drivers.length);
				for(var i = 0; i < mockData.drivers.length; i++) {
					expect(MockF1PointsSystemService.getRaceResultsForDriverAndSeason).toHaveBeenCalledWith(mockData.drivers[i], mockData.season);
				}
			});
			it('should correctly calculate the driver standings for the season', function () {
				expect(scope.seasonPoints.driverResults).toEqual(mockData.driverStandings);
			});
		});
	});

	describe('getTotalPoints', function () {
		it('should return the correct points total for a set of finishing positions', function() {
			scope.pointsSystem = [
				{ position: 1, points: 10 },
				{ position: 2, points: 8 },
				{ position: 3, points: 6 }
			];
			var testResults = [ 1, 2, 3 ];

			expect(scope.getTotalPoints(testResults)).toEqual(24);
		});
	});

	describe('getStyle', function () {
		it('should return colour: #CD7F32 when the race result is first place', function() {
			var finishingPosition = 1;
			var result = scope.getStyle(finishingPosition);
			expect(result.color).toEqual('#CD7F32');
		});
		it('should return colour: #E6E8FA when the race result is second place', function() {
			var finishingPosition = 2;
			var result = scope.getStyle(finishingPosition);
			expect(result.color).toEqual('#E6E8FA');
		});
		it('should return colour: #A67D3D when the race result is third place', function() {
			var finishingPosition = 3;
			var result = scope.getStyle(finishingPosition);
			expect(result.color).toEqual('#A67D3D');
		});
		it('should return background-colour: #ddd when the race wasn\'t entered', function() {
			var finishingPosition = undefined;
			var result = scope.getStyle(finishingPosition);
			expect(result['background-color']).toEqual('#ddd');
		});
	});

});