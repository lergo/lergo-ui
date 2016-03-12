'use strict';

angular.module('lergoApp')
    .filter('countQuestionsOnLesson', function () {

        function countQuestionsOnLesson(item) {
            try {
                return _.sumBy(item.steps, function (step) {
                    return step.type === 'quiz' ? _.size(step.quizItems) : 0;
                });
            } catch (e) {
                return 0;
            }
        }

        countQuestionsOnLesson.$stateful = true;
        return countQuestionsOnLesson;
    });
