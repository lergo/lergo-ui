'use strict';
angular.module('lergoApp').config(function ($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(false).hashPrefix('!');


    $routeProvider.when('/user/lesson/create', {
        'templateUrl': 'user/lesson/create.html',
        'controller': 'CreateLessonCtrl'
    }).when('/user/lessons', {
        templateUrl: 'user/lessons/index.html',
        controller: 'LessonsIndexCtrl'
    }).when('/user/questions', {
        templateUrl: 'user/questions/index.html',
        controller: 'QuestionsIndexCtrl'
    }).when('/public/questions/:questionId/read', {
        templateUrl: 'user/questions/read.html',
        controller: 'QuestionsReadCtrl'
    }).when('/user/questions/:questionId/read', {
        templateUrl: 'user/questions/read.html',
        controller: 'QuestionsReadCtrl'
    }).when('/user/lessons/step/display', {
        templateUrl: 'user/lessons/step/display/stepDisplay.html',
        controller: 'LessonsUpdateCtrl'
    }).when('/user/lessons/:lessonId/display', {
        templateUrl: 'user/lessons/display/display.html',
        controller: 'LessonsDisplayCtrl',
        reloadOnSearch: false,
        params: {'preview': true}
    }).when('/manage/users', {
        templateUrl: 'manage/users/manageUsersIndex.html',
        controller: 'ManageUsersIndexCtrl',
        reloadOnSearch: false,
        params: {
            'activeTab': 'users'
        }
    }).when('/manage/users/:userId/update', {
        templateUrl: 'manage/users/update/manageUserUpdate.html',
        controller: 'ManageUsersUpdateCtrl'
    }).when('/manage/roles', {
        templateUrl: 'manage/roles/rolesIndex.html',
        controller: 'RolesIndexCtrl',
        'params': {
            'activeTab': 'roles'
        }
    }).when('/manage/roles/:roleId/update', {
        templateUrl: 'manage/roles/update/rolesUpdate.html',
        controller: 'RolesUpdateCtrl'
    }).when('/public/lessons/invitations/:invitationId/display', {
        templateUrl: 'user/lessons/invitations/display/display.html',
        controller: 'LessonsInvitationsDisplayCtrl',
        reloadOnSearch: false
    }).when('/:role/lessons/:lessonId/intro', {
        templateUrl: 'lessons/intro/intro.html',
        controller: 'LessonsIntroCtrl'
    }).when('/:role/lessons/:lessonId/classInvite', {
        templateUrl: 'lessons/classInvite/classInvite.html',
        controller: 'ClassInviteCtrl'
    }).when('/lessons/invite/pin', {
        templateUrl: 'lessons/pinInvite/pinInvite.html',
        controller: 'PinInviteCtrl'
    }).when('/lessons/invite/pininvite', {
        templateUrl: 'lessons/pinInvite/pinInvite.html',
        controller: 'PinInviteCtrl'
    }).when('/public/lessons/:lessonId/share', {
        template: '',
        controller: 'LessonsInvitesPublicShareCtrl'
    }).when('/public/lessons/reports/:reportId/display', {
        templateUrl: 'lessons/invitations/report/report.html',
        controller: 'LessonsInvitationsReportCtrl'
    }).when('/public/lessons/reports/agg/:reportId/display', {
        templateUrl: 'lessons/invitations/aggReport/aggReport.html',
        controller: 'LessonsInvitationsAggReportCtrl'
    }).when('/user/questions/:questionId/update', {
        templateUrl: 'questions/update/update.html',
        controller: 'QuestionsUpdateCtrl',
        reloadOnSearch: false
    }).when('/public/homepage', {
        templateUrl: 'homepage/homepage.html',
        controller: 'HomepageCtrl',
        reloadOnSearch: false
    }).when('/user/create/:activeTab', {
        templateUrl: 'baseLayout/create/_create.html', // todo: move this view to view/create/_lessons.html
        controller: 'BaseLayoutCreateCtrl',
        reloadOnSearch: false
    }).when('/user/lessons/:lessonId/update', {
        templateUrl: 'lessons/update1/update.html',
        controller: 'LessonsUpdateCtrl',
        reloadOnSearch: false
    }).when('/user/lessons/:lessonId/invitations', {
        templateUrl: 'lessons/invites/create/create.html',
        controller: 'LessonsInvitesCreateCtrl'  // jeff: this has not been found or  moved! It doesn't seem to exist!
    }).when('/public/:username/profile', {
        templateUrl: 'users/profile/profile.html',
        controller: 'UsersProfileCtrl'
    }).when('/public/kitchenSink', {
        templateUrl: 'views/kitchenSink.html',
    }).when('/public/feedback', {
        templateUrl: 'views/partials/_feedback.html'
    }).when('/public/abuse', {
        templateUrl: 'views/partials/_abuse.html'
    }).when('/public/contact', {
        templateUrl: 'views/partials/_contact.html'
    }).when('/public/terms', {
        templateUrl: 'views/partials/_term.html'
    }).when('/public/problem', {
        templateUrl: 'views/partials/_problem.html'
    }).when('/public/suggest', {
        templateUrl: 'views/partials/_suggest.html'
    }).when('/public/session/signup', {
        templateUrl: 'views/session/signup.html',
        controller: function () {
        } // we will assign the controller on the view deliberately. angular bugs.
    }).when('/public/session/signupConfirmation', {
        templateUrl: 'views/session/signupConfirmation.html'
    }).when('/public/session/login', {
        templateUrl: 'login/login.html',
        controller: 'LoginCtrl'
    }).when('/public/user/validate', {
        templateUrl: 'views/users/validate.html',
        controller: 'UsersValidateCtrl'
    }).when('/public/user/changePassword', {
        templateUrl: 'views/users/changePassword.html',
        controller: 'UsersChangePasswordCtrl'
    }).when('/public/about/:activeAboutTab', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        reloadOnSearch: false
    }).when('/public/session/resetPasswordRequest', {
        templateUrl: 'views/session/resetPasswordRequest.html',
        controller: 'SessionResetPasswordRequestCtrl'
    }).when('/user/homepage', {
        redirectTo: '/public/homepage'
    }).when('/user/Parents', {
        templateUrl: 'views/parents.html',
        controller: function ($scope, $sce, $filter) {
            window.scrollTo(0,0);
            $scope.url = function () {
                return $sce.trustAsResourceUrl($filter('translate')('parents.teaser.url'));
            };
        }
    }).when('/user/Privacy', {
        templateUrl: 'views/partials/_term.html',
    }).when('/user/Teachers', {
        templateUrl: 'views/teachers.html',
        controller: function ($scope, $sce, $filter) {
            window.scrollTo(0,0);
            $scope.url = function () {
                return $sce.trustAsResourceUrl($filter('translate')('teachers.teaser.url'));
            };
        }
        ////////////////// admin section
    }).when('/admin/homepage/lessons', {
        templateUrl: 'views/admin/lessons/_index.html',
        controller: 'AdminLessonIndexCtrl',
        reloadOnSearch: false,
        'params': {
            'activeTab': 'lessons'
        }
    }).when('/admin/homepage/abuseReports', {
        templateUrl: 'views/admin/abuseReports/_index.html',
        controller: 'AdminAbuseReportIndexCtrl',
        reloadOnSearch: false,
        'params': {
            'activeTab': 'abuseReports'
        }
    }).when('/disqus/:disqus_identifier', {
        controller: 'DisqusPageCtrl',
        templateUrl: 'views/disqusPage.html'
    }).when('/public/contribute', {
        templateUrl: 'views/partials/_contribute.html'
    }).when('errors/notFound', {
        templateUrl: 'views/errors/notFound.html'
    }).when('/', {
        redirectTo: '/public/homepage'
        // redirectTo: '/public/session/login'
    }).otherwise({
        templateUrl: 'views/errors/notFound.html'
        // redirectTo: '/'
    });
});
