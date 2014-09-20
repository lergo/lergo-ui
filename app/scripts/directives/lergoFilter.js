'use strict';
/*jshint camelcase: false */

/**
 *
 *
 *
 *
 */

angular.module('lergoApp')
    .directive('lergoFilter', function ($rootScope, FilterService, $log) {
        return {
            templateUrl: 'views/directives/_lergoFilter.html',
            restrict: 'A',
            scope: {
                'model' : '=',
                'opts' : '=',
                'change' : '&onChange'
            },
            link: function postLink(scope/*, element, attrs*/) {

                scope.$watch( 'model', scope.change, true );

                var $scope = scope;

                $scope.ageFilter = {};

                $scope.subjects = FilterService.subjects;

                $scope.languages = FilterService.languages;

                $scope.status = FilterService.status;

                $scope.reportStatus = FilterService.reportStatus;

                $scope.initFilter = function () {
                    if (!$rootScope.filter) {
                        $rootScope.filter = {
                            'language': FilterService.getLanguageByLocale($rootScope.lergoLanguage)
                        };
                    }
                };

                $scope.statusValue = null;

                $scope.$watch('statusValue', function( newValue, oldValue ){
                    if ( oldValue !== newValue ) {
                        $log.info('statusValue changed', newValue, oldValue );

                        if ( newValue === 'private' ){
                            $scope.model.public = { 'dollar_exists' : false };

                        }
                        else if ( newValue === 'public' ){
                            $scope.model.public = { 'dollar_exists' : true };
                        }
                        else{
                            $scope.model.public = null;
                        }
                    }
                });

                function setDefaultLanguage( force ) {

                    try {
                        if ( (!!scope.opts.showLanguage && !scope.model.language) || !!force) {
                            scope.model.language = FilterService.getLanguageByLocale($rootScope.lergoLanguage);
                        }
                    } catch (e) {
                        $log.error('unable to set default language filter', e);
                    }
                }
                setDefaultLanguage();

                $scope.$watch( function(){ return $rootScope.lergoLanguage;  }, function(){setDefaultLanguage(true);} );

                $scope.reportStatusValue = null;
                $scope.$watch('reportStatusValue', function( newValue, oldValue ){
                    if ( oldValue !== newValue ) {
                        if ( newValue === 'complete'){
                            $scope.model['data.finished'] = { 'dollar_exists' :true };
                        }
                        else if ( newValue === 'incomplete' ){
                            // todo - there is ambiguity in this field.. as incomplete could be interpreted as 'not exists', null or false..
                            // todo - i checked with production, and currently either it exists with value `true` or it doesn't.. but we have to get rid of the multiple meanings.
                            $scope.model['data.finished'] = {  'dollar_exists' : false  };
                        }else{
                            $scope.model['data.finished'] = null;
                        }
                    }
                }, true);

                function minMaxFilter( propertyName ){
                    return function( newValue, oldValue ){
                        if ( newValue === oldValue ){
                            return;
                        }

                        if ( !!newValue.min || !!newValue.max ){
                            $scope.model[propertyName] = {};
                        }else{
                            $scope.model[propertyName] = null;
                        }


                        if ( !!newValue.min ){
                            $scope.model[propertyName].dollar_gt = newValue.min;
                        }

                        if ( !!newValue.max ){
                            $scope.model[propertyName].dollar_lt = newValue.max;
                        }
                    };
                }

                $scope.$watch('ageFilter', minMaxFilter('age'),true);
                $scope.$watch('viewsFilter', minMaxFilter('views'),true);

                // handle 'all' values or null values - simply remove them from the model.
                $scope.$watch('model', function(){

                    _.each(['language','subject','public', 'status','age', 'views', 'data.finished'], function(prop){
                        if ( $scope.model[prop] === null ){
                            delete $scope.model[prop];
                        }
                    });
                }, true);

                $scope.$on('siteLanguageChanged', function () {
                    if (!$rootScope.filter) {
                        $rootScope.filter = {};
                    }
                    $rootScope.filter.language = FilterService.getLanguageByLocale($rootScope.lergoLanguage);
                });
                $scope.initFilter();


            }
        };
    });
