'use strict';

angular.module('lergoApp')
    .directive('loadFilterAndPaging', function ($parse, $log) {
        return {
            restrict: 'A',
            link: function postLink(scope, element, attrs) {

                var filterLoaded = false;
                var pagingLoaded = false;

                $log.info('when both are loaded I will run ... ');
                var expressionHandler = $parse(attrs.loadFilterAndPaging);



                function fireFunction(){
                    if ( filterLoaded && pagingLoaded ){
                        expressionHandler(scope);
                    }
                }

                scope.filterLoaded = function(){
                    $log.info('filter was loaded');
                    filterLoaded = true;
                    fireFunction();
                };


                scope.pagingLoaded = function(){
                    $log.info('paging was loaded');
                    pagingLoaded = true;
                    fireFunction();
                };


            }
        };
    });
