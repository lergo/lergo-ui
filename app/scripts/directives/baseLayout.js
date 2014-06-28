'use strict';

angular.module('lergoApp').directive('baseLayout', function ($rootScope, $log, $location, LergoClient, LergoTranslate) {
    return {
        templateUrl: '/views/baseLayout.html',
        transclude: true,
        restrict: 'C',
        replace: true,
        link: function postLink(scope/* , element /*, attrs */) {
            LergoClient.isLoggedIn().then(function (result) {
                if (!!result) {
                    $rootScope.user = result.data;
                }
            });


            // a random number to prevent cache in ng-include
            $rootScope.getCacheRandomNumber = function () {
                return Math.floor(new Date().getTime() / 10000);
            };

            $rootScope.getLabelForLanguage = function (id) {

                return LergoTranslate.translate('translationLanguage.' + id);
            };
            $rootScope.lergoLanguages = [
                {
                    'id': 'en',
                    'label': 'English'
                },
                {
                    'id': 'he',
                    'label': 'Hebrew'
                },
                {
                    'id': 'ru',
                    'label': 'Russian'
                },
                {
                    'id': 'ar',
                    'label': 'Arabic'
                }
            ];

            $rootScope.$watch('lergoLanguage', function (newValue/* , oldValue */) {
                $log.info('new language', newValue);
                LergoTranslate.setLanguage(newValue);
            });

            scope.logout = function () {
                LergoClient.logout().then(function () {
                    $rootScope.user = null;
                    $location.path('/');
                });
            };
        }
    };
});
