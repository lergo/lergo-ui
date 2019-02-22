(function () {
    'use strict';

    /**
     * @ngdoc filter
     * @name lergoApp.filter:shuffleQuestions
     * @function
     * @description
     * # shuffleQuestions <br/>
     * This filter handles questions.<br/>
     * It adds on top of the {@link shuffle} filter and handles questions with answers
     *
     */
    angular.module('lergoApp')

        .filter('shuffleQuestions', function ($filter, $log, ReportsService) {

            /**
             * @description
             * the actual filter
             * @param {object} opts
             * @param {boolean} opts.disabled true iff the filter should do nothing
             * @param {array<string>} opts.array array of ids to shuffle
             * @param {boolean} opts.array.isShuffed true iff array is already shuffled and the filter should do nothing
             * @param {Report} opts.report the report with the questions and answers
             * @param {integer} opts.stepIndex the index of current step
             *
             */
            return function (opts) {

                // validate data exists
                if (!opts.array || !!opts.disabled || !!opts.array.isShuffled) {
                    return opts.array;
                }

                // invoke the shuffle filter
                $filter('shuffle')(opts.array, opts.disabled);

                //sort questions according to answer existence. this adds supports to continue lesson LERGO-583.
                // we can only apply this if we have the report and current step index
                if (_.isDefined(opts.stepIndex) && _.isDefined(opts.report) ) { // if both exists, all is well

                    // returns answers for stepIndex as a map by id.
                    var answers = ReportsService.getAnswersByQuizItemId(opts.report, opts.stepIndex);

                    opts.array.sort(function (a, b) {
                        var aHasAnswer = answers.hasOwnProperty(a);
                        var bHasAnswer = answers.hasOwnProperty(b);
                        if (aHasAnswer && bHasAnswer) {
                            return 0;
                        }
                        if (aHasAnswer) {
                            return -1;
                        }
                        return 1;
                    });
                } else if ( _.isDefined(opts.stepIndex) || _.isDefined(opts.report) ) { // if one exists, print error

                    $log.error('one of stepIndex or report exists, but the other does not. seems like a bug to me..');
                }

                $log.debug('this is the shuffled array',opts.array);

                return opts.array;
            };
    });
})();
