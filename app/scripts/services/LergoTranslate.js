'use strict';

angular.module('lergoApp').service('LergoTranslate', function($routeParams, $http, localStorageService, $log, $rootScope, $timeout, $location, $route, $translate) { /* LergoTranslate */
        // AngularJS will instantiate a singleton by calling "new" on this function

        /*	if (!!$rootScope.noTranslation) {
         return;
         }*/

        var supportedLanguages = [{
            'id': 'en',
            'name' : 'english',
            'dir': 'ltr'
        }, {
            'id': 'he',
            'name' : 'hebrew',
            'dir': 'rtl'
        }, {
            'id': 'ru',
            'name' : 'russian',
            'dir': 'ltr'
        }, {
            'id': 'ar',
            'name' : 'arabic',
            'dir': 'rtl'
        }];
        var DEFAULT_LANGUAGE = 'en';

        this.getSupportedLanguages = function(){
            return _.clone(supportedLanguages);
        };

        this.isSupported = function (language) {

            try {

                this.getLanguageObj(language);
                return true;
            } catch (e) {
                return false;
            }
        };


        this.getLanguageByName = function( _languageName ){
            if ( !_languageName ){ // do something by default for legacy code.
                return supportedLanguages[0];
            }
            return _.find(supportedLanguages, {'name' : _languageName });
        };

        this.setLanguageByName = function( _languageName ){
            this.setLanguage(this.getLanguageByName(_languageName).id);
        };

        /**
         *
         * @param {string} _language the language id . e.g. 'ru' , 'he'
         */
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

        /**
         *
         * @returns {string} language id. e.g. : en, he
         */
        this.getLanguage = function () {
            return $translate.use();
        };

        /**
         *
         * @param [string] _language if empty will use current language
         * @returns {object} the desired language object
         */
        this.getLanguageObj = function (_language) {
            if ( !_language ){
                _language = this.getLanguage();
            }
            return _.find(supportedLanguages, function (item) {
                return item.id === _language;
            });
        };

        this.getLanguageObject = this.getLanguageObj; // alias

        this.getDirection = function(_language){
            return this.getLanguageObj(_language).dir;
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
