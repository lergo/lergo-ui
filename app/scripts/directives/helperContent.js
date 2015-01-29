'use strict';

angular.module('lergoApp').directive('helperContent', function($rootScope, $http, ContinuousSave, $sce) {
	return {
		templateUrl : 'views/directives/_helperContent.html',
		restrict : 'A',
		scope : {
			path : '=',
			user : '='
		},
		link : function postLink(scope) {
			var $scope = scope;
			function get() {
				$http({
					'method' : 'GET',
					'url' : '/backend/helpercontents',
					'params' : {
						'query' : JSON.stringify({
							'path' : $scope.path,
							'locale' : $rootScope.lergoLanguage
						})
					}
				}).then(function(result) {
					$scope.helperContent = result.data;
					if (!$scope.helperContent) {
						create({
							'path' : $scope.path,
							'locale' : $rootScope.lergoLanguage
						}).then(function(result) {
							$scope.helperContent = result.data;

						});
					}
				});
			}
			function create(content) {
				return $http.post('/backend/helpercontents/create', content);
			}
			function update(content) {
				return $http.post('/backend/helperContents/' + content._id + '/update', content);
			}

			get();
			var saveContent = new ContinuousSave({
				'saveFn' : function(value) {
					return update(value);
				}
			});

			$scope.$watch('helperContent', saveContent.onValueChange, true);
			$scope.isSaving = function() {
				return !!saveContent.getStatus().saving;
			};

			$scope.addHelperContent = function() {
				if (!$scope.helperContent.contents) {
					$scope.helperContent.contents = [];
				}
				$scope.helperContent.contents.push({});
			};

			$scope.removeHelperContent = function(index) {
				$scope.helperContent.contents.splice(index, 1);
			};
			$scope.$watch(function() {
				return $rootScope.lergoLanguage;
			}, function(newValue, oldValue) {
				if (!!newValue && !!oldValue && newValue !== oldValue) {
					get();
				}
			});
			$scope.getYoutubeEmbedSource = function(url) {
				var src = '//www.youtube.com/embed/' + $scope.getVideoId(url) + '?autoplay=0&rel=0&iv_load_policy=3';
				return $sce.trustAsResourceUrl(src);
			};
			$scope.getVideoId = function(url) {
				var value = null;
				if (!!url) {
					if (url.toLocaleLowerCase().indexOf('youtu.be') > 0) {
						value = url.substring(url.lastIndexOf('/') + 1);
					} else {
						value = url.split('?')[1].split('v=')[1];
					}
				}

				return value;
			};
		}

	};
});
