(function () {
    'use strict';

    angular.module('lergoApp')
        .service('ReportWriteService', function ReportWriteService( $log ) {
            /* jshint -W052 */

            this.calculateOldStepDuration = function (report, data) {
                // calculate old step only if we are in new step (which cannot be old) and old step is defined..
                // first step is the end case we are testing here - if we are in the first step, we might get old == 0 or undefined.
                if (data.old !== data.new && data.old !== undefined && data.old !== null && !isNaN(parseInt(data.old, 10))) {
                    var finishedStepIndex = ~~data.old;
                    var oldStep = report.data.lesson.steps[finishedStepIndex];
                    var oldDuration = report.stepDurations[finishedStepIndex];
                    if (!!oldStep && oldStep.type === 'quiz' && !!oldDuration) {

                        // LERGO-457 - quiz step duration should be the sum of durations per answer.
                        $log.info('calculating duration for quiz');

                        var answers = _.filter(report.answers, {'stepIndex': finishedStepIndex});
                        // calculate end time by counting the duration on each answer..
                        var quizDuration = _.reduce(answers, function (num, obj/*, index, list*/) {
                            return num + obj.duration + _.reduce(obj.retries, function(num,retry){ // support retries for question
                                return num+retry.duration;
                            },0);
                        }, 0);

                        oldDuration.endTime = oldDuration.startTime + quizDuration;
                    } else if (!!oldDuration) {

                        oldDuration.endTime = new Date().getTime();
                    }
                }
            };


            this.calculateReportDuration = function (report) {
                var result = 0;

                angular.forEach(report.stepDurations, function (duration) {
                    if (!!duration.startTime && !!duration.endTime) {
                        // in case there is an error and endTime < startTime.. lets use 0 instead.. LERGO-468
                        result = result + Math.max(0, (duration.endTime - duration.startTime));
                    }
                });
                return result;
            };
        });
})();
