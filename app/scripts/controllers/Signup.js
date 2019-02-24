(function () {
	'use strict';
	SignupCtrl.$inject = ['$scope', '$log', 'LergoClient', '$location'];
	function SignupCtrl($scope, $log, LergoClient, $location) {


		$scope.submit = function() {
			$scope.errorMessage = null;

			if ( !$scope.signupForm.$valid ){
				return;
			}



			LergoClient.signup({

				email : $scope.signupForm.email.$viewValue,
				emailConfirm : $scope.signupForm.emailConfirm.$viewValue,
				fullName : $scope.signupForm.name.$viewValue,
				password : $scope.signupForm.password.$viewValue,
				passwordConfirm : $scope.signupForm.passwordConfirm.$viewValue,
				username : $scope.signupForm.username.$viewValue

			}).then(function() {
				$log.info('got success');
				$scope.errorMessage = null;
				$location.path('/public/session/signupConfirmation');
			}, function(result) {
				$scope.errorMessage = result.data.message;
				$log.error('got error');
			});
		};

		setInterval(function() {
			$('#issues').scrollLeft(200).scrollTop(Math.max($('#issues').scrollTop(), 160));
		}, 1000);

		// autofocus not working properly in control of partial view when added
		// through ngInclude this is a hook to get the desired behaviour
		$scope.setFocus = function(id) {
			document.getElementById(id).focus();
		};
	}
	angular.module('lergoApp').controller('SignupCtrl', SignupCtrl);
})();
