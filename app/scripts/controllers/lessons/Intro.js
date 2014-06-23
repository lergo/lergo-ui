'use strict';

angular.module('lergoApp').controller('LessonsIntroCtrl', function($scope, $routeParams, LergoClient, $location,$modal) {
	var lessonId = $routeParams.lessonId;
	var invitationId = $routeParams.invitationId;

	LergoClient.lessons.getPublicById(lessonId).then(function(result) {
		$scope.lesson = result.data;
	});

	function redirectToInvitation() {
		$location.path('/public/lessons/invitations/' + invitationId + '/display');
		$location.path();
	}

	$scope.startLesson = function() {
		if (!invitationId) {
			LergoClient.lessonsInvitations.createAnonymous(lessonId).then(function(result) {
				invitationId = result.data._id;
				redirectToInvitation();
			});
		} else {
			redirectToInvitation();
		}
	};
	$scope.absoluteShareLink = function(lesson) {
		$scope.shareLink =  window.location.origin + '/#/public/lessons/' + lesson._id + '/share';
		$scope.share=!$scope.share;
	};
	$scope.showHideInvite = function(){
		$scope.invite=!$scope.invite;
	};
});
