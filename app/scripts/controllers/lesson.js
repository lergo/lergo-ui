'use strict';

angular.module('lergoApp').controller('LessonCtrl', function ($scope, $log, LergoClient, $location) {
    $scope.lesson = {
        'name': null,
        'steps': []
    };
    $scope.lessons = null;


    $scope.create = function (  ) {
        LergoClient.createLesson().then(function () {
            $log.info('got success');
            $location.path('/user/lessons');
        }, function () {
            $log.error('got error');
        });
    };

    $scope.stepTypes = [
        {
            'id' : 'video',
            'label' : 'Video'
        },
        {
            'id' : 'quiz',
            'label' : 'Quiz'
        }
    ];

    $scope.quizTypes = [
        {
            'id' : 'test',
            'label' : 'Test'
        },
        {
            'id' : 'exercise',
            'label' : 'Exercise'
        }
    ];

    $scope.addStep = function (lesson) {
        lesson.steps.push({});
    };

    $scope.getStepViewByType = function (step) {
        var type = 'none';
        if ( !!step && !!step.type ){
            type = step.type.id;
        }
        return 'views/lesson/steps/_' + type + '.html';
    };

    $scope.getAll = function ( ) {
        LergoClient.getLessons().then(function (result) {
            $scope.lessons = result.data.Lessons;
            $log.info('got success');
        }, function () {
            $log.error('got error');
        });
    };

    $scope.deleteLesson = function (id) {
        LergoClient.deleteLesson(id).then(function () {
            $log.info('Deleted successfully');
            $scope.getAll();
        }, function () {
            $log.error('got error');
        });
    };

    $scope.edit = function (lesson) {
        LergoClient.updateLesson(lesson).then(function () {
            $log.info('got success');
            $scope.getAll();
        }, function () {
            $log.error('got error');
        });
    };

    $scope.getAll();
});
