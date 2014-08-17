'use strict';

angular.module('lergoApp').controller('LessonsInvitesCreateCtrl', function($scope, $log, LergoClient, $routeParams) {

	var invitation = null;

	$scope.invite = {
		'lessonId' : $routeParams.lessonId,
		'invitee' : {}
	};

	$scope.getLink = function() {
		if (invitation !== null) {
			return window.location.origin + '/#!/public/lessons/' + invitation.lessonId + '/intro?invitationId=' + invitation._id;
		}
	};

	$scope.newInvite = function() {
		$scope.createSuccess = false;
		$scope.invite.invitee = {};
	};
	$scope.sendInvite = function() {
		$scope.createError = false;
		$scope.createSuccess = false;
		$log.info('inviting', $scope.invite);
		LergoClient.lessonsInvitations.create($routeParams.lessonId, $scope.invite).then(function(result) {
			invitation = result.data;
			$log.info('after invitation');
			$scope.createSuccess = true;
		}, function() {
			$scope.createError = true;
		});
	};
	$scope.enterPressed = function() {
		if ($scope.createSuccess) {
			$scope.newInvite();
		} else if (!!$scope.invite.invitee.name) {
			$scope.sendInvite();
		}
	};
});
