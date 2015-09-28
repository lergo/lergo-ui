'use strict';

angular.module('lergoApp', ['LocalStorageModule', 'pascalprecht.translate','ngRoute', 'ui.bootstrap', 'ui.utils', 'btford.markdown', 'ui.gravatar']).config(
    function ($routeProvider, $httpProvider, $logProvider, $locationProvider, gravatarServiceProvider, $translateProvider ) {

        $logProvider.debugEnabled(false);

        try {
            if (window.location.origin.indexOf('localhost') > 0) {
                $logProvider.debugEnabled(true);
            }
        }catch(e){}

        $translateProvider.useUrlLoader('/backend/system/translations/angular-translate.json');
        $translateProvider.preferredLanguage('en');
        $translateProvider.fallbackLanguage(['general','en']);
        $translateProvider.useMissingTranslationHandler('missingTranslationFactory');
        $locationProvider.html5Mode(false).hashPrefix('!');

        gravatarServiceProvider.defaults = {
            size: 100,
            'default': 'mm' // Mystery man as default for missing
            // avatars
        };

        $routeProvider.when('/user/lesson/create', {
            'templateUrl': 'views/lesson/create.html',
            'controller': 'CreateLessonCtrl'
        }).when('/user/lessons', {
            templateUrl: 'views/lessons/index.html',
            controller: 'LessonsIndexCtrl'
        }).when('/user/questions', {
            templateUrl: 'views/questions/index.html',
            controller: 'QuestionsIndexCtrl'
        })

            .when('/public/questions/:questionId/read', {
                templateUrl: 'views/questions/read.html',
                controller: 'QuestionsReadCtrl'
            }).when('/user/questions/:questionId/read', {
                templateUrl: 'views/questions/read.html',
                controller: 'QuestionsReadCtrl'
            }).when('/user/lessons/step/display', {
                templateUrl: 'views/lessons/stepDisplay.html'
            }).when('/user/lessons/:lessonId/display', {
                templateUrl: 'views/lessons/display.html',
                controller: 'LessonsDisplayCtrl',
                reloadOnSearch: false
            })

            .when('/manage/users', {
                templateUrl: 'views/manage/users/manageUsersIndex.html',
                controller: 'ManageUsersIndexCtrl',
                reloadOnSearch: false,
                params: {
                    'activeTab' : 'users'
                }
            })

            .when('/manage/users/:userId/update', {
                templateUrl: 'views/manage/users/manageUserUpdate.html',
                controller: 'ManageUsersUpdateCtrl'
            })

            .when('/security/roles', {
                templateUrl: 'views/security/rolesIndex.html',
                controller: 'SecurityRolesIndexCtrl',
                'params': {
                    'activeTab' : 'roles'
                }
            })
            .when('/security/roles/:roleId/update', {
                templateUrl: 'views/security/rolesUpdate.html',
                controller: 'SecurityRolesUpdateCtrl'
            })

            .when('/security/groups', {
                templateUrl: 'views/security/groupsIndex.html',
                controller: 'SecurityGroupsIndexCtrl',
                'params' : {
                    'activeTab' : 'groups'
                }
            })
            .when('/security/groups/:groupId/update',{
                templateUrl : 'views/security/groupsUpdate.html',
                controller: 'SecurityGroupsUpdateCtrl'
            })

            .when('/public/lessons/invitations/:invitationId/display', {
                templateUrl: 'views/lessons/invitations/display.html',
                controller: 'LessonsInvitationsDisplayCtrl',
                reloadOnSearch: false
            }).when('/:role/lessons/:lessonId/intro', {
                templateUrl: 'views/lessons/intro.html',
                controller: 'LessonsIntroCtrl'
            }).when('/public/lessons/:lessonId/share', {
                template: '',
                controller: 'LessonsInvitesPublicShareCtrl'
            }).when('/public/lessons/reports/:reportId/display', {
                templateUrl: 'views/lessons/invitations/report.html',
                controller: 'LessonsInvitationsReportCtrl'
            }).when('/user/questions/:questionId/update', {
                templateUrl: 'views/questions/update.html',
                controller: 'QuestionsUpdateCtrl',
                reloadOnSearch: false
            }).when('/public/homepage', {
                templateUrl: 'views/homepage.html',
                controller: 'HomepageCtrl',
                reloadOnSearch: false
            })
            // todo - remove this url. use plural version
            // '/user/lessons/:lessonId/update'
            .when('/user/lesson/:lessonId/update', {
                templateUrl: 'views/lessons/update.html',
                controller: 'LessonsUpdateCtrl',
                reloadOnSearch: false,

            })

            .when('/user/create/:activeTab', {
                templateUrl: 'views/partials/_create.html', // todo: move
                // this view to
                // view/create/_lessons.html
                controller: 'BaseLayoutCreateCtrl',
                reloadOnSearch: false
            }).when('/user/lessons/:lessonId/update', {
                templateUrl: 'views/lessons/update.html',
                controller: 'LessonsUpdateCtrl',
                reloadOnSearch: false
            }).when('/user/lessons/:lessonId/invitations', {
                templateUrl: 'views/lessons/invitations/create.html',
                controller: 'LessonsInvitesCreateCtrl'
            }).when('/user/:username/profile', {
                templateUrl: 'views/users/publicProfile.html',
                controller: 'UsersPublicProfileCtrl'
            })
            .when('/public/:username/profile', {
                templateUrl: 'views/users/publicProfile.html',
                controller: 'UsersPublicProfileCtrl'
            })
            .when('/public/kitchenSink', {
                templateUrl: 'views/kitchenSink.html'

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
                controller: 'SignupCtrl'
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
                templateUrl: 'views/errors/underConstruction.html'
            }).when('/user/Teachers', {
                templateUrl: 'views/errors/underConstruction.html'
            })

            ////////////////// admin section
            .when('/admin/homepage/lessons', {
                templateUrl: 'views/admin/lessons/_index.html',
                controller: 'AdminLessonIndexCtrl',
                reloadOnSearch: false,
                'params' : {
                    'activeTab' : 'lessons'
                }
            })
            .when('/admin/homepage/abuseReports', {
                templateUrl: 'views/admin/abuseReports/_index.html',
                controller: 'AdminAbuseReportIndexCtrl',
                reloadOnSearch: false,
                'params' : {
                    'activeTab' : 'abuseReports'
                }
            })


            .when('/disqus/:disqus_identifier', {
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

        // $httpProvider.responseInterceptors.push(interceptor);
        $httpProvider.interceptors.push('RequestProgressInterceptor');
        $httpProvider.interceptors.push('RequestErrorInterceptor');

    });

// guy - this is a temporary fix for angular-bootstrap
// https://github.com/angular-ui/bootstrap/issues/2828
angular.module('lergoApp').directive('tooltip', function () {
    return {
        restrict: 'EA',
        link: function (scope, element, attrs) {
            attrs.tooltipTrigger = attrs.tooltipTrigger;
            attrs.tooltipPlacement = attrs.tooltipPlacement || 'top';
        }
    };
});

angular.module('lergoApp').run(function (Facebook) {
    Facebook.init(conf.facebookAppId);
});
