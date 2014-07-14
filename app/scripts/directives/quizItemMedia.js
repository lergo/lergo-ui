'use strict';

angular.module('lergoApp')
    .directive('quizItemMedia', function ($sce, $compile, $timeout, $log) {
        return {
            templateUrl: 'views/directives/_quizItemMedia.html',
            restrict: 'A',
            scope: {
                'quizItem': '='
            },
            link: function postLink($scope, $element/*, attrs*/) {

                var url = null;
                var contents = $element.html();


                function removeRedundantElement(){
                    if ($scope.quizItem.media.type === 'audio' || !$scope.quizItem.media.url || $scope.quizItem.media.url.trim() === '' ) {
                        url = $sce.trustAsResourceUrl($scope.quizItem.media.url);
                        $element.find('img').remove();
                    }

                    if ($scope.quizItem.media.type === 'image' || !$scope.quizItem.media.url || $scope.quizItem.media.url.trim() === '') {
                        url = $sce.trustAsResourceUrl($scope.quizItem.media.url);
                        $element.find('audio').remove();
                    }

                    if ($scope.quizItem.media.type !== 'image' && $scope.quizItem.media.type !== 'audio') {
                        $element.remove();
                    }
                }

                function compileTemplate(){
                    $element.empty();
                    var compiledHTML = $compile(contents)($scope);
                    $timeout(function () { // need this because compiling is on event queue so we register right after it.http://stackoverflow.com/a/18600499/1068746
                        $element.append(compiledHTML);
                        removeRedundantElement();
                    }, 0);
                }



                $scope.$watch( function(){
                    // guy - todo -once media model is sorted out, we should change this watch expression
                    try{
                        if ( !$scope.quizItem ){
                            return undefined;
                        }else{
                            return $scope.quizItem.media + $scope.quizItem.media.url;
                        }
                    }catch(e){
                        $log.error(e);
                    }
                }, function (newValue, oldValue) {
                    $log.info('value changed ', newValue, oldValue);
                    if (!!$scope.quizItem) {
                        if (!!$scope.quizItem.media) {
                            compileTemplate();
                        }else{
                            $element.empty();
                        }
                    }

                }, true);


                $scope.getUrl = function () {
                    return url;

                };
            }
        };
    });
