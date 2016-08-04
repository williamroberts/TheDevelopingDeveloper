'use strict';

var theDevelopingDeveloperDirectives = angular.module('theDevelopingDeveloperDirectives');

theDevelopingDeveloperDirectives.directive('ddLoading', ['$timeout',
	function($timeout) {
		return {
			restrict: 'A',
			link: link
		}

		function link(scope, element, attrs) {
			var rand = Math.ceil(Math.random() * 100);
			var overlayId = 'loading-overlay' + rand;
			var spinnerApplied = false;
			var spinner;
			attrs.$observe('ddLoading', function (newValue) {
				if (parseInt(newValue) === 0) {
					// Remove spinner
					if (!!spinner) {
						spinner.stop();
					}
				} else if (!spinnerApplied) {
					var opts = {
						lines: 13, // The number of lines to draw
						length: 20, // The length of each line
						width: 10, // The line thickness
						radius: 30, // The radius of the inner circle
						corners: 1, // Corner roundness (0..1)
						rotate: 0, // The rotation offset
						direction: 1, // 1: clockwise, -1: counterclockwise
						color: '#000', // #rgb or #rrggbb or array of colors
						speed: 1, // Rounds per second
						trail: 60, // Afterglow percentage
						shadow: false, // Whether to render a shadow
						hwaccel: false, // Whether to use hardware acceleration
						className: 'spinner' // The CSS class to assign to the spinner
					};
					spinner = new Spinner(opts).spin(element[0]);
					spinnerApplied = true;
				}
			});
		}
	}
	]);

theDevelopingDeveloperDirectives.directive('ddNavigationLink', [
	function() {

		return {
			restrict: 'E',
			template: '<a>{{ title }}</a>',
			replace: true,
			scope: {
				destination: '=',
				title: '=',
				newWindow: '='
			},
			link: link
		}

		function link(scope, element, attrs) {
			element.attr('title', scope.title);
			if (scope.newWindow) {
				element.attr('target', '_blank');
			}
			if (scope.destination.substr(0, 1) === "/") {
				element.attr('href', '#' + scope.destination);
			} else {
				element.attr('href', scope.destination);
			}
		}
	}
	]);

theDevelopingDeveloperDirectives.directive('ddAddRemoveRow', [
	function() {

		return {
			restrict: 'E',
			template: '<span><input type="button" value="+" style="width: 30px;" alt="Add Row" ng-click="addRow()"/> <input type="button" value="-" style="width: 30px;" alt="Remove Row" ng-click="removeRow()"/></span>',
			replace: true,
			scope: {
				array: '=',
				ordinal: '=',
				defaultValue: '='
			},
			link: link
		}

		function link(scope, element, attrs) {
			scope.addRow = function() {
				var keys = Object.keys(this.array[0]);
				var newObject = {};
				for(var i = 0; i < keys.length; i++) {
					if (this.ordinal && i === 0) {
						newObject[keys[i]] = this.array[this.array.length - 1][keys[i]] + 1;
					} else {
						newObject[keys[i]] = this.defaultValue;
					}
				}
				this.array.push(newObject);
			}

			scope.removeRow = function() {
				if (this.array.length > 1) {
					this.array.pop();
				}
			}
		}
	}
	]);

theDevelopingDeveloperDirectives.directive('ddHighlight', [
	function() {

		return {
			restrict: 'A',
			link : link
		}

		function link(scope, element, attrs) {
			scope.$watch(attrs.ddHighlight, function (newVal, oldVal) {
				function changeBackgroundColor(event) {
					element.css('background-color', oldBackgroundColour);
				}
				if (!newVal && !oldVal) { // init
					element.css('-o-transition', '0.5s linear background-color');
					element.css('-moz-transition', '0.5s linear background-color');
					element.css('-webkit-transition', '0.5s linear background-color');
					element.css('transition', '0.5s linear background-color');
				}
				if (newVal !== oldVal) {
					var oldBackgroundColour = element.css('background-color');
					element[0].addEventListener('oTransitionEnd', changeBackgroundColor);
					element[0].addEventListener('mozTransitionEnd', changeBackgroundColor);
					element[0].addEventListener('webkitTransitionEnd', changeBackgroundColor);
					element[0].addEventListener('transitionEnd', changeBackgroundColor);
					element.css('background-color', 'white');
				}
			});
		}
	}
	]);

