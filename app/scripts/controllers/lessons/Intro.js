'use strict';

angular.module('lergoApp').controller('LessonsIntroCtrl', function($scope, $routeParams, LergoClient, $location, $modal, DisplayRoleService, $log, $rootScope, FilterService) {
	var lessonId = $routeParams.lessonId;
	var invitationId = $routeParams.invitationId;
	var preview = !!$routeParams.preview;
	LergoClient.lessons.getLessonIntro(lessonId).then(function(result) {
		$scope.lesson = result.data;
        $rootScope.page = {
            'title' : $scope.lesson.name,
            'description' : $scope.lesson.description
        };
		loadQuestions();
		$rootScope.lergoLanguage = FilterService.getLocaleByLanguage($scope.lesson.language);
	}, function(result) {
		if (result.status === 404) {
			$location.path('/errors/notFound');
		}
	});

	function redirectToInvitation() {
		$location.path('/public/lessons/invitations/' + invitationId + '/display');
	}

	function redirectToPreview() {
		$location.path('/user/lessons/' + lessonId + '/display');

	}

	$scope.copyLesson = function() {
		LergoClient.lessons.copyLesson(lessonId).then(function(result) {
			$location.path('/user/lessons/' + result.data._id + '/update');
		}, function(result) {
			$log.error(result);
		});
	};

    var lessonLikeWatch = null;
    $scope.$watch('lesson', function (newValue) {
        if (!!newValue) {
            // get my like - will decide if I like this lesson or not
            LergoClient.likes.getMyLessonLike($scope.lesson).then(function (result) {
                $scope.lessonLike = result.data;
            });

            if (lessonLikeWatch === null) {
                lessonLikeWatch = $scope.$watch('lessonLike', function () {
                    // get count of likes for lesson
                    LergoClient.likes.countLessonLikes($scope.lesson).then(function (result) {
                        $scope.lessonLikes = result.data.count;
                    });
                });
            }
        }
    });



    $scope.likeLesson = function () {
        $log.info('liking lesson');
        LergoClient.likes.likeLesson($scope.lesson).then(function (result) {
            $scope.lessonLike = result.data;
        });
    };

    $scope.unlikeLesson = function(){
        $log.info('unliking lesson');
        LergoClient.likes.deleteLessonLike( $scope.lesson).then(function(){
            $scope.lessonLike = null;
        });
    };

    $scope.isLiked = function(){
        return !!$scope.lessonLike;
    };



	$scope.preview = function() {
		redirectToPreview();
	};

	$scope.showActionItems = function() {
		return DisplayRoleService.canSeeActionItemsOnLessonIntroPage();
	};

	$scope.deleteLesson = function(lesson) {
		var canDelete = window.confirm('Are you sure you want to delete the lesson: ' + lesson.name + ' ?');
		if (canDelete) {
			LergoClient.lessons.delete(lesson._id).then(function() {
				$scope.errorMessage = null;
				$log.info('Lesson deleted sucessfully');
				$location.path('/user/create/lessons');
			}, function(result) {
				$scope.errorMessage = 'Error in deleting Lesson : ' + result.data.message;
				$log.error($scope.errorMessage);
			});
		}
	};

    $scope.noop = angular.noop;

    function getQuestionsWithSummary(){
        return [].concat(_.find($scope.questions || [], function(q){ return !!q.summary}));
    }

    $scope.showEditSummary = function(){
        var withSummary = getQuestionsWithSummary();
        debugger;
        return !!withSummary && withSummary.length > 0;
    };



    $scope.showReadMore = function(filteredDescription){

        return !!$scope.lesson && !!$scope.lesson.description &&
            ( ( !!filteredDescription &&  filteredDescription.length !== $scope.lesson.description.length ) ||
                ( !!$scope.questionsWithSummary && $scope.questionsWithSummary.length > 0 ) );
    };

	$scope.startLesson = function() {
		if (!!preview) { // preview - no lesson report, no invitation
			redirectToPreview();
		} else if (!invitationId) { // prepared invitation
			LergoClient.lessonsInvitations.createAnonymous(lessonId).then(function(result) {
				invitationId = result.data._id;
				redirectToInvitation();
			});
		} else { // anonymous invitation
			redirectToInvitation();
		}
	};
	$scope.absoluteShareLink = function(lesson) {
		$scope.shareLink = window.location.origin + '/#!/public/lessons/' + lesson._id + '/intro';
		$scope.invite = false;
		$scope.share = !$scope.share;
	};
	$scope.showHideInvite = function() {
		$scope.share = false;
		$scope.invite = !$scope.invite;
	};
	$scope.onTextClick = function($event) {
		$event.target.select();
	};
	function loadQuestions() {
		var questionsId = [];
		if (!!$scope.lesson) {
			for ( var i = 0; i < $scope.lesson.steps.length; i++) {
				var items = $scope.lesson.steps[i].quizItems;
				if (!!items && angular.isArray(items)) {
					questionsId.push.apply(questionsId, items);
				}
			}
			LergoClient.questions.findQuestionsById(questionsId).then(function(result) {
				$scope.questions = result.data;
                $scope.questionsWithSummary = _.filter(result.data,'summary');
			});
		}
	}

});
