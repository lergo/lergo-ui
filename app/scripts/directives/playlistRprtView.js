'use strict';

// guy - todo - change this file name or directive name.
// I think the directive should be playlistRprtView and not =4 stView.
// consider using a template named playlistRprtView.html as well.
angular.module('lergoApp').directive('playlistRprtView', function ($log, LergoClient) {
    return {
        templateUrl: 'views/playlists/invitations/playlistRprt/_display.html',
        restrict: 'A',
        scope: {
            'playlist': '=',
            'answers': '=',
            'quizItems': '='
        },
        link: function ($scope/* , element, attrs */) {
            window.scrollTo(0,0);
            $log.info('showing playlist playlistRprt');

            function getAnswer(quizItemId, index) {
                for (var i = 0; i < $scope.answers.length; i++) {
                    var answer = $scope.answers[i];
                    if ((answer.quizItemId === quizItemId) && (answer.stepIndex === index)) {
                        return answer;
                    }
                }
                return null;
            }

            function getQuizItem(quizItemId) {
                for (var i = 0; i < $scope.quizItems.length; i++) {
                    if ($scope.quizItems[i]._id === quizItemId) {
                        return $scope.quizItems[i];
                    }
                }
                return null;
            }

            $scope.getQuizItemTemplate = function (type) {
                return LergoClient.questions.getTypeById(type).playlistRprtTemplate;
            };
            // This will test in case of multi choice multi answer that which
            // all answers are correct
            $scope.isCorrectAnswer = function (quizItem, answer) {

                for (var i = 0; i < quizItem.options.length; i++) {
                    if (quizItem.options[i].label === answer) {
                        if (quizItem.options[i].checked === true) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                }
                return false;
            };

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

            // /////////////// construct a single object with question, user
            // answer and answer check

            var playlistRprtQuizItems = {}; // cache

            $scope.getPlaylistRprtQuizItems = function (step, index) {

                if (playlistRprtQuizItems.hasOwnProperty('' + index)) {
                    return playlistRprtQuizItems['' + index];
                }

                var results = [];

                var quizItemsIds = $scope.playlist.steps[index].quizItems;

                $log.info('getting playlistRprt quiz Items');

                _.each(quizItemsIds, function (qiId) {
                    var answer = getAnswer(qiId, index);
                    var qi = getQuizItem(qiId);
                    if (!!answer && !!qi) {
                        results.push(_.merge({}, qi, answer));
                        // add all retries as well..
                        _.each(answer.retries, function (retry) {
                            results.push(_.merge({}, qi, retry));
                        });
                    }
                });

                $log.info('quizItems');
                playlistRprtQuizItems['' + index] = results;
                $scope.getAnswerStats(results, index);
                return results;
            };

            $scope.getAnswerStats = function (quizItems, index) {
                if (!quizItems || quizItems.length < 1) {
                    return;
                }
                var duration = 0;

                var uniqueQuestions = {};
                var stats = {
                    'correct': 0,
                    'wrong': 0,
                    'correctPercentage': 0,
                    'wrongPercentage': 0,
                    'openQuestions': 0
                };
                _.each(quizItems, function (qItem) {
                    if (qItem.type === 'openQuestion') {
                        stats.openQuestions += 1;
                    } else if (!!qItem.checkAnswer) {


                        if (!!qItem.checkAnswer.correct) {
                            stats.correct++;
                        } else {
                            stats.wrong++;
                        }

                        if (uniqueQuestions[qItem._id] === undefined) {
                            uniqueQuestions[qItem._id] = qItem.checkAnswer.correct;
                        }
                        else {
                            uniqueQuestions[qItem._id] = qItem.checkAnswer.correct && uniqueQuestions[qItem._id];
                        }
                    }
                    if (!!qItem.duration) {
                        duration = duration + qItem.duration;
                    }
                });

                //unique correct questions
                var ucq = 0;
                //unique wrong questions
                var uwq = 0;
                _.each(_.values(uniqueQuestions), function (ans) {
                    if (!!ans) {
                        ucq++;
                    } else {
                        uwq++;
                    }
                });
                var correctPercentage = ((stats.correct * 100) / (quizItems.length - stats.openQuestions));
                stats.correctPercentage = Math.round(correctPercentage);

                var wrongPercentage = ((stats.wrong * 100) / (quizItems.length - stats.openQuestions));
                stats.wrongPercentage = Math.round(wrongPercentage);
                stats.index = index;
                stats.duration = duration;
                stats.ucq = ucq;
                stats.uwq = uwq;
                $scope.$emit('stats', stats);
            };

            $scope.getStepViewByType = function (step) {
                return '/views/playlists/invitations/playlistRprt/steps/_' + step.type + '.html';
            };
        }
    };
});
