'use strict';

angular.module('lergoApp').directive('baseLayout', function ($rootScope, $timeout, $log, $location, LergoClient, LergoTranslate) {
    return {
        templateUrl: 'views/baseLayout.html?changed=1',
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
                $rootScope.$broadcast('siteLanguageChanged');
            });

            scope.searchOnHomepage = function(){
                $location.path('/user/homepage');

                // keep focus on the input element
                // NOTE: this is not a proper angular solution, but one would be an overkill here.
                // answer from : http://stackoverflow.com/a/19568146
                $timeout(function(){
                    $('#header .header-search input')[0].setSelectionRange($rootScope.filter.textSearch.length,$rootScope.filter.textSearch.length);
                },0);

            };

            scope.logout = function () {
                LergoClient.logout().then(function () {
                    $rootScope.user = null;
                    $location.path('/');
                });
            };


            LergoClient.lessons.getPublicLessons().then(function(result) {
                scope.typeaheadItems = result.data;
            });

            scope.doSearchFromTypeahead = function( /*$item, $model, $label */){
                scope.searchOnHomepage();
            };

        }
    };
});
