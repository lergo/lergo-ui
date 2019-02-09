'use strict';

angular.module('lergoApp').controller('QuestionsReadCtrl',
    function ($scope, QuestionsService, $routeParams, ContinuousSave, $log, $compile, LergoClient, $sce, $location, $window, LergoTranslate) {

        var questionId = $routeParams.questionId;
        $scope.noop = angular.noop;
        var audio = new Audio('../audio/correctanswer.mp3');
        $window.scrollTo(0, 0);

        QuestionsService.getQuestionById(questionId).then(function (result) {
            $scope.quizItem = result.data;
            LergoTranslate.setLanguageByName($scope.quizItem.language);
            $scope.errorMessage = null;

            LergoClient.questions.getPermissions($scope.quizItem._id).then(function (result) {
                $scope.permissions = result.data;
            });

            // todo: this looks a copy paste from Intro.js.. need to
            // refactor!
            if (!!$scope.quizItem.copyOf) {
                QuestionsService.findQuestionsById($scope.quizItem.copyOf).then(function (result) {
                    var originalQuestions = result.data;
                    var usersWeCopiedFrom = _.uniq(_.compact(_.map(originalQuestions, 'userId')));

                    // get all users we copied from..
                    LergoClient.users.findUsersById(usersWeCopiedFrom).then(function (result) {
                        var copyOfUsers = result.data;
                        // turn list of users to map where id is map
                        var copyOfUsersById = _.keyBy(copyOfUsers, '_id');

                        _.each(originalQuestions, function (q) {
                            q.user = copyOfUsersById[q.userId];
                        });

                        $scope.originalQuestions = originalQuestions;
                    });
                });
            }
            LergoClient.users.findUsersById($scope.quizItem.userId).then(function (result) {
                $scope.quizItem.user = result.data[0];
            });

            LergoClient.lessons.getLessonsWhoUseThisQuestion($scope.quizItem._id).then(function (result) {
                $scope.lessons = result.data;

                $scope.usedInLessons = [];
                angular.forEach($scope.lessons, function (lesson) {
                    if (!!lesson.public) {
                        $scope.usedInLessons.push(lesson);
                    }
                });
            });

        }, function (result) {
            $scope.error = result.data;
            $scope.errorMessage = 'Error in fetching questions by id : ' + result.data.message;
            $log.error($scope.errorMessage);
        });

        $scope.getQuestionViewTemplate = function () {
            if (!!$scope.quizItem && !!$scope.quizItem.type) {
                var type = QuestionsService.getTypeById($scope.quizItem.type);
                return type.previewTemplate;
            }
            return '';
        };
        $scope.checkAnswer = function () {
            var quizItem = $scope.quizItem;
            LergoClient.questions.checkAnswer(quizItem).then(function (result) {
                $scope.answer = result.data;
                if ($scope.answer.correct) {
                    voiceFeedback();
                }
            }, function () {
                $log.error('there was an error checking answer');
            });

        };

        $scope.getCorrectAnswers = function (quizItem) {
            if (!quizItem || !quizItem.type || !QuestionsService.getTypeById(quizItem.type).answers(quizItem)) {
                return '';
            }
            return QuestionsService.getTypeById(quizItem.type).answers(quizItem);
        };
        $scope.copyQuestion = function (question) {
            LergoClient.questions.copyQuestion(question._id).then(function (result) {
                $location.path('/user/questions/' + result.data._id + '/update');
            }, function (result) {
                $log.error(result);
            });
        };

        $scope.getAnswer = function () {
            return $scope.answer;
        };

        $scope.canSubmit = function (quizItem) {
            if (!quizItem && !quizItem.type) {
                return false;
            }
            return QuestionsService.getTypeById(quizItem.type).canSubmit(quizItem);
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

        $scope.enterPressed = function (quizItem) {
            if (!$scope.getAnswer(quizItem) && $scope.canSubmit(quizItem)) {
                $scope.checkAnswer();
            }
        };

        function voiceFeedback() {
            audio.play();
        }

        var questionLikeWatch = null;
        $scope.$watch('quizItem', function (newValue) {
            if (!!newValue) {
                // get my like - will decide if I like this question or not
                LergoClient.likes.getMyQuestionLike($scope.quizItem).then(function (result) {
                    $scope.questionLike = result.data;
                });

                if (questionLikeWatch === null) {
                    questionLikeWatch = $scope.$watch('questionLike', function () {
                        // get count of likes for lesson
                        LergoClient.likes.countQuestionLikes($scope.quizItem).then(function (result) {
                            $scope.questionLikes = result.data.count;
                        });
                    });
                }
            }
        });
        $scope.like = function () {
            LergoClient.likes.likeQuestion($scope.quizItem).then(function (result) {
                $scope.questionLike = result.data;
            });
        };

        $scope.unlike = function () {
            LergoClient.likes.deleteQuestionLike($scope.quizItem).then(function () {
                $scope.questionLike = null;
            });
        };

        $scope.isLiked = function () {
            return !!$scope.questionLike;
        };

        $scope.absoluteShareLink = function (question) {
            $scope.shareLink = LergoClient.questions.getShareLink(question);
            $scope.share = !$scope.share;
        };

        $scope.isCorrectFillInTheBlanks = function (quizItem, index) {
            var userAnswer = quizItem.userAnswer[index];
            return !!userAnswer && quizItem.answer[index].split(';').indexOf(userAnswer) >= 0;
        };

        $scope.isMultiChoiceMultiAnswer = function (quizItem) {
            var correctAnswers = _.filter(quizItem.options, 'checked');
            return correctAnswers.length > 1;
        };

        /**
         *
         * @description
         *
         * * do not show explanation if
         *   * user did not answer yet
         *   * question does not have an explanation
         *
         * * show explanation if
         *   * question is of type open question
         *   * answer is incorrect
         *
         * @returns {boolean}
         */
        $scope.shouldShowExplanationMedia = function () {
            var quiz = $scope.quizItem;
            if (!quiz || !quiz.explanationMedia || !quiz.explanationMedia.type || !$scope.getAnswer()) {
                return false;
            }
            if (!$scope.getAnswer().correct || $scope.quizItem.type === 'openQuestion') {
                return true;
            }
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
            if (!$scope.getAnswer()) {
                return false;
            } else if (LergoClient.questions.isOpenQuestion($scope.quizItem)) {
                return !!$scope.quizItem.explanation;
            } else if ($scope.getAnswer().expMessage.length <= 0) {
                return false;
            } else if ($scope.quizItem.explanationMedia && !!$scope.quizItem.explanationMedia.type) {
                return false;
            } else {
                return !$scope.getAnswer().correct;
            }
        };

    });