theDevelopingDeveloperDirectives.directive('ddGmSearch', ['GMLocation',
	function(GMLocation) {

		return {
			restrict: 'E',
			template: '<input id="google-places-search" type="text" class="form-control" id="startingLocation" placeholder="Enter starting location" />',
			replace: true,
			scope: {
				location: '='
			},
            link: link
		}

		function link(scope, element, attrs) {
			var autocompleteInput = element[0];
            var autocomplete = new google.maps.places.Autocomplete(autocompleteInput, {});
            google.maps.event.addListener(autocomplete, 'place_changed', function() {
                var place = autocomplete.getPlace();
                if (place.name === '') {
                	scope.location = '';
                } else {
	                scope.location = new GMLocation(0,
	                	place.name,
	                	place.formatted_address,
	                	place.geometry.location.lat(),
	                	place.geometry.location.lng());
	            }
                scope.$apply();
            });
			google.maps.event.addDomListener(autocompleteInput, 'keydown', function(e) {
				if (e.keyCode == 13) {
					e.preventDefault();
				}
			});
			google.maps.event.addDomListener(autocompleteInput, 'blur', function(e) {
				if (this.value === '') {
					scope.location = '';
					scope.$apply();
				}
			});
    }

	}
]);

theDevelopingDeveloperDirectives.directive('ddGmDirections', ['$uibModal',
	function($uibModal) {

		return {
			restrict: 'E',
			templateUrl: 'js/directives/templates/ddGmDirections.html',
			require: '^ddGmMap',
			link: link
		}

		function link(scope, element, attrs, ddGmMapCtrl) {

			scope.showDirections = function() {
				var directionsResult = ddGmMapCtrl.getDirectionsResult();
				var directionsDisplay = new google.maps.DirectionsRenderer({
					directions: directionsResult,
					panel: angular.element(document.querySelector('#ddGmDirections-content'))[0],
					suppressMarkers: true
				});

				var modalOptions = {
					title: 'Directions',
					content: directionsResult,//'<div id="directions-container"></div>',
					actionButtonText: 'OK',
					closeButtonText: 'Close',
				};

				var modalController = function ($scope, $uibModalInstance, modalOptions) {
					$scope.modalOptions = modalOptions;
					$scope.modalOptions.ok = function (result) {
              $uibModalInstance.close(result);
          };
          $scope.modalOptions.close = function (result) {
              $uibModalInstance.dismiss('cancel');
          };
				};

				var modalInstance = $uibModal.open({
					templateUrl: 'js/directives/templates/ddModal.html',
					size: 'lg',
					controller: modalController,
					resolve: {
						modalOptions: function() {
							return modalOptions;
						}
					}
				});
			}

			scope.canViewDirections = function() {
				return ddGmMapCtrl.canCalculateDirections();
			}

		}

	}
])

