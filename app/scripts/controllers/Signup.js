'use strict';

angular.module('lergoApp').controller('SignupCtrl', function($scope, $log, LergoClient, $location) {
	$scope.signupForm = {
		'username' : null,
		'email' : null,
		'password' : null,
		'passwordConfirm' : null
	};

	$scope.submit = function() {

		if ($scope.signupForm.password !== $scope.signupForm.passwordConfirm) {
			$scope.errorMessage = 'Confirm Passowrd doesnot match the password';
			return;
		} else {
			$scope.errorConfirmPassword = null;
		}
		LergoClient.signup($scope.signupForm).then(function() {
			$log.info('got success');
			$scope.errorMessage = null;
			$location.path('/public/session/login');
		}, function(result) {
			$scope.errorMessage = result.data.message;
			$log.error('got error');
		});
	};

	setInterval(function() {
		$('#issues').scrollLeft(200).scrollTop(Math.max($('#issues').scrollTop(), 160));
	}, 1000);
}

);
