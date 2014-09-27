'use strict';

angular.module('lergoApp')
    .filter('countQuestionsOnLesson', function () {

        return function (item) {
            var qCount = 0;
            try {
                if (!item || !item.steps) {
                    return qCount;
                }

                if ( item.hasOwnProperty('questionsCount') ){
                    return item.questionsCount;
                }

                for (var i = 0; i < item.steps.length; i++) {
                    if (!!item.steps[i].quizItems) {
                        qCount = qCount + item.steps[i].quizItems.length;
                    }
                }

                if ( qCount > 0 ){
                    item.questionsCount = qCount;
                }

            }catch(e){
                return qCount;
            }


            return qCount;

        };
    });