theDevelopingDeveloperDirectives.directive('ddGmMap', [
	function () {

		return {
			restrict: 'E',
			templateUrl: 'js/directives/templates/ddGmMap.html',
			replace: true,
			scope: {
				mapOptions: '=',
				origin: '=',
				markers: '=',
				roundTrip: '='
			},
			require: ['ddGmMap'],
			controller: controller,
			link: link
		}

		function controller($scope) {
			var map;
			var mapOptions = $scope.mapOptions;
			var markers = [];
			var origin;
			var waypoints = [];
			var directionsResult;

			this.initMap = function(mapElem) {
				if (map === void(0)) {
					map = new google.maps.Map(mapElem[0], mapOptions);
				}
			}

			this.addOrigin = function(newOrigin, oldOrigin) {
				this.removeOrigin(oldOrigin);
				origin = newOrigin;
				this.addMarker(newOrigin, 'https://maps.gstatic.com/mapfiles/markers2/boost-marker-mapview.png');
			}

			this.removeOrigin = function(oldOrigin) {
				origin = '';
				this.removeMarker(oldOrigin);
			}

			this.addWaypoint = function(newWaypoint) {
				this.addMarker(newWaypoint, 'https://maps.gstatic.com/mapfiles/markers2/icon_green.png');
				waypoints.push(newWaypoint);
			}

			this.removeWaypoint = function(waypoint) {
				this.removeMarker(waypoint);
		    	for (var i = 0; i < waypoints.length; i++) {
		    		if (waypoint.id === waypoints[i].id) {
		    			waypoints.splice(i, 1);
		    			break;
		    		}
		    	}
			}

			this.calculateWaypointToRemove = function(currentWaypoints, previousWaypoints) {
				var waypointToRemove;
				for (var i = 0; i < previousWaypoints.length; i++) {
					if (currentWaypoints.indexOf(previousWaypoints[i]) === -1) {
						waypointToRemove = previousWaypoints[i];
						break;
					}
				}
				return waypointToRemove;
			}

			this.addMarker = function(newMarker, iconFile) {
				var marker = new google.maps.Marker({
					id: newMarker.id,
					position: new google.maps.LatLng(newMarker.lat, newMarker.long),
					map: map,
					title: newMarker.name,
	        icon: iconFile
				});
				var infowindow = new google.maps.InfoWindow({
					content: '<p><strong>' + newMarker.name + '</strong><br />' + newMarker.address + '</p>'
				});
				google.maps.event.addListener(marker, 'click', function() {
					infowindow.open(map, marker);
				});
				markers.push(marker);
			}

			this.removeMarker = function(marker) {
				for (var i = 0; i < markers.length; i++) {
					if (marker.id === markers[i].id) {
						markers[i].setMap(null);
						markers[i] = null;
						break;
					}
				}
			    markers = markers.filter(
			    	function(val) {
			    		return !!val;
			    	}
		    	);
			}

			this.canCalculateDirections = function() {
				return !!origin && waypoints.length > 0;
			}

			this.calculateDirections = function(roundTrip) {
				var directionsDisplay = new google.maps.DirectionsRenderer({
					map: map,
					panel: angular.element(document.querySelector('#directions-container'))[0],
					suppressMarkers: true
				});

				// NEED TO ORDER THE WAYPOINTS - HOW TO DO THIS?!?!?

				// Add start as first waypoint
				var copyOfWayPoints = waypoints.slice(0);
				copyOfWayPoints.unshift(origin);

				if (!!roundTrip) {
					copyOfWayPoints.push(origin); // Roundtrip should end at the same place they started
				}

				// Divide waypoints into batches small enough to send to Google
				var batches = this.placeWayPointsIntoBatches(copyOfWayPoints);

				for (var i = 0; i < batches.length; i++) {
					var wayPointsForReq = [];
					// Start at one, and end one before the end to avoid adding origin and destination
					for (var j = 1; j < batches[i].length-1; j++) {
						var place = { location: new google.maps.LatLng(batches[i][j].lat, batches[i][j].long) };
						wayPointsForReq.push(place);
					}

					var originOfBatch = batches[i][0];
					var destinationOfBatch = batches[i][batches[i].length-1];

					var request = this.buildDirectionsRequest(originOfBatch, wayPointsForReq, destinationOfBatch);

					var counter = 0;
					var directionsService = new google.maps.DirectionsService();
					directionsService.route(request, function(response, status) {
						if (status == google.maps.DirectionsStatus.OK) {
							if (!directionsResult) { // First request
								directionsResult = response;
							} else {
								directionsResult.request.destination = response.request.destination;
								directionsResult.request.waypoints = directionsResult.request.waypoints.concat(response.request.waypoints);
								directionsResult.routes[0].bounds = directionsResult.routes[0].bounds.extend(response.routes[0].bounds.getNorthEast());
								directionsResult.routes[0].bounds = directionsResult.routes[0].bounds.extend(response.routes[0].bounds.getSouthWest());
								directionsResult.routes[0].legs = directionsResult.routes[0].legs.concat(response.routes[0].legs);
								directionsResult.routes[0].overview_path = directionsResult.routes[0].overview_path.concat(response.routes[0].overview_path);
								directionsResult.routes[0].waypoint_order = directionsResult.routes[0].waypoint_order.concat(response.routes[0].waypoint_order);
							}
							directionsDisplay.setDirections(directionsResult);
						} else {
							// error
						}
					});
				}

			};

			this.getDirectionsResult = function() {
				return directionsResult;
			}

			this.placeWayPointsIntoBatches = function(waypoints) {
				var batchSize = 10; //Google max = start + 8 waypoints + end
				var batches = [];
				var lastEntryOfPreviousBatch;
				while (waypoints.length > 0) {
					var newBatch;
					if (lastEntryOfPreviousBatch) {
						newBatch = waypoints.splice(0, batchSize - 1);
						newBatch.unshift(lastEntryOfPreviousBatch);
					} else {
						newBatch = waypoints.splice(0, batchSize);
					}
					batches.push(newBatch);
					lastEntryOfPreviousBatch = newBatch[batchSize - 1];
				}
				return batches;
			}

			this.buildDirectionsRequest = function(origin, waypoints, destination) {
				return {
					origin: new google.maps.LatLng(origin.lat, origin.long),
					destination: new google.maps.LatLng(destination.lat, destination.long),
					travelMode: google.maps.TravelMode.DRIVING,
					waypoints: waypoints,
					region: 'au'
				};
			}

		}

		function link(scope, element, attrs, ctrl) {
			var controller = ctrl[0];
			controller.initMap(angular.element(document.querySelector('#gmaps')));

			scope.canCalculateDirections = function() {
				return controller.canCalculateDirections();
			};

			scope.calculateDirections = function() {
				controller.calculateDirections(this.roundTrip);
			};

			scope.$watchCollection('markers', function(newItems, previousItems) {
				if (newItems.length > previousItems.length) {
					controller.addWaypoint(newItems[newItems.length - 1]);
				} else {
					controller.removeWaypoint(controller.calculateWaypointToRemove(newItems, previousItems));
				}
			});
			scope.$watch('origin', function(newOrigin, previousOrigin) {
				if (newOrigin) {
					controller.addOrigin(newOrigin, previousOrigin);
				} else {
					controller.removeOrigin(previousOrigin);
				}
			});

		}
	}
]);

