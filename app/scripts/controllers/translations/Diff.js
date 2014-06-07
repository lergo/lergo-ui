'use strict';

angular.module('lergoApp')
  .controller('TranslationsDiffCtrl', function ($scope, LergoTranslate, $rootScope ) {
        $scope.translations = LergoTranslate.getTranslations();
        $scope.page = { 'translation' : null };

        $scope.truncateEntry = function( entry ){
            if ( entry.length  > 20 ){
                return '...' + entry.substring( entry.length - 20);
            }
            return entry;
        };

        function extractKeysOfObject( baseKey , object, result  ){
            for ( var i in object ){
                if ( object.hasOwnProperty(i)) {
                    var entry = object[i];
                    if ( typeof(entry) === 'object'){
                        if ( baseKey.length === 0 ){
                            extractKeysOfObject( i , entry, result );
                        }else{
                            extractKeysOfObject( baseKey + '.' + i , entry, result );
                        }

                    }else{
                        if ( baseKey.length === 0 ){
                            result.push(i);
                        }else{

                            result.push(baseKey + '.' + i);
                        }

                    }
                }
            }
        }

        var keys = [];
        var english = $scope.translations['en'];
        extractKeysOfObject('', english, keys );
        $scope.translationEntries = keys;

        function getField( object, path ){

            var result = object;
            for ( var i in path ){
                var key = path[i];
                if ( !!result && result.hasOwnProperty(key) ){
                    result = result[key];
                }else{
                    return '';
                }
            }

            return result;
        }

        $scope.getTranslationValue = function( entry ){
            return getField( $scope.translations[$rootScope.lergoLanguage], entry.split('.'));

        };

        $scope.getBaseValue = function( entry ){

            return getField( $scope.translations['en'], entry.split('.'));

        };
  });
