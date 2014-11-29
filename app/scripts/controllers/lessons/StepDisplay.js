'use strict';

angular.module('lergoApp').controller('LessonsStepDisplayCtrl', function($scope, $rootScope, $log, $routeParams, $timeout, $sce, LergoClient, shuffleFilter, $window) {
	$log.info('showing step');
	$window.scrollTo(0, 0);
	var audio = new Audio('../audio/correctanswer.mp3');

	if (!!$routeParams.data) {
		$scope.step = JSON.parse($routeParams.data);
		shuffleFilter($scope.step.quizItems, !$scope.step.shuffleQuestion);
		$log.info($scope.step);
	}

	function currentIndex() {
		return _.size($scope.answers);
	}
	$scope.answers = {};
	function reload() {
		$log.info('reload display for step');

		// guy - when we watch an invitation, we get all the questions for all
		// steps pre-resolved.
		// however, when we preview a lesson, this controller/scope are
		// responsible for resolving the questions
		// and they resolve it for each step anew.
		// so we have 2 different algorithms for resolving questions for quiz.
		// in order to align them, we need to nullify the "questions" on the
		// scope but only (!!) if this
		// controller and scope are responsible for resolving them.
		if (!!$scope.questions && $scope.hasOwnProperty('questions')) { // if
			// this scope takes care
			$scope.questions = null;
		}

		if (!$scope.step) {
			return;
		}

		$scope.answers = {};

		// guy - do not use 'hasOwnProperty' as scope might not have the
		// property, but there is such a value.
		if (!!$scope.step && !!$scope.step.quizItems && !$scope.questions) {
			LergoClient.questions.findQuestionsById($scope.step.quizItems).then(function(result) {
				var questions = {};
				for ( var i in result.data) {
					questions[result.data[i]._id] = result.data[i];
				}
				$scope.questions = questions;
				$scope.nextQuizItem();
			});
		}
	}

	$scope.$watch('step', reload);
	$scope.getQuizItemTemplate = function() {
		if (!!$scope.questions) {
			if (!!$scope.quizItem && !$scope.quizItem.startTime) {
				$scope.quizItem.startTime = new Date().getTime();
			}
			return !!$scope.quizItem && LergoClient.questions.getTypeById($scope.quizItem.type).viewTemplate || '';
		}
		return '';
	};

	$scope.checkAnswer = function() {
		var quizItem = $scope.quizItem;
		var duration = Math.max(0, new Date().getTime() - quizItem.startTime);
		// using max with 0 just in case something went wrong and startTime >
		// endTime.. LERGO-468
		LergoClient.questions.checkAnswer(quizItem).then(function(result) {
			$scope.answers[quizItem._id] = result.data;
			$rootScope.$broadcast('questionAnswered', {
				'userAnswer' : quizItem.userAnswer,
				'checkAnswer' : result.data,
				'quizItemId' : quizItem._id,
				'duration' : duration,
				'isHintUsed' : !!quizItem.isHintUsed
			});

			if (!isTestMode() && result.data.correct) {
				voiceFeedback();
			}

			if (!$scope.step.retryQuestion || result.data.correct) { // if
				// incorrect
				// and
				// retry,
				// then
				// retry
				$scope.updateProgressPercent();
			}

			if ($scope.hasNextQuizItem() && (isTestMode() || result.data.correct)) {
				if (isTestMode()) {
					$scope.nextQuizItem();
				} else {
					$timeout(function() {
						$scope.nextQuizItem();
					}, 1000);
				}
			}
		}, function() {
			$log.error('there was an error checking answer');
		});
	};

	// quiz is done only iff all of the following are correct
	// 1. all questions were answered
	// 2. no retry required for last question -- which means last answer was
	// correct or no retry configured
	// guy - the last question is a special scenario since all the others will
	// fall on the first condition.

	// if step is not quiz - then we will return "true" as default.
	$scope.isQuizDone = function() {

		if ($scope.step.type !== 'quiz') { // return true if not quiz.
			return true;
		}

		var answer = $scope.getAnswer();
		var allQuestionsWereAnswered = !$scope.hasNextQuizItem() && answer;
		if (isTestMode()) {
			return allQuestionsWereAnswered;
		} else {
			var noRetryOnLast = answer && (answer.correct || !$scope.step.retryQuestion);
			return allQuestionsWereAnswered && noRetryOnLast; // the full
			// condition
		}
	};

	$scope.getQuizItem = function() {
		return $scope.quizItem && $scope.quizItem._id;
	};

	$scope.getAnswer = function() {
		var quizItem = $scope.quizItem;
		return !!quizItem && $scope.answers.hasOwnProperty(quizItem._id) ? $scope.answers[quizItem._id] : null;
	};

	$scope.nextQuizItem = function() {
		$log.info('next');

		if (!$scope.questions) {
			return;
		}

		if (!!$scope.step && !!$scope.step.quizItems && $scope.step.quizItems.length > currentIndex()) {
			var quizItem = $scope.step.quizItems[currentIndex()];
			$scope.quizItem = $scope.questions[quizItem];
		}
	};

	$scope.showNextQuestion = function() {
		return ((!isTestMode() && $scope.step.retryQuestion) || $scope.hasNextQuizItem()) && $scope.getAnswer() && !$scope.getAnswer().correct;
	};

	$scope.hasNextQuizItem = function() {
		return !!$scope.step && !!$scope.questions && currentIndex() < _.size($scope.questions);
	};

	$scope.getStepViewByType = function(step) {
		var type = 'none';
		if (!!step && !!step.type) {
			type = step.type;
		}
		return 'views/lesson/steps/view/_' + type + '.html';
	};

	$scope.getYoutubeEmbedSource = function(step) {
		var src = '//www.youtube.com/embed/' + $scope.getVideoId(step) + '?autoplay=1&rel=0&iv_load_policy=3';
		return $sce.trustAsResourceUrl(src);
	};

	$scope.videoSize = {
		'width' : 672,
		'height' : 378
	};
	if ($scope.embeddedMode) {
		$scope.videoSize.width = 600;
	}

	$scope.getVideoId = function(step) {
		var value = null;
		if (!!step && !!step.videoUrl) {
			if (step.videoUrl.toLocaleLowerCase().indexOf('youtu.be') > 0) {
				value = step.videoUrl.substring(step.videoUrl.lastIndexOf('/') + 1);
			} else {
				value = step.videoUrl.split('?')[1].split('v=')[1];
			}
		}

		return value;
	};

	$scope.getCorrectAnswers = function(quizItem) {
		if (!quizItem || !quizItem.type || !LergoClient.questions.getTypeById(quizItem.type).answers(quizItem)) {
			return '';
		}
		return LergoClient.questions.getTypeById(quizItem.type).answers(quizItem);
	};

	$scope.$watch('step', function(newValue, oldValue) {
		if (newValue !== oldValue) {
			$scope.progressPercentage = 0;
		}
	});

	$scope.updateProgressPercent = function() {
		if (!$scope.step || !$scope.step.quizItems || $scope.step.quizItems.length < 1) {
			$scope.progressPercentage = 0;
		} else {
			// guy - count percentage by counting the answers. not current
			// index.

			$scope.progressPercentage = Math.round((_.size($scope.answers) * 100) / _.size($scope.questions));
		}
	};

	$scope.enterPressed = function(quizItem) {
		if (!$scope.getAnswer(quizItem) && $scope.canSubmit(quizItem)) {
			$scope.checkAnswer();
		} else if ($scope.getAnswer(quizItem) && !$scope.isQuizDone()) {
			$scope.retryOrNext();
		}
	};

	// autofocus not working properly in control of partial view when added
	// through ngInclude this is a hook to get the desired behaviour
	$scope.setFocus = function(id) {
		document.getElementById(id).focus();
	};

	$scope.canSubmit = function(quizItem) {
		if (!quizItem && !quizItem.type) {
			return false;
		}
		return LergoClient.questions.getTypeById(quizItem.type).canSubmit(quizItem);
	};

	$scope.getFillIntheBlankSize = function(quizItem, index) {
		if (!quizItem.blanks || !quizItem.blanks.type || quizItem.blanks.type === 'auto') {
			if (!!quizItem.answer[index]) {
				var answer = quizItem.answer[index].split(';');
				var maxLength = 0;
				for ( var i = 0; i < answer.length; i++) {
					if (answer[i].length > maxLength) {
						maxLength = answer[i].length;
					}
				}
				return maxLength * 10 + 20;
			}
		} else if (quizItem.blanks.type === 'custom') {
			quizItem.blanks.size = !!quizItem.blanks.size ? quizItem.blanks.size : 4;
			return quizItem.blanks.size * 10 + 20;
		}
	};
	$scope.hintUsed = function(quizItem) {
		quizItem.isHintUsed = true;
	};

	function isTestMode() {
		if (!!$scope.step) {
			return $scope.step.testMode === 'True';
		}
		return false;
	}

	function voiceFeedback() {
		audio.play();
	}

	$scope.isCorrectFillInTheBlanks = function(quizItem, index) {

		var userAnswer = quizItem.userAnswer[index];
		if (!userAnswer) {
			return false;
		}
		if (quizItem.answer[index].split(';').indexOf(userAnswer) === -1) {
			return false;
		} else {
			return true;
		}
	};

	$scope.isMultiChoiceMultiAnswer = function(quizItem) {
		var correctAnswers = _.filter(quizItem.options, 'checked');
		return correctAnswers.length > 1;
	};

	// reach here when you click next after got question wrong
	// if step defined with "allow retry" - we will try again, otherwise we move
	// to next item.
	$scope.retryOrNext = function() {
		if ($scope.step.retryQuestion) {
			$scope.tryAgain();
		} else {
			$scope.nextQuizItem();
		}
	};

	$scope.tryAgain = function() {
		$log.info('trying again');
		var quizItem = $scope.quizItem;
		if (!!quizItem.options) {
			quizItem.options.isShuffled = false;
			_.each(quizItem.options, function(option) {
				option.userAnswer = false;
			});
		}
		delete $scope.answers[quizItem._id];
		quizItem.startTime = new Date().getTime();
		$scope.updateProgressPercent();
		quizItem.userAnswer = null;
	};

});
