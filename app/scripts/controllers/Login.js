'use strict';

angular.module('lergoApp').controller('LoginCtrl', function($scope, $log, LergoClient, $location, $rootScope, $uibModal) {

	$scope.showLoginPage = false;

    $scope.isNavCollapsed = true;
    $scope.isCollapsed = false;
    $scope.isCollapsedHorizontal = false;

    // autofocus not working properly in control of partial view when added
    // through ngInclude this is a hook to get the desired behaviour
    $scope.setFocus = function(id) {
        var element = document.getElementById(id);
        if (!!element) {
            element.focus();
        }
    };

    if ($location.path() === '/public/session/login') {
		LergoClient.isLoggedIn().then(function(result) {
			if (!!result && result.data.user ) {
				$rootScope.user = result.data.user;
				$location.path('/user/homepage');

			}else{
                $scope.showLoginPage = true;
                // setting focus again as focus get lost when error occur in
                // validation
                $scope.setFocus('login-username');
            }
		});
	}

	$scope.resendValidationEmail = function() {
		$log.info('resending validation email');
		$scope.sendingValidationEmail = true;
		$scope.clearError();
		LergoClient.resendValidationEmail($scope.form).then(function() {
			$scope.sendingValidationEmail = false;
			$scope.validationEmailSentSuccess = true;
			$scope.resendValidation = false;
		}, function() {
			$scope.sendingValidationEmail = false;
		});
	};

	$scope.login = function() {
		LergoClient.login($scope.form).then(function success(result) {
			$rootScope.user = result.data;
			$scope.errorMessage = null;
			$location.path('/user/homepage');
		}, function error(result) {
			try {
				if (result.data.code === 7) { // user not validated
					$scope.resendValidation = true;
				}
				// $scope.errorMessage = result.data.message;
				// $log.info('error logging in [%s]', result.data);
			} catch (e) {
				// $scope.errorMessage = 'unknown error';
			}
		});
	};
	$scope.openModal = function () {
		$uibModal.open({
		  templateUrl: 'views/modal.html',
		  controller: function ($scope, $uibModalInstance) {
			$scope.ok = function () {
			  $uibModalInstance.close();
			};
		  
			$scope.cancel = function () {
			  $uibModalInstance.dismiss('cancel');
			};
			$scope.createLesson = function() {
				console.log('are we trying to create a lessons');
			  $scope.createLessonBtnDisable=true;
			  LergoClient.lessons.create().then(function(result) {
				  var lesson = result.data;
				  $scope.errorMessage = null;
				  $location.path('/user/lessons/' + lesson._id + '/update');
			  }, function(result) {
				  $scope.errorMessage = 'Error in creating Lesson : ' + result.data.message;
				  $log.error($scope.errorMessage);
				  $scope.createLessonBtnDisable=false;
			  });
			};
			$scope.createPlaylist = function() {
				console.log('are we trying to create a playlist');
			  $scope.createLessonBtnDisable=true;
			  LergoClient.playlists.create().then(function(result) {
				  var playlist = result.data;
				  $scope.errorMessage = null;
				  $location.path('/user/playlists/' + playlist._id + '/update');
			  }, function(result) {
				  $scope.errorMessage = 'Error in creating playlist : ' + result.data.message;
				  $log.error($scope.errorMessage);
				  $scope.createLessonBtnDisable=false;
			  });
		  	};  
		  }
		});
	  };
	  $scope.create = function() {
		  console.log('are we trying to create a lessons');
        $scope.createLessonBtnDisable=true;
		LergoClient.lessons.create().then(function(result) {
			var lesson = result.data;
			$scope.errorMessage = null;
			$location.path('/user/lessons/' + lesson._id + '/update');
		}, function(result) {
			$scope.errorMessage = 'Error in creating Lesson : ' + result.data.message;
			$log.error($scope.errorMessage);
            $scope.createLessonBtnDisable=false;
		});
	};
});


