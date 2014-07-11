'use strict';

angular.module('lergoApp')
    .directive('quizItemMedia', function ($sce) {
        return {
            templateUrl: 'views/directives/_quizItemMedia.html',
            restrict: 'A',
            scope: {
                'quizItem': '='
            },
            link: function postLink($scope, element/*, attrs*/) {

                var url = null;

                $scope.$watch('quizItem', function (/*newValue/*, oldValue*/) {
                    if (!!$scope.quizItem) {
                        if (!!$scope.quizItem.media) {
                            if ($scope.quizItem.media === 'audio') {
                                url = $sce.trustAsResourceUrl($scope.quizItem.audioUrl);
                                element.find('img').remove();
                            }

                            if ($scope.quizItem.media === 'image') {
                                url = $sce.trustAsResourceUrl($scope.quizItem.imageUrl);
                                element.find('audio').remove();
                            }

                            if ($scope.quizItem.media !== 'image' && $scope.quizItem.media !== 'audio') {
                                element.remove();
                            }
                        }
                    }

                }, true);


                $scope.getUrl = function () {
                    return url;

                };
            }
        };
    });
