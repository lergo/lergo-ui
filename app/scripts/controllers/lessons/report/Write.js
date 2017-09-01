'use strict';

/**
 *
 * This controller write the events from a lesson a report model
 *
 * Usage example: // example - lets say we have viewing a lesson $scope.data =
 * lesson; // lets add a report to the lesson lesson.report = {}; // lets put
 * the report on the scope $scope.report = lesson.report; // call the report
 * controller - the controller will look for "report" on the scope
 * $controller('LessonsReportWriteCtrl', {$scope: $scope}); // listen to writing
 * on the report and do something with it $scope.$watch('report', function(){
 *
 * do something when the repost changes
 *
 * });
 *
 *
 *
 *
 *
 * The proper structure for a report is the same as a constructed invitation but
 * with more data on it - it holds the real quiz item instead of an ID - it
 * holds the user's answer for each quiz item - it holds the "checkAnswer"
 * response for each answer
 *
 */

var LessonsReportWriteCtrl = function ($scope, ReportWriteService, ReportsService, $log, LergoClient, $q) {

    var report = $scope.report;
    if (!report.answers) {
        report.answers = [];
    }
    if (!report.stepDurations) {
        report.stepDurations = [];
    }
    var stepIndex = 0;

    $scope.$on('startLesson', function (event, data) {
        $log.info('starting lesson');
        _.merge(report.data, data); // since we compacted data on report, report it initialized with partial data
    });

    $scope.$on('endLesson', function (/* event, data */) {
        $log.info('lesson ended');
        // mark invitation as finished
        if (!report.data.finished) {
            report.data.finished = true;
        }
        // mark report as finished
        if (!report.finished) {
            report.finished = true;
        }
        if (!!report.data.lesson.temporary) {
            LergoClient.lessons.delete(report.data.lesson._id);
        }
    });

    // data is step

    // guy - deprecated, use stepIndexChange instead.
    // $scope.$on('nextStepClick', function(event, data) {
    // $log.info('nextStepClicked', event, data);
    // stepIndex++;
    // });

    $scope.$on('stepIndexChange', function (event, data) {
        $log.info('stepIndexChange', data);
        /* jshint -W052 */
        stepIndex = ~~data.new;
        // update new duration only if we are still looking at steps inside the
        // lesson.
        if (stepIndex <= report.data.lesson.steps.length) {
            var newDuration = report.stepDurations[stepIndex];

            if (!newDuration) {
                newDuration = {
                    startTime: new Date().getTime()
                };
                var step = report.data.lesson.steps[stepIndex];
                if (!!step) {
                    newDuration.testMode = step.testMode;
                    newDuration.retryQuestion = step.retryQuestion;
                    newDuration.retBefCrctAns = step.retBefCrctAns;
                }
                report.stepDurations.push(newDuration);
            }
        }


        if (~~data.old !== ~~data.new) {
            ReportWriteService.calculateOldStepDuration(report, data); // updates report model
        }
        report.duration = ReportWriteService.calculateReportDuration(report); // does not update report model
    });


    // the idea is we always keep data without changing it.
    // when the report is done, lesson should look like lesson,
    // quizItems should be ids,
    // questions should be the object for the quiz items..
    // just like in DB...
    // the report only adds the answers the user game and whether they are right
    // or not.
    // in order to track down each answer and its correlating step

    $scope.$on('questionAnswered', function (event, data) {
        $log.info('question was answered', data);

        // find answer
        // in case user answered a question, and then changed the answer, we
        // will need to find the answer again
        var answer = ReportsService.getAnswerToQuizItem(report, data.quizItemId, stepIndex);

        if (!answer) { // add if not exists
            answer = {};
            report.answers.push(answer);

            // update the answer
            _.merge(answer, {
                'stepIndex': stepIndex,
                'quizItemId': data.quizItemId,
                'quizItemType': data.quizItemType,
                'userAnswer': data.userAnswer,
                'checkAnswer': data.checkAnswer,
                'isHintUsed': data.isHintUsed,
                'duration': data.duration
            });
        } else { // assuming retry
            if (!answer.retries) {
                answer.retries = [];
            }
            answer.retries.push(data);
        }

        calculateCorrectPercentage(report);

    });

    $log.info('report writer initialized');

    function calculateCorrectPercentage(report) {
        report.correctPercentage = 0;
        var numberOfQuestions = 0;
        var promises = [];
        angular.forEach(report.data.lesson.steps, function (step) {
            if (step.type === 'quiz' && !!step.quizItems) {
                angular.forEach(step.quizItems, function (q) {
                    var d = $q.defer();
                    var questionPromise = LergoClient.questions.getQuestionById(q);
                    questionPromise.then(function (question) {
                        if (question.type !== 'openQuestion') {
                            numberOfQuestions++;
                        }
                        d.resolve();
                    });
                    promises.push(d.promise);
                });
            }
        });

        $q.all(promises).then(function () {
            if (!!report.data.quizItems && numberOfQuestions > 0) {
                var correctAnswers = _.filter(report.answers, function (answer) {
                    return answer.quizItemType !== 'openQuestion' && answer.checkAnswer.correct === true;
                });
                report.correctPercentage = Math.round((correctAnswers.length * 100) / numberOfQuestions);
            }

            $log.info('new correct percentage is : ', report.correctPercentage);

        });
    }
};

angular.module('lergoApp').controller('LessonsReportWriteCtrl', ['$scope', 'ReportWriteService', 'ReportsService',
    '$log', 'LergoClient', '$q', LessonsReportWriteCtrl]);
