'use strict';

var LessonsStepDisplayCtrl = function ($scope, $rootScope, StepService, $log, $routeParams, $timeout, $sce,
                                       LergoClient, shuffleFilter, localStorageService, $window) {
    $log.info('showing step');

    // used to fix bug where hint stays open when switching between questions.
    $scope.stepDisplay = {showHint: false};

    $window.scrollTo(0, 0);
    var audio = new Audio('../audio/correctanswer.mp3');

    $scope.scrollUp = function () {
        $window.scrollTo(0, 0);
    };

    if (!!$routeParams.data) {
        $scope.step = JSON.parse($routeParams.data);
        shuffleFilter($scope.step.quizItems, !$scope.step.shuffleQuestion);
    }

    function currentIndex() {
        return _.size($scope.answers);
    }


    if (!$scope.answers) { // parent scope might declare answers
        $scope.answers = {};
    }


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


        // lets initialize the answers on load
        // if the user already done part of the quiz, we skip questions he already answered..
        if ($scope.$parent && !$scope.$parent.answers) {
            $scope.answers = {};
        } else {
            $scope.answers = $scope.$parent.answers;
        }

        // guy - do not use 'hasOwnProperty' as scope might not have the
        // property, but there is such a value.
        if (!!$scope.step && !!$scope.step.quizItems && !$scope.questions) {
            LergoClient.questions.findQuestionsById($scope.step.quizItems).then(function (result) {
                var questions = {};
                for (var i in result.data) {
                    questions[result.data[i]._id] = result.data[i];
                }
                $scope.questions = questions;
                $scope.nextQuizItem();
            });
        }
    }

    $scope.$watch('step', reload);
    $scope.getQuizItemTemplate = function () {
        if (!!$scope.questions) {
            if (!!$scope.quizItem && !$scope.quizItem.startTime) {
                $scope.quizItem.startTime = new Date().getTime();
            }
            return !!$scope.quizItem && LergoClient.questions.getTypeById($scope.quizItem.type).viewTemplate || '';
        }
        return '';
    };

    $scope.updateProgress = function () {
        $log.info('update progress callback was called');
        $scope.updateProgressPercent();
    };

    $scope.checkAnswer = function () {

        $scope.submitBtnDisable = true;
        var quizItem = $scope.quizItem;

        // we use a flag because no other property is eligible
        // `userAnswer` does not necessarily exist , nor exists only after submission..
        quizItem.submitted = true; // a flag to know if submitted

        var duration = Math.max(0, new Date().getTime() - quizItem.startTime);
        // using max with 0 just in case something went wrong and startTime >
        // endTime.. LERGO-468
        LergoClient.questions.checkAnswer(quizItem).then(function (result) {
            $scope.answers[quizItem._id] = result.data;
            $rootScope.$broadcast('questionAnswered', {
                'userAnswer': quizItem.userAnswer,
                'checkAnswer': result.data,
                'quizItemId': quizItem._id,
                'quizItemType': quizItem.type,
                'duration': duration,
                'isHintUsed': !!quizItem.isHintUsed
            });

            if (!isTestMode() && result.data.correct) {
                voiceFeedback();
            }

            // see lergo-576 and documentation below . this line has to be
            // before we switch to next item
            var isSameType = $scope.quizItem.type === $scope.getNextQuizItemDry().type;

            if ($scope.hasNextQuizItem() && (isTestMode() || result.data.correct) && !$scope.showNextQuestion()) {
                if (isTestMode()) {
                    $scope.nextQuizItem();
                } else {
                    $timeout(function () {
                        $scope.nextQuizItem();
                    }, 1000);
                }

            }

            // guy - we must update progress only after we moved to next quiz
            // item or otherwise animation is broken. see lergo-579.
            // this includes delay of 1 second before auto moving to next
            // question.

            // updating progress is a bit complex due to the following issues:
            // 1) when we switch to "next item", the directive is recompiled and
            // replaced by a new one.
            // ==> but only if question type is different!!!
            // 2) for both quiz types we want an immediate progress update
            // 3) for practice mode we delay moving to the next question ==>
            // which means we want the same directive to animate
            // 4) for test mode we immediately go to another question ==> which
            // means we want a different directive to animate
            // 5) the progress directive uses `watch` which its async nature
            // makes things complex.
            // 6) the last item in the quiz behaves differently than the rest!!
            // we do not automatically move to next item.

            // to overcome these difficulties we do the following
            // for both cases - if the directive gets the same value on change,
            // it sets value without animation.
            // this resolves reanimation from 0.
            // FOR TEST MODE
            // if same type of question.. we update (this resolves section 6.)
            // otherwise for all items except last - we rely on the "ready"
            // callback of the progress bar to modify progress.
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
            if (isTestMode()) {

                if (!$scope.hasNextQuizItem() || isSameType) {
                    $scope.updateProgressPercent();
                }
            } else {
                if (!$scope.step.retryQuestion || result.data.correct || ((isSameType || !$scope.hasNextQuizItem()) && (defaultRetries() > 0 && !$scope.retriesLeft()))) {
                    $scope.updateProgressPercent();
                }
            }
            $scope.submitBtnDisable = false;
        }, function () {
            $log.error('there was an error checking answer');
        });
    };


    $scope.getQuizItem = function () {
        return $scope.quizItem && $scope.quizItem._id;
    };

    /**
     * @description
     * quiz is done only iff all of the following are correct
     * 1. all questions were answered
     * 2. no retry required for last question -- which means last answer was correct or no retry configured
     * guy - the last question is a special scenario since all the others will fall on the first condition.
     * if step is not quiz - then we will return "true" as default.
     *
     * @returns {boolean}
     */
    $scope.isQuizDone = function () {

        if (!StepService.isQuizStep($scope.step)) { // return true if not quiz.
            return true;
        }
        var answer = $scope.getAnswer();
        var allQuestionsWereAnswered = !$scope.hasNextQuizItem() && answer;
        if (isTestMode()) {
            return allQuestionsWereAnswered;
        } else {
            var noRetryOnLast = answer && (answer.correct || !$scope.step.retryQuestion || ( defaultRetries() > 0 && !$scope.retriesLeft()));
            return allQuestionsWereAnswered && noRetryOnLast; // the full condition
        }
    };

    $scope.getAnswer = function () {
        var quizItem = $scope.quizItem;
        return !!quizItem && $scope.answers.hasOwnProperty(quizItem._id) ? $scope.answers[quizItem._id] : null;
    };

    /**
     *
     * @description
     *
     * * do not show explanation if
     *   * user did not answer yet
     *   * user is in test mode
     *   * answer does not have an explanation message
     *
     * * show explanation if
     *   * if chow correct answer is checked
     *   * or no more retries left
     *
     * @returns {boolean}
     */
    $scope.shouldShowExplanationMessage = function () {
        if (isTestMode()) {
            return false;
        } else if (!$scope.getAnswer()) {
            return false;
        } else if (LergoClient.questions.isOpenQuestion($scope.quizItem)) {
            return !!$scope.quizItem.explanation;
        } else if ($scope.quizItem.explanationMedia && !!$scope.quizItem.explanationMedia.type) {
            return false;
        } else if ($scope.getAnswer().expMessage.length <= 0) {
            return false;
        } else {
            return !$scope.getAnswer().correct && ( $scope.canShowCrctAns() || !$scope.retriesLeft());
        }
    };

    /**
     *
     * @description
     *
     * * do not show explanation if
     *   * user did not answer yet
     *   * user is in test mode
     *   * question dows not have an explanation
     *
     * * show explanation if
     *   * question is of type open question
     *   * answer is incorrect
     *
     * @returns {boolean}
     */
    $scope.shouldShowExplanationMedia = function () {
        if (isTestMode()) {
            return false;
        } else if (!$scope.getAnswer()) {
            return false;
        } else if (!$scope.quizItem) {
            return false;
        } else if (!$scope.quizItem.explanationMedia) {
            return false;
        } else if (!$scope.quizItem.explanationMedia.type) {
            return false;
        } else if (LergoClient.questions.isOpenQuestion($scope.quizItem)) {
            return true;
        } else {
            return !$scope.getAnswer().correct && ( $scope.canShowCrctAns() || !$scope.retriesLeft());
        }
    };
    /**
     * @description
     * do not show result
     * 1. in Test Mode
     *
     * Show results if
     * 1. answer is submitted
     *
     * @returns {boolean}
     */
    $scope.shouldShowResult = function () {
        if (isTestMode()) {
            return false;
        } else {
            return !!$scope.getAnswer();
        }
    };

    $scope.nextQuizItem = function () {
        $log.info('next');
        if (!!$scope.quizItem) {
            localStorageService.remove($scope.quizItem._id + '-retries');
        }
        $scope.stepDisplay.showHint = false;

        if (!$scope.questions) {
            return;
        }

        var quizItem = null;
        if (!!$scope.step && !!$scope.step.quizItems) {
            if ($scope.step.quizItems.length > currentIndex()) {
                quizItem = $scope.step.quizItems[currentIndex()];
                $scope.quizItem = $scope.questions[quizItem];
            } else if ($scope.step.quizItems.length === currentIndex()) {
                try {
                    quizItem = $scope.step.quizItems[currentIndex() - 1];
                    $scope.quizItem = $scope.questions[quizItem];
                } catch (e) {
                    $log.error('failed handling scenario where last question was answered', e);
                }
            }
            localStorageService.set($scope.quizItem._id + '-retries', defaultRetries());
        }
    };

    /**
     * @description
     *
     * simply gets the next quiz item. does not change the state of the page
     * @returns {*}
     */
    $scope.getNextQuizItemDry = function () {
        if (!$scope.hasNextQuizItem()) {
            return {
                'type': null
            };
        }

        try {

            // please note - current index represents the next item..
            return $scope.questions[$scope.step.quizItems[currentIndex()]];
        } catch (e) {

        }
        return {
            'type': null
        }; // return something that will not cause NPE
    };

    /**
     * @description
     *
     * should we display "next question" button??
     *
     *  - if test mode, no we don't
     *  - if user can retry, yes we do
     *  - if wrong answer, yes we do
     *  - if open question that has explanation and no next question, yes we do
     *
     * @returns {boolean|step.retryQuestion|*}
     */
    $scope.showNextQuestion = function () {
        if (isTestMode() || !$scope.getAnswer()) {
            return false;
        }
        var isOpenQuestion = LergoClient.questions.isOpenQuestion($scope.quizItem);
        var hasExplanation = LergoClient.questions.hasExplanation($scope.quizItem);
        var hasNextQuizItem = $scope.hasNextQuizItem();
        if (isOpenQuestion && hasExplanation && hasNextQuizItem) {
            return true;
        }
        var repeatQuestion = $scope.step.retryQuestion && (defaultRetries() === 0 || $scope.retriesLeft());
        return (repeatQuestion || hasNextQuizItem) && !$scope.getAnswer().correct;
    };

    $scope.hasNextQuizItem = function () {
        return !!$scope.step && !!$scope.questions && currentIndex() < _.size($scope.questions);
    };

    $scope.getStepViewByType = function (step) {
        var type = 'none';
        if (!!step && !!step.type) {
            type = step.type;
        }
        return 'views/lesson/steps/view/_' + type + '.html';
    };

    $scope.getYoutubeEmbedSource = function (step) { // todo : use service
        var src = '//www.youtube.com/embed/' + $scope.getVideoId(step) + '?autoplay=1&rel=0&iv_load_policy=3';
        return $sce.trustAsResourceUrl(src);
    };

    $scope.getGoogleSlideEmbedSource = function (url) {
        var src = '//docs.google.com/presentation/d/' + getDocumentIdFromURL(url) + '/embed?start=false&loop=false&delayms=3000';
        return $sce.trustAsResourceUrl(src);
    };
    $scope.videoSize = {
        'width': 672,
        'height': 378
    };
    if ($scope.embeddedMode) {
        $scope.videoSize.width = 600;
    }

    $scope.getVideoId = function (step) {
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

    function getDocumentIdFromURL(url) {
        if (!!url) {
            return url.match(/[-\w]{25,}/);
        }
    }

    $scope.getCorrectAnswers = function (quizItem) {
        if (!quizItem || !quizItem.type || !LergoClient.questions.getTypeById(quizItem.type).answers(quizItem)) {
            return '';
        }
        return LergoClient.questions.getTypeById(quizItem.type).answers(quizItem);
    };

    $scope.$watch('step', function (newValue, oldValue) {
        if (newValue !== oldValue) {
            $scope.progressPercentage = 0;
        }
    });

    $scope.updateProgressPercent = function () {
        if (!$scope.step || !$scope.step.quizItems || $scope.step.quizItems.length < 1) {
            $scope.progressPercentage = 0;
        } else {
            // guy - count percentage by counting the answers. not current
            // index.

            $scope.progressPercentage = Math.round((_.size($scope.answers) * 100) / _.size($scope.questions));
        }
    };

    $scope.enterPressed = function (quizItem) {
        if (!$scope.getAnswer(quizItem) && $scope.canSubmit(quizItem)) {
            $scope.checkAnswer();
        } else if ($scope.getAnswer(quizItem) && !$scope.isQuizDone()) {
            $scope.retryOrNext();
        }
    };


    /**
     * @description
     *
     * autofocus not working properly in control of partial view when added
     * through ngInclude this is a hook to get the desired behaviour
     * @param id Id of an element
     */
    $scope.setFocus = function (id) {
        document.getElementById(id).focus();
    };

    $scope.canSubmit = function (quizItem) {
        if (!quizItem && !quizItem.type) {
            return false;
        }
        return LergoClient.questions.getTypeById(quizItem.type).canSubmit(quizItem);
    };

    $scope.getFillIntheBlankSize = function (quizItem, index) {
        if (!quizItem.blanks || !quizItem.blanks.type || quizItem.blanks.type === 'auto') {
            if (!!quizItem.answer[index]) {
                var answer = quizItem.answer[index].split(';');
                var maxLength = 0;
                for (var i = 0; i < answer.length; i++) {
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
    $scope.hintUsed = function (quizItem) {
        $timeout(function() {
            if ($scope.stepDisplay.showHint) {
                quizItem.isHintUsed = true;
            }
        });
    };

    function isTestMode() {
        return StepService.isTestMode($scope.step);
    }

    function voiceFeedback() {
        audio.play();
    }

    $scope.isCorrectFillInTheBlanks = function (quizItem, index) {

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

    $scope.isMultiChoiceMultiAnswer = function (quizItem) {
        var correctAnswers = _.filter(quizItem.options, 'checked');
        return correctAnswers.length > 1;
    };

    function shouldRetry(step) {
        if ($scope.canShowCrctAns()) {
            return step.retryQuestion;
        }
        else {
            return step.retryQuestion && localStorageService.get($scope.quizItem._id + '-retries') > 0;
        }
    }

    /**
     * reach here when you click next after got question wrong
     * if step defined with "allow retry" - we will try again, otherwise we move
     * to next item.
     */
    $scope.retryOrNext = function () {
        if (shouldRetry($scope.step) && !LergoClient.questions.isOpenQuestion($scope.quizItem)) {
            $scope.tryAgain();
        } else {
            $scope.nextQuizItem();
        }
    };

    $scope.retriesLeft = function () {
        if (!$scope.quizItem) {
            return false;
        }
        return localStorageService.get($scope.quizItem._id + '-retries') > 0;
    };

    $scope.tryAgain = function () {
        $log.info('trying again');
        var quizItem = $scope.quizItem;
        var retriesLeft = localStorageService.get(quizItem._id + '-retries');
        localStorageService.set(quizItem._id + '-retries', retriesLeft - 1);

        if (!!quizItem.options) {
            quizItem.options.isShuffled = false;
            _.each(quizItem.options, function (option) {
                option.userAnswer = false;
            });
        }
        delete $scope.answers[quizItem._id];
        quizItem.startTime = new Date().getTime();
        $scope.updateProgressPercent();
        quizItem.userAnswer = null;
        quizItem.submitted = false;
    };
    /**
     * @description
     *
     * Whether a quiz step
     * @returns {boolean}
     */
    $scope.isQuizStep = function () {
        return StepService.isQuizStep($scope.step);
    };

    $scope.canShowCrctAns = function () {
        return !$scope.step.retryQuestion || !defaultRetries();
    };

    function defaultRetries() {
        if (!$scope.step.retBefCrctAns) {
            return 0;
        } else {
            return $scope.step.retBefCrctAns - 1;
        }
    }
};
angular.module('lergoApp').controller('LessonsStepDisplayCtrl', ['$scope', '$rootScope', 'StepService', '$log', '$routeParams', '$timeout', '$sce',
    'LergoClient', 'shuffleFilter', 'localStorageService', '$window', LessonsStepDisplayCtrl]);
