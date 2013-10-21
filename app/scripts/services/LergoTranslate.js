'use strict';

angular.module('lergoApp').service('LergoTranslate',
    function ( $routeParams, $http ) { /*LergoTranslate */
        // AngularJS will instantiate a singleton by calling "new" on this function

        var language = $routeParams.hasOwnProperty('language') ? $routeParams.language : 'en';


        var translations = {};


        $(['en','he']).each( function(index,item){
            $http.get('/translations/' + item + '.json').then(function(data){
                translations[item] = data.data;
            });
        });



        this.setLanguage = function (_language) {
            language = _language;
        };

        this.getLanguage = function () {
            return language;
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
