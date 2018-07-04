'use strict';

angular.module('lergoApp').service('LergoClient',
		function LergoClient($http, $log, PlayListsService,  UsersService, QuestionsService, LikesService, LergoErrorsService, LessonsService,
                             FaqsService,
                             LessonsInvitationsService, UserDataService, ReportsService, AbuseReports, RolesService) {
			// AngularJS will instantiate a singleton by calling "new" on this
			// function

			$log.info('initializing');
			this.signup = function(signupForm) {
				return $http.post('/backend/users/signup', signupForm);
			};

			this.resendValidationEmail = function(loginCredentials) {
				return $http.post('/backend/users/validate/resend', loginCredentials);
			};

            var isLoggedInPromise  = null;
			this.isLoggedIn = function( cached ) {
                if ( !cached || !isLoggedInPromise ){
                    isLoggedInPromise =  $http.get('/backend/user/loggedin');
                }
                return isLoggedInPromise;
			};

			this.logout = function() {
				return $http.post('backend/users/logout');
			};
			this.login = function(loginCredentials) {
				return $http.post('/backend/users/login', loginCredentials);
			};

			/** ********* GUY ************** */
			/**
			 * ** I am starting to move some code around to fit the new
			 * authorization design **
			 */
			/**
			 * ** UserData will be used for 'getting' data that belongs to the
			 * user **
			 */
			/** ** Logged in users will eventually use '/backend/user/me' ** */
			/** * rather than give the user id ** */

			/**
			 * ** Lessons, Questions etc... will be used for
			 * create/update/delete **
			 */
			/**
			 * ** This is a work in progress.. so if you have questions about
			 * where to enter **
			 */
			/*******************************************************************
			 * ** a new route/service etc.. please contact me /
			 ******************************************************************/

			this.lessons = LessonsService;
			this.playLists = PlayListsService;
			this.lessonsInvitations = LessonsInvitationsService;
			this.questions = QuestionsService;
			this.users = UsersService; // service to get info about users..

			// get user's lessons, get user's data.. not like UsersService..
			this.userData = UserDataService;
			this.likes = LikesService;
			this.reports = ReportsService;
			this.abuseReports=AbuseReports;
            this.roles =  RolesService;

            this.errors = LergoErrorsService;
            this.faqs = FaqsService;


		});
