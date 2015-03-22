'use strict';

var theDevelopingDeveloperViewControllers = angular.module('theDevelopingDeveloperViewControllers');

theDevelopingDeveloperViewControllers.controller('HomeController', ['JSONService', 'Utils', '$scope', '$routeParams',
	function (JSONService, Utils, $scope, $routeParams) {
		$scope.welcomeBackgroundImage = "";
		$scope.quote = "";
		JSONService.getJson('json/welcome-background-images.json').then(
			function(result) {
				if (typeof $routeParams.bg !== 'undefined') {
					$scope.welcomeBackgroundImage = {
						"url": "/img/welcome-backgrounds/" + $routeParams.bg + ".png"
					};
				} else {
					$scope.welcomeBackgroundImage = Utils.getRandomElementFromArray(result.data.images);
				}
			}
			);
		JSONService.getJson('json/quotes.json').then(function(result) {
			$scope.quote = Utils.getRandomElementFromArray(result.data.quotes);
		});
	}
	]);

theDevelopingDeveloperViewControllers.controller('PersonalProfileController', ['JSONService', '$scope',
	function (JSONService, $scope) {
		$scope.profile = [];

		JSONService.getJson('json/personal-profile.json').then(function(result) {
			$scope.profile = result.data.pageData;
		});
	}
	]);

theDevelopingDeveloperViewControllers.controller('ProfessionalProfileController', ['JSONService', '$scope',
	function (JSONService, $scope) {
		$scope.profile = [];

		JSONService.getJson('json/professional-profile.json').then(function(result) {
			$scope.profile = result.data.pageData;
		});
	}
	]);

theDevelopingDeveloperViewControllers.controller('BasicProfileController', ['JSONService', '$scope',
	function (JSONService, $scope) {
		$scope.basicInfos = [];

		JSONService.getJson('json/basic-profile-info.json').then(function(result) {
			$scope.basicInfos = result.data.pageData;
		});
	}
	]);

theDevelopingDeveloperViewControllers.controller('ResumeController', ['JSONService', '$scope',
	function (JSONService, $scope) {
		$scope.resume = [];

		JSONService.getJson('json/resume.json').then(function(result) {
			$scope.resume = result.data.pageData;
		});
	}
	]);

theDevelopingDeveloperViewControllers.controller('ContactMeController', ['$scope',
	function ($scope) {
		$scope.email = {
			name: '',
			destinationEmailAddress: 'thedevelopingdeveloper@outlook.com',
			subject: '',
			message: ''
		};
	}
	]);

theDevelopingDeveloperViewControllers.controller('AustraliasBigThingsController', ['GMLocation', 'AustraliasBigThingsService', 'Utils', '$scope',
	function(GMLocation, AustraliasBigThingsService, Utils, $scope) {

		$scope.mapOptions = {
			center: new google.maps.LatLng(-28.274398, 133.775136), // Australia with Tasmania
			zoom: 4,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			scrollwheel: false
		};
		$scope.origin = '';
		$scope.selectedBigThings = [];

		$scope.states = [];

		$scope.handleSelection = function(bigThing) {
			var bigThingObj  = new GMLocation(bigThing.id, 
				bigThing.name,
				bigThing.address, 
				bigThing.latitude, 
				bigThing.longitude);
			var currIdxOfItem = $scope.selectedBigThings.indexOf(bigThingObj);
			// The following should be added to lib.js as a function(itemToSearchFor, array) returning the index if found, -1 if not
			var indexOfItemInArray = -1;
			for (var i = 0; i < $scope.selectedBigThings.length; i++) {
				if ($scope.selectedBigThings[i].id === bigThingObj.id) {
					indexOfItemInArray = i;
				}
			}
			if (indexOfItemInArray > -1) {
				$scope.selectedBigThings.splice(indexOfItemInArray, 1);
			} else {
				$scope.selectedBigThings.push(bigThingObj);
			}
		}

		AustraliasBigThingsService
		.getAll()
		.then(function(result) {
			$scope.states = result.data.states;
		},
		function(error) {
		// handle error
		});
	}
	]);

theDevelopingDeveloperViewControllers.controller('F1PointsSystemController', ['$interval', 'F1Driver', 'F1PointsSystemService', '$scope',
	function ($interval, F1Driver, F1PointsSystemService, $scope) {
		$scope.requestCounters = {
			seasons: 0,
			currentPointsSystem: 0,
			championshipTableForSeason: 0
		};

		var currentYear = new Date().getFullYear();
		$scope.seasons = [];
		$scope.selectedSeason = { season: currentYear };
		$scope.pointsSystem = [];
		$scope.seasonPoints = {
			season: '',
			schedule: [],
			driverResults: []
		};

		function resetData() {
			$scope.seasonPoints = {
				season: '',
				schedule: [],
				driverResults: []
			};
		}

		function sortChampionshipStandings() {
			$scope.seasonPoints.driverResults.sort(function(a, b) {
				return $scope.getTotalPoints(b.results) - $scope.getTotalPoints(a.results);
			});
		}

		function getSeasons() {
			$scope.requestCounters.seasons++;
			F1PointsSystemService.getSeasons()
			.then(function(result) {
				$scope.seasons = result.data.MRData.SeasonTable.Seasons;
				$scope.selectedSeason = $scope.seasons[$scope.seasons.length - 1];
			})
			.finally(function() {
				$scope.requestCounters.seasons--;
			});
		}

		function getCurrentPointsSystem() {
			$scope.requestCounters.currentPointsSystem++;
			F1PointsSystemService.getCurrentPointsSystem()
			.then(function(result) {
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
			$scope.seasonPoints.season = season;
			F1PointsSystemService.getRaceScheduleForSeason(season)
			.then(function(result) {
				$scope.seasonPoints.schedule = result.data.MRData.RaceTable.Races;
				$scope.requestCounters.championshipTableForSeason++;
				return F1PointsSystemService.getDriversForSeason(season);
			})
			.then(function(result) {
				var drivers = result.data.MRData.DriverTable.Drivers;
				for(var i = 0; i < drivers.length; i++) {
					var driver = drivers[i];
					(function(driver) {
						F1PointsSystemService.getRaceResultsForDriverAndSeason(driver, season)
						.then(function(result) {
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

		getSeasons();
		getCurrentPointsSystem();
		getChampionshipTableForSeason($scope.selectedSeason.season);

		$scope.$watch('pointsSystem', function(newSystem, oldSystem) {
			if ($scope.seasonPoints.driverResults.length > 0) {
				sortChampionshipStandings();
			}
		}, true);

		$scope.$watch('selectedSeason', function(newSeason, oldSeason) {
			resetData();
			if (newSeason.season != oldSeason.season) {
				getChampionshipTableForSeason(newSeason.season);
			}
		});
	}
	]);







