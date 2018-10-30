'use strict';
angular.module('lergoApp').config(function ($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(false).hashPrefix('!');


    $routeProvider.when('/user/lesson/create', {
        'templateUrl': 'views/lesson/create.html',
        'controller': 'CreateLessonCtrl'
    }).when('/user/lessons', {
        templateUrl: 'views/lessons/index.html',
        controller: 'LessonsIndexCtrl'
    }).when('/user/playlists', {
        templateUrl: 'views/playlists/index.html',
        controller: 'playlistsIndexCtrl'
    }).when('/user/questions', {
        templateUrl: 'views/questions/index.html',
        controller: 'QuestionsIndexCtrl'
    }).when('/public/questions/:questionId/read', {
        templateUrl: 'views/questions/read.html',
        controller: 'QuestionsReadCtrl'
    }).when('/user/questions/:questionId/read', {
        templateUrl: 'views/questions/read.html',
        controller: 'QuestionsReadCtrl'
    }).when('/user/lessons/step/display', {
        templateUrl: 'views/lessons/stepDisplay.html'
    }).when('/user/playlists/step/display', {
        templateUrl: 'views/playlists/stepDisplay.html'
    }).when('/user/playlists/step/display', {
        templateUrl: 'views/playlists/stepDisplay.html'
    }).when('/user/lessons/:lessonId/display', {
        templateUrl: 'views/lessons/display.html',
        controller: 'LessonsDisplayCtrl',
        reloadOnSearch: false,
        params: {'preview': true}
    }).when('/user/playlists/:playlistsId/display', {
        templateUrl: 'views/playlists/display.html',
        controller: 'playlistsDisplayCtrl',
        reloadOnSearch: false,
        params: {'preview': true}
    }).when('/manage/users', {
        templateUrl: 'views/manage/users/manageUsersIndex.html',
        controller: 'ManageUsersIndexCtrl',
        reloadOnSearch: false,
        params: {
            'activeTab': 'users'
        }
    }).when('/manage/users/:userId/update', {
        templateUrl: 'views/manage/users/manageUserUpdate.html',
        controller: 'ManageUsersUpdateCtrl'
    }).when('/manage/roles', {
        templateUrl: 'views/roles/rolesIndex.html',
        controller: 'RolesIndexCtrl',
        'params': {
            'activeTab': 'roles'
        }
    }).when('/manage/roles/:roleId/update', {
        templateUrl: 'views/roles/rolesUpdate.html',
        controller: 'RolesUpdateCtrl'
    }).when('/public/lessons/invitations/:invitationId/display', {
        templateUrl: 'views/lessons/invitations/display.html',
        controller: 'LessonsInvitationsDisplayCtrl',
        reloadOnSearch: false
    }).when('/public/playlists/invitations/:invitationId/display', {
        templateUrl: 'views/playlists/invitations/display.html',
        controller: 'PlaylistsInvitationsDisplayCtrl',
        reloadOnSearch: false
    }).when('/:role/lessons/:lessonId/intro', {
        templateUrl: 'views/lessons/intro.html',
        controller: 'LessonsIntroCtrl'
    }).when('/:role/playlists/:playlistId/intro', {
        templateUrl: 'views/playlists/intro.html',
        controller: 'PlaylistsIntroCtrl'
    }).when('/:role/lessons/:lessonId/classInvite', {
        templateUrl: 'views/invites/classInvite.html',
        controller: 'ClassInviteCtrl'
    }).when('/:role/playlists/:playlistId/classInvite', {
        templateUrl: 'views/invites/classInvite.html',
        controller: 'ClassInviteCtrl'
    }).when('/lessons/invite/pin', {
        templateUrl: 'views/invites/pinInvite.html',
        controller: 'PinInviteCtrl'
    }).when('/playlists/invite/pin', {
        templateUrl: 'views/invites/pinInvite.html',
        controller: 'PinInviteCtrl'
    }).when('/lessons/invite/pininvite', {
        templateUrl: 'views/invites/pinInvite.html',
        controller: 'PinInviteCtrl'
    }).when('/playlists/invite/pininvite', {
        templateUrl: 'views/invites/pinInvite.html',
        controller: 'PinInviteCtrl'
    }).when('/public/lessons/:lessonId/share', {
        template: '',
        controller: 'LessonsInvitesPublicShareCtrl'
    }).when('/public/playlists/:playlistId/share', {
        template: '',
        controller: 'playlistInvitesPublicShareCtrl'
    }).when('/public/lessons/reports/:reportId/display', {
        templateUrl: 'views/lessons/invitations/report.html',
        controller: 'LessonsInvitationsReportCtrl'
    }).when('/public/playlists/reports/:reportId/display', {
        templateUrl: 'views/playlists/invitations/report.html',
        controller: 'playlistsInvitationsReportCtrl'
    }).when('/public/lessons/reports/agg/:reportId/display', {
        templateUrl: 'views/lessons/invitations/aggReport.html',
        controller: 'LessonsInvitationsAggReportCtrl'
    }).when('/public/playlists/reports/agg/:reportId/display', {
        templateUrl: 'views/playlists/invitations/aggReport.html',
        controller: 'playlistsInvitationsAggReportCtrl'
    }).when('/user/questions/:questionId/update', {
        templateUrl: 'views/questions/update.html',
        controller: 'QuestionsUpdateCtrl',
        reloadOnSearch: false
    }).when('/public/homepage', {
        templateUrl: 'views/homepage.html',
        controller: 'HomepageCtrl',
        reloadOnSearch: false
    }).when('/user/create/:activeTab', {
        templateUrl: 'views/partials/_create.html', // todo: move this view to view/create/_lessons.html
        controller: 'BaseLayoutCreateCtrl',
        reloadOnSearch: false
    }).when('/user/lessons/:lessonId/update', {
        templateUrl: 'views/lessons/update.html',
        controller: 'LessonsUpdateCtrl',
        reloadOnSearch: false
    }).when('/user/playlists/:playlistId/update', {
        templateUrl: 'views/playlists/update.html',
        controller: 'PlaylistsUpdateCtrl',
        reloadOnSearch: false
    }).when('/user/lessons/:lessonId/invitations', {
        templateUrl: 'views/lessons/invitations/create.html',
        controller: 'LessonsInvitesCreateCtrl'
    }).when('/user/playlists/:playlistId/invitations', {
        templateUrl: 'views/playlist/invitations/create.html',
        controller: 'playlistInvitesCreateCtrl'
    }).when('/public/:username/profile', {
        templateUrl: 'views/users/profile.html',
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
        templateUrl: 'views/session/login.html',
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
    }).when('/admin/homepage/playlists', {
        templateUrl: 'views/admin/playlists/_index.html',
        controller: 'AdminPlaylistIndexCtrl',
        reloadOnSearch: false,
        'params': {
            'activeTab': 'playlists'
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
