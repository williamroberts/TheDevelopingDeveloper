'use strict';

var theDevelopingDeveloperControllers = angular.module('theDevelopingDeveloperControllers');

theDevelopingDeveloperControllers.controller('F1PointsSystemController', ['$interval', 'F1Driver', 'F1PointsSystemService', '$scope',
	function ($interval, F1Driver, F1PointsSystemService, $scope) {
		$scope.requestCounters = {
			seasons: 0,
			currentPointsSystem: 0,
			championshipTableForSeason: 0
		};

		$scope.seasons = [];
		$scope.selectedSeason = { season : new Date().getFullYear() };
		$scope.pointsSystem = [];
		$scope.seasonPoints = { season: '', schedule: [], driverResults: [] };

		$scope.getTotalPoints = function(results) {
			var pointsTotal = 0;
			for(var i = 0; i < results.length; i++) {
				for(var j = 0; j < $scope.pointsSystem.length; j++) {
					if (results[i] === $scope.pointsSystem[j].position) {
					 	pointsTotal += $scope.pointsSystem[j].points;
					 	break;
					}
				}
			}
			return pointsTotal;
		}

		$scope.getStyle = function(result) {
			var didntEnter = { "background-color": "#ddd" };
			var firstPlace = { "color": "#CD7F32", "font-weight": "bold" };
			var secondPlace = { "color": "#E6E8FA", "font-weight": "bold" };
			var thirdPlace = { "color": "#A67D3D", "font-weight": "bold" };
			var style = '';

			if (result === 1) {
				style = firstPlace;
			} else if (result === 2) {
				style = secondPlace;
			} else if (result === 3) {
				style = thirdPlace;
			} else if (!result) {
				style = didntEnter;
			}

			return style;
		}

		function sortChampionshipStandings() {
			$scope.seasonPoints.driverResults.sort(function(a, b) {
				return $scope.getTotalPoints(b.results) - $scope.getTotalPoints(a.results);
			});
		}

		function getSeasons() {
			$scope.requestCounters.seasons++;
			F1PointsSystemService.getSeasons().then(function(result) {
				$scope.seasons = result.data.MRData.SeasonTable.Seasons;
				$scope.selectedSeason = $scope.seasons[$scope.seasons.length - 1];
			})
			.finally(function() {
				$scope.requestCounters.seasons--;
			});
		}

		function getCurrentPointsSystem() {
			$scope.requestCounters.currentPointsSystem++;
			F1PointsSystemService.getCurrentPointsSystem().then(function(result) {
				$scope.pointsSystem = result.data.points;
			})
			.finally(function() {
				$scope.requestCounters.currentPointsSystem--;
			});
		}

		function getChampionshipTableForSeason(season) {
			/*
				Have to get schedule and driver separately because if the season is the current one, 
				the results only go up to the last race.
			*/
			$scope.seasonPoints = { season: '', schedule: [], driverResults: [] };
			$scope.seasonPoints.season = season;
			F1PointsSystemService.getRaceScheduleForSeason(season).then(function(result) {
				$scope.seasonPoints.schedule = result.data.MRData.RaceTable.Races;
				$scope.requestCounters.championshipTableForSeason++;
				return F1PointsSystemService.getDriversForSeason(season);
			}).then(function(result) {
				var drivers = result.data.MRData.DriverTable.Drivers;
				for(var i = 0; i < drivers.length; i++) {
					var driver = drivers[i];
					(function(driver) {
						F1PointsSystemService.getRaceResultsForDriverAndSeason(driver, season).then(function(result) {
							var returned = result.data.MRData.RaceTable.Races;
							var results = new Array($scope.seasonPoints.schedule.length);
							for(var i = 0; i < returned.length; i++) {
								results[returned[i].round - 1] = parseInt(returned[i].Results[0].position);
							}
							$scope.seasonPoints.driverResults.push({ driver: driver, results: results });
							sortChampionshipStandings();
							$scope.requestCounters.championshipTableForSeason++;
						});
					})(driver);
					$scope.requestCounters.championshipTableForSeason--;
				}
				$scope.requestCounters.championshipTableForSeason--;
			});
		}

		getSeasons();
		getCurrentPointsSystem();
		getChampionshipTableForSeason($scope.selectedSeason.season);

		$scope.$watch('pointsSystem', function(newSystem, oldSystem) {
			if ($scope.seasonPoints.driverResults.length > 0) {
				sortChampionshipStandings();
			}
		}, true);

		$scope.$watch('selectedSeason', function(newSeason, oldSeason) {
			if (newSeason.season != oldSeason.season) {
				getChampionshipTableForSeason(newSeason.season);
			}
		});
	}
	]);