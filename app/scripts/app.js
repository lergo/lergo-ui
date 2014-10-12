'use strict';

angular.module('lergoApp', [ 'LocalStorageModule', 'ngRoute', 'ui.bootstrap', 'ui.utils', 'btford.markdown' ]).config(function($routeProvider, $httpProvider, $logProvider, $locationProvider) {

	$logProvider.debugEnabled(false);

	$locationProvider.html5Mode(false).hashPrefix('!');

	$routeProvider.when('/user/lesson/create', {
		'templateUrl' : 'views/lesson/create.html',
		'controller' : 'CreateLessonCtrl'
	}).when('/user/lessons', {
		templateUrl : 'views/lessons/index.html',
		controller : 'LessonsIndexCtrl'
	}).when('/user/questions', {
		templateUrl : 'views/questions/index.html',
		controller : 'QuestionsIndexCtrl'
	})

	.when('/public/questions/:questionId/read', {
		templateUrl : 'views/questions/read.html',
		controller : 'QuestionsReadCtrl'
	}).when('/user/questions/:questionId/read', {
		templateUrl : 'views/questions/read.html',
		controller : 'QuestionsReadCtrl'
	}).when('/user/lessons/step/display', {
		templateUrl : 'views/lessons/stepDisplay.html'
	}).when('/user/lessons/:lessonId/display', {
		templateUrl : 'views/lessons/display.html',
		controller : 'LessonsDisplayCtrl',
		reloadOnSearch : false
	})

	.when('/public/lessons/invitations/:invitationId/display', {
		templateUrl : 'views/lessons/invitations/display.html',
		controller : 'LessonsInvitationsDisplayCtrl',
		reloadOnSearch : false
	}).when('/:role/lessons/:lessonId/intro', {
		templateUrl : 'views/lessons/intro.html',
		controller : 'LessonsIntroCtrl'
	}).when('/public/lessons/:lessonId/share', {
		template : '',
		controller : 'LessonsInvitesPublicShareCtrl'
	}).when('/public/lessons/reports/:reportId/display', {
		templateUrl : 'views/lessons/invitations/report.html',
		controller : 'LessonsInvitationsReportCtrl'
	}).when('/user/questions/:questionId/update', {
		templateUrl : 'views/questions/update.html',
		controller : 'QuestionsUpdateCtrl',
        reloadOnSearch:false
	}).when('/public/homepage', {
		templateUrl : 'views/homepage.html',
		controller : 'HomepageCtrl',
        reloadOnSearch: false
	})
	// todo - remove this url. use plural version
	// '/user/lessons/:lessonId/update'
	.when('/user/lesson/:lessonId/update', {
		templateUrl : 'views/lessons/update.html',
		controller : 'LessonsUpdateCtrl',
        reloadOnSearch: false
	})

	.when('/user/create/:activeTab', {
		templateUrl : 'views/partials/_create.html', // todo: move
		// this view to
		// view/create/_lessons.html
		controller : 'BaseLayoutCreateCtrl',
        reloadOnSearch:false
	}).when('/user/lessons/:lessonId/update', {
		templateUrl : 'views/lessons/update.html',
		controller : 'LessonsUpdateCtrl',
        reloadOnSearch:false
	}).when('/user/lessons/:lessonId/invitations', {
		templateUrl : 'views/lessons/invitations/create.html',
		controller : 'LessonsInvitesCreateCtrl'
	}).when('/public/kitchenSink', {
		templateUrl : 'views/kitchenSink.html'

	}).when('/public/translations/diff', {
		templateUrl : 'views/translations/diff.html',
		controller : 'TranslationsDiffCtrl'
	}).when('/public/feedback', {
		templateUrl : 'views/partials/_feedback.html'
	}).when('/public/abuse', {
		templateUrl : 'views/partials/_abuse.html'
	}).when('/public/contact', {
		templateUrl : 'views/partials/_contact.html'
	}).when('/public/terms', {
		templateUrl : 'views/partials/_term.html'
	}).when('/public/problem', {
		templateUrl : 'views/partials/_problem.html'
	}).when('/public/suggest', {
		templateUrl : 'views/partials/_suggest.html'
	}).when('/public/session/signup', {
		templateUrl : 'views/session/signup.html',
		controller : 'SignupCtrl'
	}).when('/public/session/signupConfirmation', {
		templateUrl : 'views/session/signupConfirmation.html'
	}).when('/public/session/login', {
		templateUrl : 'views/session/login.html',
		controller : 'LoginCtrl'
	}).when('/public/user/validate', {
		templateUrl : 'views/users/validate.html',
		controller : 'UsersValidateCtrl'
	}).when('/public/user/changePassword', {
		templateUrl : 'views/users/changePassword.html',
		controller : 'UsersChangePasswordCtrl'
	}).when('/public/about', {
		templateUrl : 'views/about.html',
		controller : 'SignupCtrl'
	}).when('/public/session/resetPasswordRequest', {
		templateUrl : 'views/session/resetPasswordRequest.html',
		controller : 'SessionResetPasswordRequestCtrl'
	}).when('/admin/homepage', {
		templateUrl : 'views/admin/homepage.html',
		controller : 'AdminHomepageCtrl',
        reloadOnSearch:false
	}).when('/user/homepage', {
		redirectTo : '/public/homepage'
	}).when('/user/Parents', {
		templateUrl : 'views/errors/underConstruction.html'
	}).when('/user/Teachers', {
		templateUrl : 'views/errors/underConstruction.html'
	})

	.when('/disqus/:disqus_identifier', {
		controller : 'DisqusPageCtrl',
		templateUrl : 'views/disqusPage.html'
	}).when('/public/contribute', {
		templateUrl : 'views/partials/_contribute.html'
	}).when('errors/notFound', {
		templateUrl : 'views/errors/notFound.html'
	}).when('/', {
		redirectTo : '/public/homepage'
	// redirectTo: '/public/session/login'
	}).otherwise({
		templateUrl : 'views/errors/notFound.html'
	// redirectTo: '/'
	});

	var interceptor = [ '$rootScope', '$q', '$location', '$log', function(scope, $q, $location) {

		function success(response) {
			return response;
		}

		function error(response) {
			var status = response.status;

			if (status === 500) {

				if (typeof (response.data) === 'string' && response.data.indexOf('ECONNREFUSED') > 0) {
					scope.errorMessage = 'no connection to server';
					scope.pageError = {
						'code' : -1,
						'key' : 'no.connection.to.server',
						'message' : 'no connection to server'
					};
				} else {
					try {
						scope.errorMessage = response.data.message;
						scope.pageError = response.data;
					} catch (e) {
						scope.errorMessage = 'unknown error';
						scope.pageError = {
							'code' : -2,
							'key' : 'unknown.error',
							'message' : 'unknown error'
						};
					}
				}

				scope.clearError = function() {
					scope.errorMessage = null;
					scope.pageError = null;
				};

			}

			if (status === 401 && $location.path().indexOf('/public') !== 0) {
				$location.path('/public/session/login');
				return;
			}

			if (!!response.message) {
				scope.pageError = response.message;
			}
			// otherwise
			return $q.reject(response);

		}

		return function(promise) {

			return promise.then(success, error);
		};

	} ];
	$httpProvider.responseInterceptors.push(interceptor);
	$httpProvider.interceptors.push('RequestProgressInterceptor');

});
