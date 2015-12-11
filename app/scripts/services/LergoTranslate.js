'use strict';

angular.module('lergoApp').service('LergoTranslate', function($routeParams, $http, localStorageService, $log, $rootScope, $timeout, $location, $route, $translate) { /* LergoTranslate */
        // AngularJS will instantiate a singleton by calling "new" on this function

        /*	if (!!$rootScope.noTranslation) {
         return;
         }*/

        var supportedLanguages = [{
            'id': 'en',
            'dir': 'ltr'
        }, {
            'id': 'he',
            'dir': 'rtl'
        }, {
            'id': 'ru',
            'dir': 'ltr'
        }, {
            'id': 'ar',
            'dir': 'rtl'
        }];
        var DEFAULT_LANGUAGE = 'en';




        this.isSupported = function (language) {

            try {

                this.getLanguageObj(language);
                return true;
            } catch (e) {
                return false;
            }
        };

        this.setLanguage = function (_language) {
            $log.debug('setting new language', _language);
            if (this.isSupported(_language)) {
                $rootScope.lergoLanguage = _language;
                localStorageService.set('lergoLanguage', _language);

                // don't cause a page refresh
                if (!!$route.current && !!$route.current.$$route && $route.current.$$route.reloadOnSearch === false) {
                    $location.search('lergoLanguage', _language).replace();
                }

                $translate.use(_language);

            } else {
                $log.info('language', _language, 'is not supported');
            }
        };

        this.getLanguage = function () {
            return $translate.use();
        };

        this.getLanguageObj = function (_language) {
            if ( !_language ){
                _language = this.getLanguage();
            }
            return _.find(supportedLanguages, function (item) {
                return item.id === _language;
            });
        };

        this.getSupportedLanguages = function () {
            return supportedLanguages;
        };

        // guy - $routeParams is not yet initialized when this runs.
        // we are using a hack $$search.lergoLanguage

        var me = this;
        me.setLanguage($location.$$search.lergoLanguage || localStorageService.get('lergoLanguage') || DEFAULT_LANGUAGE);
        $rootScope.$on('$routeChangeSuccess', function () {
            me.setLanguage($location.$$search.lergoLanguage || localStorageService.get('lergoLanguage') || DEFAULT_LANGUAGE);
        });
    }

);
