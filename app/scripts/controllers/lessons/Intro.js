'use strict';

angular.module('lergoApp').controller('LessonsIntroCtrl', function($scope, $routeParams, LergoClient, $location, $modal, DisplayRoleService, $log ) {
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

    $scope.copyLesson = function(){
        LergoClient.lessons.copyLesson( lessonId).then(function(result){
            $location.path('/user/lessons/' + result.data._id + '/update');
        }, function(result){
            $log.error(result);
        });
    };

    $scope.preview = function(){
        redirectToPreview();
    };

    $scope.showActionItems = function(){
        return DisplayRoleService.canSeeActionItemsOnLessonIntroPage();
    };

    $scope.deleteLesson = function(lesson) {
        var canDelete = window.confirm('Are you sure you want to delete the lesson: ' + lesson.name + ' ?');
        if (canDelete) {
            LergoClient.lessons.delete(lesson._id).then(function() {
                $scope.errorMessage = null;
                $log.info('Lesson deleted sucessfully');
                $location.path('/user/lessons');
            }, function(result) {
                $scope.errorMessage = 'Error in deleting Lesson : ' + result.data.message;
                $log.error($scope.errorMessage);
            });
        }
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
