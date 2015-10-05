'use strict';

angular.module('lergoApp').directive('baseLayout', function ($rootScope, $timeout, $log, $location, LergoClient, LergoTranslate, $routeParams) {
    return {
        templateUrl: 'views/baseLayout.html',
        transclude: true,
        restrict: 'C',
        replace: true,
        link: function postLink(scope/* , element /*, attrs */) {


            scope.baseLayout = { 'filterTextSearch' : $routeParams.search };

            LergoClient.isLoggedIn().then(function (result) {
                if (!!result && result.data.user ) {
                    $rootScope.user = result.data.user;
                }
            });

            $rootScope.updateStats = function( refresh ){
                // todo - move to LergoClient.system
                LergoClient.lessons.getStats( refresh ).then(function(result){
                    $rootScope.systemStats = result.data;

                });
            };

            $rootScope.updateStats();

            // using `scope` to watch instead of `rootScope` will ensure I do not have a leak
            scope.$watch( function(){ return $rootScope.user; }, function(){
                $rootScope.updateStats(true);
            }, true);


            // a random number to prevent cache in ng-include
            $rootScope.getCacheRandomNumber = function () {
                return Math.floor(new Date().getTime() / 10000);
            };

            $rootScope.getLabelForLanguage = function (id) {

                return LergoTranslate.translate('general.translationLanguage.' + id);
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
                $log.info('searching on homepage', scope.baseLayout.filterTextSearch);
                $location.search('search', scope.baseLayout.filterTextSearch).path('/user/homepage');
//                var textSearch = scope.filterTextSearch;
                // keep focus on the input element
                // NOTE: this is not a proper angular solution, but one would be an overkill here.
                // answer from : http://stackoverflow.com/a/19568146
                $timeout(function(){
//                    scope.filterTextSearch = textSearch;
                    if ( !!scope.baseLayout && !!scope.baseLayout.filterTextSearch ) {
                        $('#header .header-search input')[0].setSelectionRange(scope.baseLayout.filterTextSearch.length, scope.baseLayout.filterTextSearch.length);
                    }
                },0);

            };




            // todo: reinstate this search.
//            LergoClient.lessons.getPublicLessons().then(function(result) {
//                scope.typeaheadItems = result.data;
//            });

            scope.doSearchFromTypeahead = function( /*$item, $model, $label */){
                scope.searchOnHomepage();
            };

        }
    };
});
