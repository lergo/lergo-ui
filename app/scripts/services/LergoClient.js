'use strict';

angular.module('lergoApp').service('LergoClient', function LergoClient($http, $log, QuestionsService, LessonsService ) {
	// AngularJS will instantiate a singleton by calling "new" on this function

	$log.info('initializing');
	this.signup = function(signupForm) {
		return $http.post('/backend/users/signup', signupForm);
	};


    this.resendValidationEmail = function( loginCredentials ){
        return $http.post('/backend/users/validate/resend', loginCredentials );
    };

	this.isLoggedIn = function() {
		return $http.get('/backend/user/loggedin');
	};

	this.logout = function() {
		return $http.post('backend/users/logout');
	};
	this.login = function(loginCredentials) {
		return $http.post('/backend/users/login', loginCredentials);
	};

    this.lessons = LessonsService;

    this.questions = QuestionsService;

});
