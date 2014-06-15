'use strict';

angular.module('lergoApp')
    .controller('LessonsDisplayCtrl', function ($scope, $routeParams, LergoClient, $log, $controller, $rootScope, $location) {


        $log.info('loading lesson display ctrl');
        if (!!$routeParams.lessonId) {
            LergoClient.lessons.getById($routeParams.lessonId).then(function (result) {
                    $log.info('got lesson', result.data);
                    $scope.lesson = result.data;
                },
                function (result) {
                    $log.info('error while getting lesson', result.data);
                }
            );
        }

        $controller('LessonsStepDisplayCtrl', {$scope: $scope});


        $scope.currentStepIndex = parseInt($routeParams.currentStepIndex || -1, 10);
        $log.info('current step index', $scope.currentStepIndex);

        // will update step on scope
        function updateCurrentStep() {
            if ($scope.currentStepIndex >= 0) {
                if (!!$scope.lesson) {
                    $scope.step = $scope.lesson.steps[$scope.currentStepIndex];
                } else {
                    $scope.step = null;
                }
            }
        }


        // resolving initialization issue - in case we don't have a lesson yet, and we are
        // not at step -1, $scope.step will be null/undefined.
        // so we listen on lesson and initialize it
        if (!$scope.lesson) {
            var unwatchLesson = $scope.$watch('lesson', function (newValue) {
                if (!!newValue && $scope.currentStepIndex !== undefined) {
                    updateCurrentStep();
                    unwatchLesson();
                }
            });
        }

        $scope.$watch('currentStepIndex', function (newValue, oldValue) {
            updateCurrentStep();
            $location.search('currentStepIndex', newValue);
            $rootScope.$broadcast('nextStepClick', { 'old': oldValue, 'new': newValue });
        });

        $scope.$watch(function () {
            return $routeParams.currentStepIndex
        }, function (newValue, oldValue) {
            if ( newValue !== undefined ) {
                $scope.currentStepIndex = newValue;
            }
        });

        $scope.hasNextStep = function () {
            return !!$scope.lesson && $scope.lesson.steps && $scope.currentStepIndex < $scope.lesson.steps.length;
        };

        $scope.showSteps = function () {
            return $scope.currentStepIndex >= 0;
        };

        $scope.showStart = function () {
            debugger;
            return  $scope.currentStepIndex < 0;
        };

        $scope.nextStep = function () {
            if ($scope.hasNextStep()) {
                $scope.currentStepIndex++;


            }
        };


    });