theDevelopingDeveloperDirectives.directive('ddNQueens', ['$timeout',
	function($timeout) {

		return {
			restrict: 'E',
			templateUrl: 'js/directives/templates/ddNQueens.html',
			replace: true,
			scope: {},
			link: link
		}

		function link(scope, element, attrs) {
			var ChessPieces = {
				white: {
					king: "&#9812",
					queen: "&#9813",
					rook: "&#9814",
					bishop: "&#9815",
					knight: "&#9816",
					pawn: "&#9817"
				},
				black: {
					king: "&#9818",
					queen: "&#9819",
					rook: "&#9820",
					bishop: "&#9821",
					knight: "&#9822",
					pawn: "&#9823"
				}
			};
			function ChessPiece(symbol) {
				this.symbol = symbol;
			}

			scope.board = [];
			scope.delay = 500;

			function resetBoard(dimension) {
				scope.board = [];
				for(var i = 0; i < dimension; i++) {
					scope.board.push([]);
					for (var j = 0; j < dimension; j++) {
						scope.board[i].push(null);
					}
				}
			}

			scope.solveIt = function () {
				function solveBoard(board) {
					var queenLocations = [];

					function solveRow(row, col) {
						if (row === board.length) {
							return;
						}
						$timeout(function() {
							for(var chkCol = col; chkCol < board[row].length; chkCol++) {
								if (isSafe(row, chkCol)) {
									placeQueen(row, chkCol);
									queenLocations.push({ "row": row, "col": chkCol });
									solveRow(row + 1, 0);
								}
							}
							if (queenLocations.length > 0 && queenLocations[queenLocations.length - 1].row != row) {
								var lastQueen = queenLocations.pop();
								removeQueen(lastQueen.row, lastQueen.col);
								solveRow(lastQueen.row, lastQueen.col + 1);
							}
						}, scope.delay);
					}
					function squareHasQueen(row, col) {
						return board[row][col];
					}
					function placeQueen(row, col) {
						board[row][col] = new ChessPiece(ChessPieces.white.queen);
					}
					function removeQueen(row, col) {
						board[row][col] = null;
					}
					function isSafe(row, col) {
						return isSafeHorizontally(row) && isSafeVertically(col) && isSafeDiagonally(row, col);
					}
					function isSafeHorizontally(row) {
						for (var col = 0; col < board[row].length; col++) {
							if (board[row][col]) {
								return false;
							}
						}
						return true;
					}
					function isSafeVertically(col) {
						for (var row = 0; row < board.length; row++) {
							if (board[row][col]) {
								return false;
							}
						}
						return true;
					}
					function isSafeDiagonally(row, col) {
						return isSafeDiagonallyTopLeftToBottomRight(row, col) && isSafeDiagonallyTopRightToBottomLeft(row, col);
					}
					function isSafeDiagonallyTopLeftToBottomRight(row, col) {
						var startPoint;
						if (row > col) {
							startPoint = { "row": row-col, "col": 0 };
						} else {
							startPoint = { "row": 0, "col": col-row }
						}
						for (var row = startPoint.row, column = startPoint.col; row < board.length && column < board[startPoint.row].length; row++, column++) {
							if (board[row][column]) {
								return false;
							}
						}
						return true;
					}
					function isSafeDiagonallyTopRightToBottomLeft(row, col) {
						var sum = row + col;
						var dimension = board.length;
						var startPoint;

						if (sum > dimension -1) {
							startPoint = { "row": sum - dimension + 1, "col": dimension - 1};
						} else {
							startPoint = { "row": 0, "col": sum };
						}

						for (var chkRow = startPoint.row, chkCol = startPoint.col; chkRow < dimension && chkRow >= 0 && chkCol < dimension && chkCol >= 0; chkRow++, chkCol--) {
							if (board[chkRow][chkCol]) {
								return false;
							}
						}

						return true;
					}
					return solveRow(0,0);
				}
				resetBoard(scope.board.length);
				solveBoard(scope.board);
			}

			scope.$watch('dimension', function(newDimension, previousDimension) {
				resetBoard(newDimension);
			});
		}

	}
	]);

theDevelopingDeveloperDirectives.directive('ddChessBoard', [
	function() {

		return {
			restrict: 'E',
			templateUrl: 'js/directives/templates/ddChessBoard.html',
			replace: true,
			scope: {
				board: '='
			},
			link: link
		}

		function link(scope, element, attrs) {
			scope.chessBoard = [];

			scope.$watch('board', function(newBoard, previousBoard) {
				scope.chessBoard = newBoard;
			});
		}

	}
	]);

theDevelopingDeveloperDirectives.directive('ddChessBoardSquare', [
	function() {

		return {
			restrict: 'E',
			templateUrl: 'js/directives/templates/ddChessBoardSquare.html',
			replace: true,
			scope: {
				isLight: '=',
				piece: '='
			},
			link: link
		}

		function link(scope, element, attrs) {
			scope.light = { "background-color": "#AD2222", "color": "#fff" };
			scope.dark = { "background-color": "#222", "color": "#fff" };
		}

	}
	]);
