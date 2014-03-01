'use strict';

angular.module('lergoApp')
    .directive('question', function () {
        return {
            templateUrl: 'views/questions/question.html',
            restrict: 'A',
            'scope': {
                'question': '='

            },
            link: function ($scope/*, element, attrs*/) {

                $scope.getPartialNameByType = function () {

                    if (!!$scope.question && !!$scope.question.type) {
                        var type = $scope.question.type;
                        if (type.id === 1) {
                            return 'views/questions/_multipleChoices.html';
                        } else if (type.id === 2) {
                            return 'views/questions/_fillInTheBlanks.html';
                        }
                        return 'views/questions/_error.html';
                    }
                };
            }
        };
    });
