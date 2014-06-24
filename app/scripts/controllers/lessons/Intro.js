'use strict';

angular.module('lergoApp').controller('LessonsIntroCtrl', function($scope, $routeParams, LergoClient, $location, $modal, DisplayRoleService ) {
	var lessonId = $routeParams.lessonId;
	var invitationId = $routeParams.invitationId;
    var preview = !!$routeParams.preview;

	LergoClient.lessons.getPublicById(lessonId).then(function(result) {
		$scope.lesson = result.data;
	});

	function redirectToInvitation() {
		$location.path('/public/lessons/invitations/' + invitationId + '/display');
	}

    function redirectToPreview(){
        $location.path('/user/lessons/' + lessonId + '/display');

    }

    $scope.showActionItems = function(){
        return DisplayRoleService.canSeeActionItemsOnLessonIntroPage();
    };

	$scope.startLesson = function() {
        if ( !!preview ){ // preview - no lesson report, no invitation
            redirectToPreview();
        }
		else if (!invitationId) { // prepared invitation
			LergoClient.lessonsInvitations.createAnonymous(lessonId).then(function(result) {
				invitationId = result.data._id;
				redirectToInvitation();
			});
		} else { // anonymous invitation
			redirectToInvitation();
		}
	};
	$scope.absoluteShareLink = function(lesson) {
		$scope.shareLink =  window.location.origin + '/#/public/lessons/' + lesson._id + '/intro';
		$scope.invite=false;
		$scope.share=!$scope.share;
	};
	$scope.showHideInvite = function(){
		$scope.share=false;
		$scope.invite=!$scope.invite;
	};
	$scope.onTextClick = function ($event) {
	    $event.target.select();
	};
});
