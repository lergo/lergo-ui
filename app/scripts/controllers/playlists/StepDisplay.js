'use strict';

var PlaylistsStepDisplayCtrl = function ($scope, $rootScope, StepService, $log, $routeParams, $timeout, $sce,
                                       LergoClient, shuffleFilter, localStorageService, $window) {
    $log.info('showing step');

    // used to fix bug where hint stays open when switching between lessons.
    $scope.stepDisplay = {showHint: false};

    $window.scrollTo(0, 0);
    var audio = new Audio('../audio/correctanswer.mp3');

    $scope.scrollUp = function () {
        $window.scrollTo(0, 0);
    };

    if (!!$routeParams.data) {
        $scope.step = JSON.parse($routeParams.data);
        shuffleFilter($scope.step.lessonItems, !$scope.step.shuffleLesson);
    }

    function currentIndex() {
        return _.size($scope.answers);
    }


    if (!$scope.answers) { // parent scope might declare answers
        $scope.answers = {};
    }


    function reload() {
        $log.info('reload display for step');
        window.scrollTo(0,0);
        // guy - when we watch an invitation, we get all the lessons for all
        // steps pre-resolved.
        // however, when we preview a playlist, this controller/scope are
        // responsible for resolving the lessons
        // and they resolve it for each step anew.
        // so we have 2 different algorithms for resolving lessons for quiz.
        // in order to align them, we need to nullify the "lessons" on the
        // scope but only (!!) if this
        // controller and scope are responsible for resolving them.
        if (!!$scope.lessons && $scope.hasOwnProperty('lessons')) { // if
            // this scope takes care
            $scope.lessons = null;
        }

        if (!$scope.step) {
            return;
        }


        // lets initialize the answers on load
        // if the user already done part of the quiz, we skip lessons he already answered..
        if ($scope.$parent && !$scope.$parent.answers) {
            $scope.answers = {};
        } else {
            $scope.answers = $scope.$parent.answers;
        }

        // guy - do not use 'hasOwnProperty' as scope might not have the
        // property, but there is such a value.
        if (!!$scope.step && !!$scope.step.lessonItems && !$scope.lessons) {
            LergoClient.lessons.findLessonsById($scope.step.lessonItems).then(function (result) {
                var lessons = {};
                for (var i in result.data) {
                    lessons[result.data[i]._id] = result.data[i];
                }
                $scope.lessons = lessons;
                $scope.nextLessonItem();
            });
        }
    }

    $scope.$watch('step', reload);
    $scope.getLessonItemTemplate = function () {
        if (!!$scope.lessons) {
            if (!!$scope.lessonItem && !$scope.lessonItem.startTime) {
                $scope.lessonItem.startTime = new Date().getTime();
            }
            return !!$scope.lessonItem && 'views/lessons/view/_exactMatch.html';
        }
        return '';
    };

    $scope.updateProgress = function () {
        $log.info('update progress callback was called');
        $scope.updateProgressPercent();
    };

    $scope.checkAnswer = function () {

        $scope.submitBtnDisable = true;
        var lessonItem = $scope.lessonItem;

        // we use a flag because no other property is eligible
        // `userAnswer` does not necessarily exist , nor exists only after submission..
        lessonItem.submitted = true; // a flag to know if submitted

        var duration = Math.max(0, new Date().getTime() - lessonItem.startTime);
        // using max with 0 just in case something went wrong and startTime >
        // endTime.. LERGO-468
        LergoClient.lessons.checkAnswer(lessonItem).then(function (result) {
            $scope.answers[lessonItem._id] = result.data;
            $rootScope.$broadcast('lessonAnswered', {
                'userAnswer': lessonItem.userAnswer,
                'checkAnswer': result.data,
                'lessonItemId': lessonItem._id,
                'lessonItemType': lessonItem.type,
                'duration': duration,
                'isHintUsed': !!lessonItem.isHintUsed
            });

            if (!isTestMode() && result.data.correct) {
                voiceFeedback();
            }

            // see lergo-576 and documentation below . this line has to be
            // before we switch to next item
            var isSameType = $scope.lessonItem.type === $scope.getNextLessonItemDry().type;

            if ($scope.hasNextLessonItem() && (isTestMode() || result.data.correct) && !$scope.showNextLesson()) {
                if (isTestMode()) {
                    $scope.nextLessonItem();
                } else {
                    $timeout(function () {
                        $scope.nextLessonItem();
                    }, 1000);
                }

            }

            // guy - we must update progress only after we moved to next quiz
            // item or otherwise animation is broken. see lergo-579.
            // this includes delay of 1 second before auto moving to next
            // lesson.

            // updating progress is a bit complex due to the following issues:
            // 1) when we switch to "next item", the directive is recompiled and
            // replaced by a new one.
            // ==> but only if lesson type is different!!!
            // 2) for both quiz types we want an immediate progress update
            // 3) for practice mode we delay moving to the next lesson ==>
            // which means we want the same directive to animate
            // 4) for test mode we immediately go to another lesson ==> which
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
            // if same type of lesson.. we update (this resolves section 6.)
            // otherwise for all items except last - we rely on the "ready"
            // callback of the progress bar to modify progress.
            // for the last item we immediately modify the progress.
            // FOR QUIZ MODE
            // we immediately modify progress in all scenarios.

            // so to summarize
            // we should update progress in the following 3 possible situations:
            // - we are not in practice mode and we are in the last lesson.
            // - we are in practice mode and lesson was correct
            // - we are in practice mode without retry
            // lergo-579 - progress animation is broken

            // to make it easier for reading we broke it down to cases
            if (isTestMode()) {

                if (!$scope.hasNextLessonItem() || isSameType) {
                    $scope.updateProgressPercent();
                }
            } else {
                if (!$scope.step.retryLesson || result.data.correct || ((isSameType || !$scope.hasNextLessonItem()) && (defaultRetries() > 0 && !$scope.retriesLeft()))) {
                    $scope.updateProgressPercent();
                }
            }
            $scope.submitBtnDisable = false;
        }, function () {
            $log.error('there was an error checking answer');
        });
    };


    $scope.getLessonItem = function () {
        return $scope.lessonItem && $scope.lessonItem._id;
    };

    /**
     * @description
     * quiz is done only iff all of the following are correct
     * 1. all lessons were answered
     * 2. no retry required for last lesson -- which means last answer was correct or no retry configured
     * guy - the last lesson is a special scenario since all the others will fall on the first condition.
     * if step is not quiz - then we will return "true" as default.
     *
     * @returns {boolean}
     */
    $scope.isLessonDone = function () {

        if (!StepService.isLessonStep($scope.step)) { // return true if not quiz.
            return true;
        }
        var answer = $scope.getAnswer();
        var allLessonsWereAnswered = !$scope.hasNextLessonItem() && answer;
        if (isTestMode()) {
            return allLessonsWereAnswered;
        } else {
            var noRetryOnLast = answer && (answer.correct || !$scope.step.retryLesson || ( defaultRetries() > 0 && !$scope.retriesLeft()));
            return allLessonsWereAnswered && noRetryOnLast; // the full condition
        }
    };

    $scope.getAnswer = function () {
        var lessonItem = $scope.lessonItem;
        return !!lessonItem && $scope.answers.hasOwnProperty(lessonItem._id) ? $scope.answers[lessonItem._id] : null;
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
        } else if (LergoClient.lessons.isOpenLesson($scope.lessonItem)) {
            return !!$scope.lessonItem.explanation;
        } else if ($scope.lessonItem.explanationMedia && !!$scope.lessonItem.explanationMedia.type) {
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
     *   * lesson dows not have an explanation
     *
     * * show explanation if
     *   * lesson is of type open lesson
     *   * answer is incorrect
     *
     * @returns {boolean}
     */
    $scope.shouldShowExplanationMedia = function () {
        if (isTestMode()) {
            return false;
        } else if (!$scope.getAnswer()) {
            return false;
        } else if (!$scope.lessonItem) {
            return false;
        } else if (!$scope.lessonItem.explanationMedia) {
            return false;
        } else if (!$scope.lessonItem.explanationMedia.type) {
            return false;
        } else if (LergoClient.lessons.isOpenLesson($scope.lessonItem)) {
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

    $scope.nextLessonItem = function () {
        window.scrollTo(0,68);
        $log.info('next');
        if (!!$scope.lessonItem) {
            localStorageService.remove($scope.lessonItem._id + '-retries');
        }
        $scope.stepDisplay.showHint = false;

        if (!$scope.lessons) {
            return;
        }

        var lessonItem = null;
        if (!!$scope.step && !!$scope.step.lessonItems) {
            if ($scope.step.lessonItems.length > currentIndex()) {
                lessonItem = $scope.step.lessonItems[currentIndex()];
                $scope.lessonItem = $scope.lessons[lessonItem];
            } else if ($scope.step.lessonItems.length === currentIndex()) {
                try {
                    lessonItem = $scope.step.lessonItems[currentIndex() - 1];
                    $scope.lessonItem = $scope.lessons[lessonItem];
                } catch (e) {
                    $log.error('failed handling scenario where last lesson was answered', e);
                }
            }
            localStorageService.set($scope.lessonItem._id + '-retries', defaultRetries());
        }
    };

    /**
     * @description
     *
     * simply gets the next quiz item. does not change the state of the page
     * @returns {*}
     */
    $scope.getNextLessonItemDry = function () {
        if (!$scope.hasNextLessonItem()) {
            return {
                'type': null
            };
        }

        try {

            // please note - current index represents the next item..
            return $scope.lessons[$scope.step.lessonItems[currentIndex()]];
        } catch (e) {

        }
        return {
            'type': null
        }; // return something that will not cause NPE
    };

    /**
     * @description
     *
     * should we display "next lesson" button??
     *
     *  - if test mode, no we don't
     *  - if user can retry, yes we do
     *  - if wrong answer, yes we do
     *  - if open lesson that has explanation and no next lesson, yes we do
     *
     * @returns {boolean|step.retryLesson|*}
     */
    $scope.showNextLesson = function () {
        if (isTestMode() || !$scope.getAnswer()) {
            return false;
        }
        var isOpenLesson = LergoClient.lessons.isOpenLesson($scope.lessonItem);
        var hasExplanation = LergoClient.lessons.hasExplanation($scope.lessonItem);
        var hasNextLessonItem = $scope.hasNextLessonItem();
        if (isOpenLesson && hasExplanation && hasNextLessonItem) {
            return true;
        }
        var repeatLesson = $scope.step.retryLesson && (defaultRetries() === 0 || $scope.retriesLeft());
        return (repeatLesson || hasNextLessonItem) && !$scope.getAnswer().correct;
    };

    $scope.hasNextLessonItem = function () {
        return !!$scope.step && !!$scope.lessons && currentIndex() < _.size($scope.lessons);
    };

    $scope.getStepViewByType = function (step) {
        var type = 'none';
        if (!!step && !!step.type) {
            type = step.type;
        }
        return 'views/playlist/steps/view/_' + type + '.html';
    };

    $scope.getYoutubeEmbedSource = function (step) { // todo : use service
        var src = '//www.youtube.com/embed/' + $scope.getVideoId(step) + '?autoplay=1&rel=0&iv_load_policy=3';
        return $sce.trustAsResourceUrl(src);
    };
    $scope.getYoutubeEmbedSourceNoAutoPlay = function (step) { // todo : use service
        var src = '//www.youtube.com/embed/' + $scope.getVideoId(step) + '?rel=0&iv_load_policy=3';
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

    $scope.getCorrectAnswers = function (lessonItem) {
        if (!lessonItem || !lessonItem.type || !LergoClient.lessons.getTypeById(lessonItem.type).answers(lessonItem)) {
            return '';
        }
        return LergoClient.lessons.getTypeById(lessonItem.type).answers(lessonItem);
    };

    $scope.$watch('step', function (newValue, oldValue) {
        if (newValue !== oldValue) {
            $scope.progressPercentage = 0;
        }
    });

    $scope.updateProgressPercent = function () {
        if (!$scope.step || !$scope.step.lessonItems || $scope.step.lessonItems.length < 1) {
            $scope.progressPercentage = 0;
        } else {
            // guy - count percentage by counting the answers. not current
            // index.

            $scope.progressPercentage = Math.round((_.size($scope.answers) * 100) / _.size($scope.lessons));
        }
    };

    $scope.enterPressed = function (lessonItem) {
        if (!$scope.getAnswer(lessonItem) && $scope.canSubmit(lessonItem)) {
            $scope.checkAnswer();
        } else if ($scope.getAnswer(lessonItem) && !$scope.isLessonDone()) {
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

    $scope.canSubmit = function (lessonItem) {
        if (!lessonItem && !lessonItem.type) {
            return false;
        }
        return LergoClient.lessons.getTypeById(lessonItem.type).canSubmit(lessonItem);
    };

    $scope.getFillIntheBlankSize = function (lessonItem, index) {
        if (!lessonItem.blanks || !lessonItem.blanks.type || lessonItem.blanks.type === 'auto') {
            if (!!lessonItem.answer[index]) {
                var answer = lessonItem.answer[index].split(';');
                var maxLength = 0;
                for (var i = 0; i < answer.length; i++) {
                    if (answer[i].length > maxLength) {
                        maxLength = answer[i].length;
                    }
                }
                return maxLength * 10 + 20;
            }
        } else if (lessonItem.blanks.type === 'custom') {
            lessonItem.blanks.size = !!lessonItem.blanks.size ? lessonItem.blanks.size : 4;
            return lessonItem.blanks.size * 10 + 20;
        }
    };
    $scope.hintUsed = function (lessonItem) {
        $timeout(function() {
            if ($scope.stepDisplay.showHint) {
                lessonItem.isHintUsed = true;
            }
        });
    };

    function isTestMode() {
        return StepService.isTestMode($scope.step);
    }

    function voiceFeedback() {
        audio.play();
    }

    $scope.isCorrectFillInTheBlanks = function (lessonItem, index) {

        var userAnswer = lessonItem.userAnswer[index];
        if (!userAnswer) {
            return false;
        }
        if (lessonItem.answer[index].split(';').indexOf(userAnswer) === -1) {
            return false;
        } else {
            return true;
        }
    };

    $scope.isMultiChoiceMultiAnswer = function (lessonItem) {
        var correctAnswers = _.filter(lessonItem.options, 'checked');
        return correctAnswers.length > 1;
    };

    function shouldRetry(step) {
        if ($scope.canShowCrctAns()) {
            return step.retryLesson;
        }
        else {
            return step.retryLesson && localStorageService.get($scope.lessonItem._id + '-retries') > 0;
        }
    }

    /**
     * reach here when you click next after got lesson wrong
     * if step defined with "allow retry" - we will try again, otherwise we move
     * to next item.
     */
    $scope.retryOrNext = function () {
        if (shouldRetry($scope.step) && !LergoClient.lessons.isOpenLesson($scope.lessonItem)) {
            $scope.tryAgain();
        } else {
            $scope.nextLessonItem();
        }
    };

    $scope.retriesLeft = function () {
        if (!$scope.lessonItem) {
            return false;
        }
        return localStorageService.get($scope.lessonItem._id + '-retries') > 0;
    };

    $scope.tryAgain = function () {
        window.scrollTo(0,68);
        $log.info('trying again');
        var lessonItem = $scope.lessonItem;
        var retriesLeft = localStorageService.get(lessonItem._id + '-retries');
        localStorageService.set(lessonItem._id + '-retries', retriesLeft - 1);

        if (!!lessonItem.options) {
            lessonItem.options.isShuffled = false;
            _.each(lessonItem.options, function (option) {
                option.userAnswer = false;
            });
        }
        delete $scope.answers[lessonItem._id];
        lessonItem.startTime = new Date().getTime();
        $scope.updateProgressPercent();
        lessonItem.userAnswer = null;
        lessonItem.submitted = false;
    };
    /**
     * @description
     *
     * Whether a quiz step
     * @returns {boolean}
     */
    $scope.isLessonStep = function () {
        return StepService.isLessonStep($scope.step);
    };

    $scope.canShowCrctAns = function () {
        return !$scope.step.retryLesson || !defaultRetries();
    };

    function defaultRetries() {
        if (!$scope.step.retBefCrctAns) {
            return 0;
        } else {
            return $scope.step.retBefCrctAns - 1;
        }
    }
};
angular.module('lergoApp').controller('PlaylistsStepDisplayCtrl', ['$scope', '$rootScope', 'StepService', '$log', '$routeParams', '$timeout', '$sce',
    'LergoClient', 'shuffleFilter', 'localStorageService', '$window', PlaylistsStepDisplayCtrl]);
