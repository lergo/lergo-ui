'use strict';

angular.module('lergoApp').controller('LoginCtrl', function($scope, $log, LergoClient, $location, $rootScope) {

	$scope.showLoginPage = false;

	if ($location.path() === '/public/session/login') {
		LergoClient.isLoggedIn().then(function(result) {
			if (!!result) {
				$rootScope.user = result.data;
				$location.path('/user/homepage');
			}
		}, function() {
			$scope.showLoginPage = true;
		});
	}


    $scope.resendValidationEmail = function(){
        $log.info('resending validation email');
        $scope.sendingValidationEmail = true;
        LergoClient.resendValidationEmail( $scope.form).then(function(){
            $scope.sendingValidationEmail = false;
            $scope.validationEmailSentSuccess = true;
        });
    };

	$scope.login = function() {
		LergoClient.login($scope.form).then(function success(result) {
			$rootScope.user = result.data;
			$scope.errorMessage = null;
			$location.path('/user/homepage');
		}, function error(result) {
            try {
                if ( result.data.code === 7 ){ // user not validated
                    $scope.resendValidation = true;
                }
//                $scope.errorMessage = result.data.message;
//                $log.info('error logging in [%s]', result.data);
            }catch(e){
//                $scope.errorMessage = 'unknown error';
            }
		});
	};
});
