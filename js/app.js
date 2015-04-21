'use strict';

angular.module('theDevelopingDeveloperFactories', []);
angular.module('theDevelopingDeveloperControllers', []);
angular.module('theDevelopingDeveloperServices', []);
angular.module('theDevelopingDeveloperDirectives', []);
angular.module('theDevelopingDeveloperFilters', []);
angular.module('theDevelopingDeveloperUtils', []);

var theDevelopingDeveloper = angular.module('theDevelopingDeveloper', [
	'angularytics',
	'ui.bootstrap',
	'ngRoute',
	'ngSanitize',
	'theDevelopingDeveloperFactories',
	'theDevelopingDeveloperControllers',
	'theDevelopingDeveloperServices',
	'theDevelopingDeveloperDirectives',
	'theDevelopingDeveloperFilters',
	'theDevelopingDeveloperUtils'
	]);

theDevelopingDeveloper.config(['$routeProvider', 'AngularyticsProvider',
	function($routeProvider, AngularyticsProvider) {
		AngularyticsProvider.setEventHandlers(['GoogleUniversal']);

		var basePageLocation = '/html/pages';
		var baseAboutMePageLocation = basePageLocation + '/about-me';
		var baseLabsPageLocation = basePageLocation + '/labs';

		var pageFileSuffix = '.html';

		var comingSoonPageLocation = basePageLocation + '/coming-soon.html';

		var errorPageUrl = '/404';
		var errorPageLocation = basePageLocation + '/404.html';

		function setupTopLevelRoutes() {
			$routeProvider.when('/', {
				templateUrl: basePageLocation + '/home.html',
				title: 'Home',
				controller: 'HomeController'
			}).
			when('/contact-me', {
				templateUrl: basePageLocation + '/contact-me.html',
				title: 'Contact Me',
				controller: 'ContactMeController'
			}).
			when('/credits', {
				// templateUrl: basePageLocation + '/credits.html'
				redirectTo: '/coming-soon'
			}).
			when(errorPageUrl, {
				templateUrl: errorPageLocation,
				title: 'Error'
			})
		}

		function setupAboutMeRoutes() {
			$routeProvider.when('/about-me/professional-profile', {
				templateUrl: baseAboutMePageLocation + '/profile.html',
				title: 'Professional Profile',
				controller: 'ProfessionalProfileController'
			}).
			when('/about-me/personal-profile', {
				templateUrl: baseAboutMePageLocation + '/profile.html',
				title: 'Personal Profile',
				controller: 'PersonalProfileController'
			}).
			when('/about-me/resume', {
				templateUrl: baseAboutMePageLocation + '/resume.html',
				title: 'Resume',
				controller: 'ResumeController'
			});
		}

		function setupLabsRoutes() {
			// $routeProvider.when('/labs/australias-big-things', {
			// 	templateUrl: baseLabsPageLocation + '/australias-big-things.html',
			// 	controller: 'AustraliasBigThingsController'
			// });
			$routeProvider.when('/labs/8-queens-problem', {
				templateUrl: baseLabsPageLocation + '/8-queens-problem.html',
				title: '8 Queens Problem'
			}).
			when('/labs/f1-points-system', {
				templateUrl: baseLabsPageLocation + '/f1-points-system.html',
				title: 'F1 Points System',
				controller: 'F1PointsSystemController'
			}).
			when('/labs/:p', {
				title: 'Coming Soon',
				redirectTo: '/coming-soon'
			});
		}

		function setupMiscRoutes() {
			$routeProvider.when('/coming-soon', {
				templateUrl: comingSoonPageLocation,
				title: 'Coming Soon'
			}).
			otherwise({
				redirectTo: errorPageUrl
			});
		}

		setupTopLevelRoutes();
		setupAboutMeRoutes();
		setupLabsRoutes();
		setupMiscRoutes();

		// Testing
		$routeProvider.when('/background/:bg', {
			templateUrl: basePageLocation + '/home.html',
			controller: 'HomeController'
		});

	}
]);

theDevelopingDeveloper.run(['$rootScope', '$window', 'Angularytics',
	function($rootScope, $window, Angularytics) {
		Angularytics.init();
		$rootScope.$on("$routeChangeSuccess", function(oldRoute, newRoute){
			$rootScope.title = newRoute.title;
		});
		$rootScope.$on('$routeChangeSuccess', function () {
			var interval = setInterval(function() {
				if (document.readyState == 'complete') {
					$window.scrollTo(0, 0);
					clearInterval(interval);
				}
			}, 200);
		});
	}
	]);