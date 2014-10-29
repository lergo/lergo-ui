'use strict';

angular.module('lergoApp').controller('LessonsIntroCtrl', function($scope, $routeParams, LergoClient, $location, $modal, DisplayRoleService, $log, $rootScope, FilterService, $window, $filter) {
	$window.scrollTo(0, 0);
	var lessonId = $routeParams.lessonId;
	var invitationId = $routeParams.invitationId;
	var preview = !!$routeParams.preview;
	var autoPlay = $routeParams.autoPlay;

	$scope.shareSection = 'link';

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
		$location.path('/public/lessons/invitations/' + invitationId + '/display').search({
			lessonId : $scope.lesson._id
		});
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
	$scope.$watch('lesson', function(newValue) {
		if (!!newValue) {
			// get my like - will decide if I like this lesson or not
			LergoClient.likes.getMyLessonLike($scope.lesson).then(function(result) {
				$scope.lessonLike = result.data;
			});

			if (lessonLikeWatch === null) {
				lessonLikeWatch = $scope.$watch('lessonLike', function() {
					// get count of likes for lesson
					LergoClient.likes.countLessonLikes($scope.lesson).then(function(result) {
						$scope.lessonLikes = result.data.count;
					});
				});
			}
		}
	});

	$scope.likeLesson = function() {
		$log.info('liking lesson');
		LergoClient.likes.likeLesson($scope.lesson).then(function(result) {
			$scope.lessonLike = result.data;
		});
	};

	$scope.unlikeLesson = function() {
		$log.info('unliking lesson');
		LergoClient.likes.deleteLessonLike($scope.lesson).then(function() {
			$scope.lessonLike = null;
		});
	};

	$scope.isLiked = function() {
		return !!$scope.lessonLike;
	};

	$scope.preview = function() {
		redirectToPreview();
	};

	$scope.showActionItems = function() {
		return DisplayRoleService.canSeeActionItemsOnLessonIntroPage();
	};

	$scope.deleteLesson = function(lesson) {
		var str = $filter('i18n')('deleteIntro.Confirm');
		var canDelete = confirm($filter('format')(str, {
			'0' : lesson.name
		}));
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

	function getQuestionsWithSummary() {
		return _.compact([].concat(_.find($scope.questions || [], function(q) {
			return !!q.summary;
		})));
	}

	// we want to show edit summary in case this lesson is a copy of another
	// lesson
	// or if we have an edit summary on one of the questions.

	// edit summary is used here as an abstraction and does not refer to the
	// question model field 'edit summary'

	$scope.showEditSummary = function() {

		// we want to keep the information about copyOf if copied from yourself.
		// we do not want to display it in the edit summary though
		if (!!$scope.lesson && !!$scope.lesson.copyOf && !!$scope.copyOfItems && $scope.copyOfItems.length > 0) {
			return true;
		}

		if (!!$scope.questionsFromOthers && $scope.questionsFromOthers.length > 0) {
			return true;
		}

		if (!!$scope.questionsWeCopied && $scope.questionsWeCopied.length > 0) {
			return true;
		}

		var withSummary = getQuestionsWithSummary();
		return !!withSummary && withSummary.length > 0;
	};

	LergoClient.lessons.getPermissions(lessonId).then(function(result) {
		$scope.permissions = result.data;
	});

	$scope.showReadMore = function(filteredDescription) {
		$scope.more = !$scope.lesson || !$scope.lesson.description || $scope.lesson.description === '';
		return (!!$scope.lesson && !!$scope.lesson.description && (!!filteredDescription && filteredDescription.length !== $scope.lesson.description.length) || $scope.showEditSummary());
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

	if (!!autoPlay) {
		$scope.startLesson();
	}

	// enum{
	$scope.actionItems = {
		REPORT : 'report',
		INVITE : 'invite',
		SHARE : 'share'
	};
	var activeAction = null;
	$scope.setActiveAction = function(actionItem) {
		if (activeAction === actionItem) {
			activeAction = null;
		} else {
			activeAction = actionItem;
		}
	};
	$scope.isActiveAction = function(actionItem) {
		return activeAction === actionItem;
	};
	$scope.abuseReport = {};
	$scope.submitAbuseReport = function() {
		LergoClient.abuseReports.abuseLesson($scope.abuseReport, $scope.lesson._id).then(function(result) {
			$scope.abuseReport = result.data;
		});
	};

	$scope.onTextClick = function($event) {
		$event.target.select();
	};

	function giveCreditToQuestionsWeCopied(questions) {

		var questionsWeCopied = _.filter(questions, 'copyOf');
		// find all questions with copy of
		var questionsWithCopyOf = _.compact(_.flatten(_.map(questionsWeCopied, 'copyOf')));

		if (!!questionsWithCopyOf && questionsWithCopyOf.length > 0) {
			// get all of these questions
			LergoClient.questions.findQuestionsById(questionsWithCopyOf).then(function(result) {
				var originalQuestions = result.data;

				var usersWeCopiedFrom = _.uniq(_.compact(_.map(originalQuestions, 'userId')));

				// get all users we copied from..
				LergoClient.users.findUsersById(usersWeCopiedFrom).then(function(result) {
					var copyOfUsers = result.data;
					// turn list of users to map where id is map
					var copyOfUsersById = _.object(_.map(copyOfUsers, '_id'), copyOfUsers);

					_.each(originalQuestions, function(q) {
						q.userDetails = copyOfUsersById[q.userId];
					});

					var originalsById = _.object(_.map(originalQuestions, '_id'), originalQuestions);

					_.each(questionsWeCopied, function(q) {

						var originals = [];
						_.each(q.copyOf, function(c) {
							originals.push(originalsById[c]);
						});

						q.originals = originals;

					});

					/* map each question we copied to the original */
					/*
					 * remove question that was created by the same user who
					 * owns this lesson
					 */
					questionsWeCopied = _.filter(questionsWeCopied, function(q) {
						if (!q.originals || q.originals.length < 1) {
							return false;
						}
						_.remove(q.originals, function(o) {
							var remove = o.userId === $scope.lesson.userId;
							return remove;
						});
						return q.originals.length > 0;
					});

					$scope.questionsWeCopied = _.object(_.map(questionsWeCopied, '_id'), questionsWeCopied);
				});
			});

		}
	}
	function giveCreditToQuestionsWeUseFromOthers(questions) {
		var questionsFromOthers = _.filter(questions, function(q) {
			return q.userId !== $scope.lesson.userId;
		});
		var others = _.uniq(_.compact(_.map(questionsFromOthers, 'userId')));

		if (!others || others.length === 0) {
			return;
		}

		LergoClient.users.findUsersById(others).then(function(result) {
			var othersUsers = result.data;
			var othersUsersById = _.object(_.map(othersUsers, '_id'), othersUsers);

			_.each(questionsFromOthers, function(q) {
				q.userDetails = othersUsersById[q.userId];
			});

			$scope.questionsFromOthers = _.object(_.map(questionsFromOthers, '_id'), questionsFromOthers);
		});

	}

	function loadQuestions() {
		var questionsId = [];
		if (!!$scope.lesson && !!$scope.lesson.steps) {
			for ( var i = 0; i < $scope.lesson.steps.length; i++) {
				var items = $scope.lesson.steps[i].quizItems;
				if (!!items && angular.isArray(items)) {
					questionsId.push.apply(questionsId, items);
				}
			}
			LergoClient.questions.findQuestionsById(questionsId).then(function(result) {
				$scope.questions = result.data;
				$scope.questionsWithSummary = _.filter(result.data, 'summary');
				giveCreditToQuestionsWeUseFromOthers($scope.questions);
				giveCreditToQuestionsWeCopied($scope.questions);
			});
		}
	}

	// once we have the copyOf details, we need to fetch details about it like
	// users and lessons.
	// we only want to do this once. We can implement 'unregister' or simply
	// return at the beginning.
	// either way is fine with me.
	$scope.$watch('lesson', function(newValue) {
		if (!!$scope.copyOfItem) {
			return;

		}

		if (!!newValue) {
			$scope.shareLink = LergoClient.lessons.getShareLink(newValue);
			$scope.embedCode = '<iframe src="' + $scope.shareLink + '" height="900" width="600" frameBorder="0"></iframe>';
		}

		if (!!newValue && !!newValue.copyOf) {
			LergoClient.lessons.findLessonsById([].concat(newValue.copyOf)).then(function(result) {
				// we want to keep the information about copyOf if copied from
				// yourself.
				// we do not want to display it in the edit summary though
				var copyOfLessons = _.compact(_.filter(result.data, function(i) {
					if ($scope.lesson.userId !== i.userId) {
						return i;
					}
				}));
				LergoClient.users.findUsersById(_.map(copyOfLessons, 'userId')).then(function(result) {
					var copyOfUsers = result.data;
					// turn list of users to map
					var copyOfUsersById = _.object(_.map(copyOfUsers, '_id'), copyOfUsers);

					_.each(copyOfLessons, function(l) {
						l.userDetails = copyOfUsersById[l.userId];
					});

					$scope.copyOfItems = copyOfLessons;

				});
			});
		}
	});

});
