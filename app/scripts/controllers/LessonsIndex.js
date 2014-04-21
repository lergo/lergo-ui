'use strict';

angular.module('lergoApp').controller('LessonsIndexCtrl', function($scope, $log, LergoClient, $location) {
	$scope.lessons = null;
	$scope.getAll = function() {
		LergoClient.lessons.getAll().then(function(result) {
			$scope.lessons = result.data;
			$log.info('got success');
		}, function() {
			$log.error('got error');
		});
	};
	$scope.$on('$viewContentLoaded', function() {
		$scope.getAll();
	});


    $scope.create = function() {
        LergoClient.lessons.create().then(function(result) {
            var lesson = result.data;
            $location.path('/user/lesson/' + lesson._id + '/update');
        }, function() {
            $log.error('got error');
        });
    };

    $scope.deleteLesson = function(lesson) {
        var canDelete = window.confirm('Are yoy sure to delete Lesson : ' + lesson.name + ' ?');
        if (canDelete) {
            LergoClient.lessons.delete(lesson._id).then(function() {
                $log.info('Deleted sucessfully');
                $scope.getAll();
            }, function() {
                $log.error('got error');
            });
        }
    };
});
