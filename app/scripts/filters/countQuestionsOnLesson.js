(function () {
    'use strict';

    angular.module('lergoApp')
        .filter('countQuestionsOnLesson', function ( LessonsService ) {

            function countQuestionsOnLesson(item) {
                return LessonsService.countQuestions(item);
            }

            countQuestionsOnLesson.$stateful = true;
            return countQuestionsOnLesson;
        });
})();
