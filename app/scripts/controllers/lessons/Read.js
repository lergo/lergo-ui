'use strict';

angular.module('lergoApp').controller('LessonsReadCtrl', function($scope, $routeParams, $location, $log, LergoClient,VideoService) {
	LergoClient.lessons.getById($routeParams.lessonId).then(function(result) {
		$scope.lesson = result.data;
		$scope.errorMessage = null;
	}, function(result) {
		$scope.errorMessage = 'Error in fetching Lesson by id : ' + result.data.message;
		$log.error($scope.errorMessage);
	});
	$scope.getDisplayUrl = function(step) {
		LergoClient.lessons.selectedStep = step;
		if (step.type === 'video') {
			var media = VideoService.getMedia(step.videoUrl);
			if (media === undefined)
			    	return;
			else {
				$location.path('/user/lessons/step/video/' + media.id);
			}
		} else {
			$location.url('/user/lessons/step/quiz?'  + $.param({data : JSON.stringify(step)}));
		}
	};

	
	
});
