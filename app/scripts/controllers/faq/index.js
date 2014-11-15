'use strict';

angular.module('lergoApp').controller('FaqIndexCtrl', function($scope, $http, $rootScope, ContinuousSave) {
	function get() {
		$http({
			'method' : 'GET',
			'url' : '/backend/faqs',
			'params' : {
				'query' : JSON.stringify({
					'locale' : $rootScope.lergoLanguage
				})
			}
		}).then(function(result) {
			$scope.faq = result.data;
			if (!$scope.faq) {
				create({
					'locale' : $rootScope.lergoLanguage
				}).then(function(result) {
					$scope.faq = result.data;

				});
			}
		});
	}
	function create(content) {
		return $http.post('/backend/faqs/create', content);
	}
	function update(content) {
		return $http.post('/backend/faqs/' + content._id + '/update', content);
	}

	get();
	var saveContent = new ContinuousSave({
		'saveFn' : function(value) {
			return update(value);
		}
	});

	$scope.$watch('faq', saveContent.onValueChange, true);
	$scope.isSaving = function() {
		return !!saveContent.getStatus().saving;
	};

	$scope.addFAQ = function() {
		if (!$scope.faq.contents) {
			$scope.faq.contents = [];
		}
		$scope.faq.contents.push({});
	};

	$scope.removeFAQ = function(index) {
		$scope.faq.contents.splice(index, 1);
	};
	$scope.$watch(function() {
		return $rootScope.lergoLanguage;
	}, function(newValue, oldValue) {
		if (!!newValue && !!oldValue && newValue !== oldValue) {
			get();
		}
	});
});
