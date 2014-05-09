'use strict';

angular.module('lergoApp').service('LergoTranslate',
    function ( $routeParams, $http, localStorageService, $log , $rootScope ) { /*LergoTranslate */
        // AngularJS will instantiate a singleton by calling "new" on this function



        var supportedLanguages = [ { 'id' : 'en', 'dir' : 'ltr' } , { 'id' : 'he', 'dir' : 'rtl' } ];

        var language = localStorageService.get('lergoLanguage');
        if ( !language ){
            language = $routeParams.hasOwnProperty('language') ? $routeParams.language : 'en';
        }


        $rootScope.lergoLanguage = language;

        var translations = {};


        $( supportedLanguages ).each( function(index,item){
            $http.get('/translations/' + item.id + '.json').then(function(data){
                translations[item.id] = data.data;
            });
        });



        this.isSupported = function( language ){

            try{

                this.getLanguageObj( language  );
                return true;
            }catch(e){
                return false;
            }
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

        this.getLanguageObj = function( _language ){
            var __language = _language || language;
            return $.grep( supportedLanguages, function( item/*,index*/){ return item.id == __language })[0];
        };

        this.getSupportedLanguages = function(){
            return supportedLanguages;
        };

        this.translate = function (key) {

            $log.info('language is', language);
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
