'use strict';

angular.module('lergoApp')
  .controller('LessonsDisplayCtrl', function ($scope, $routeParams, LergoClient, $log ) {

        LergoClient.lessons.getById( $routeParams.lessonId).then(function( result ){
                $log.info('got lesson', result.data);
                $scope.lesson = result.data;
        },
            function( result ){
                $log.info('error while getting lesson', result.data);
            }
        );

        $scope.currentStepIndex = -1;

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
