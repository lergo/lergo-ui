'use strict';

angular.module('lergoApp').service('LergoTranslate',
    function ( $routeParams, $http, localStorageService, $log , $rootScope ) { /*LergoTranslate */
        // AngularJS will instantiate a singleton by calling "new" on this function

        var supportedLanguages = ['en','he'];

        var language = localStorageService.get('lergoLanguage');
        if ( !language ){
            language = $routeParams.hasOwnProperty('language') ? $routeParams.language : 'en';
        }


        $rootScope.lergoLanguage = language;

        var translations = {};


        $( supportedLanguages ).each( function(index,item){
            $http.get('/translations/' + item + '.json').then(function(data){
                translations[item] = data.data;
            });
        });



        this.isSupported = function( language ){
            return supportedLanguages.indexOf(language) >= 0;
        };

        this.setLanguage = function (_language) {
            $log.info('setting new language', _language );
            if ( this.isSupported( _language ) ) {
                language = _language;
                localStorageService.set('lergoLanguage', _language);
            }else{
                $log.info('language',language,'is not supported');
            }
        };

        this.getLanguage = function () {
            return language;
        };

        this.getSupportedLanguages = function(){
            return supportedLanguages;
        };

        this.translate = function (key) {
            var args = key.split('.');
            var t = translations[language];
            for ( var i = 0; i < args.length; i ++ ){
                if ( !!t && t.hasOwnProperty(args[i]))
                {
                    t = t[args[i]];
                }
            }
            if ( !t || typeof(t) !== 'string' || $.trim(t).length === 0 ){
                return '???' + key + '???';
            }
            return t;
        };
    }
);
