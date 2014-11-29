'use strict';

angular.module('lergoApp').controller('LessonsStepDisplayCtrl', function($scope, $rootScope, StepService, $log, $routeParams, $timeout, $sce, LergoClient, shuffleFilter, $window) {
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

    $scope.updateProgress = function(){
        $log.info('update progress callback was called');
        $scope.updateProgressPercent();
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

			if ($scope.hasNextQuizItem() && (isTestMode() || result.data.correct)) {
				if (isTestMode()) {
					$scope.nextQuizItem();
				} else {
					$timeout(function() {
						$scope.nextQuizItem();
					}, 1000);
				}
			}



            // guy - we must update progress only after we moved to next quiz item or otherwise animation is broken. see lergo-579.
            // this includes delay of 1 second before auto moving to next question.


            // updating progress is a bit complex due to the following issues:
            // 1) when we switch to "next item", the directive is recompiled and replaced by a new one.
            // 2) for both quiz types we want an immediate progress update
            // 3) for practice mode we delay moving to the next question ==> which means we want the same directive to animate
            // 4) for test mode we immediately go to another question ==> which means we want a different directive to animate
            // 5) the progress directive uses `watch` which its async nature makes things complex.
            // 6) the last item in the quiz behaves differently than the rest!! we do not automatically move to next item.

            // to overcome these difficulties we do the following
            // for both cases - if the directive gets the same value on change, it sets value without animation.
            // this resolves reanimation from 0.
            // FOR TEST MODE
            // for all items except last - we rely on the "ready" callback of the progress bar to modify progress.
            // for the last item we immediately modify the progress.
            // FOR QUIZ MODE
            // we immediately modify progress in all scenarios.


            // so to summarize
            // we should update progress in the following 3 possible situations:
            // - we are not in practice mode and we are in the last question.
            // - we are in practice mode and question was correct
            // - we are in practice mode without retry
            // lergo-579 - progress animation is broken

            // to make it easier for reading we broke it down to cases
            if ( isTestMode() ){
                if ( !$scope.hasNextQuizItem() ){
                    $scope.updateProgressPercent();
                }
            }else{
                if ( !$scope.step.retryQuestion || result.data.correct ){
                    $scope.updateProgressPercent();
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
        return StepService.isTestMode($scope.step);
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
