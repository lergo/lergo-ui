'use strict';

angular.module('lergoApp')
    .controller('LessonsReportWriteCtrl', function ($scope, $log) {

        $scope.$on('nextStepClick', function (event, data) {
            $log.info('nextStepClicked', event, data);
        });


        var saveLesson = new ContinuousSave({
            'saveFn': function (value) {
                return LergoClient.lessonsInvitations.update(value);
            }
        });
//
//        $scope.isSaving = function () {
//            return !!saveLesson.getStatus().saving;
//        };

        $scope.displayStep = function (step) {
            $location.path('/user/lessons/step/display').search('data', JSON.stringify(step));
        };

        $scope.$watch('model', function (newValue, oldValue) {
            $log.info('model has changed', newValue, oldValue );
        }, true);
//        LergoClient.lessons.getById($routeParams.lessonId).then(function (result) {
//            $scope.lesson = result.data;
//            $scope.errorMessage = null;
//            $scope.$watch('lesson', saveLesson.onValueChange, true);
//        }, function (result) {
//            $scope.errorMessage = 'Error in fetching Lesson by id : ' + result.data.message;
//            $log.error($scope.errorMessage);
//        });

    });
