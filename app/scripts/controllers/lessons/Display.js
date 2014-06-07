'use strict';

angular.module('lergoApp')
  .controller('LessonsDisplayCtrl', function ($scope, $routeParams, LergoClient, $log, $controller, $rootScope ) {


        $log.info('loading lesson display ctrl');
        if ( !!$routeParams.lessonId ) {
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



        $scope.currentStepIndex = -1;
        $log.info('current step index', $scope.currentStepIndex);

        $scope.$watch('currentStepIndex', function(oldValue, newValue){
            $rootScope.$broadcast('nextStepClick', { 'old' : oldValue, 'new' : newValue } );
        });

        $scope.hasNextStep = function(){
            return !!$scope.lesson && $scope.lesson.steps &&  $scope.currentStepIndex < $scope.lesson.steps.length;
        };

        $scope.nextStep = function(){
            if ( $scope.hasNextStep() ) {
                $scope.currentStepIndex++;
                $scope.step = $scope.lesson.steps[$scope.currentStepIndex];

            }


        };


  });
