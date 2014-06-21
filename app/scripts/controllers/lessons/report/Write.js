'use strict';


/**
 *
 * This controller write the events from a lesson a report model
 *
 * Usage example:
 *
 *
 *   // example - lets say we have viewing a lesson
 *   $scope.data = lesson;
 *
 *   // lets add a report to the lesson
 *   lesson.report = {};
 *
 *   // lets put the report on the scope
 *   $scope.report = lesson.report;
 *
 *   // call the report controller - the controller will look for "report" on the scope
 *   $controller('LessonsReportWriteCtrl', {$scope: $scope});
 *
 *   // listen to writing on the report and do something with it
 *   $scope.$watch('report', function(){
 *
 *       do something when the repost changes
 *
 *   });
 *
 *
 *
 *
 *
 * The proper structure for a report is the same as a constructed invitation but with more data on it
 *  - it holds the real quiz item instead of an ID
 *  - it holds the user's answer for each quiz item
 *  - it holds the "checkAnswer" response for each answer
 *
 */

angular.module('lergoApp')
    .controller('LessonsReportWriteCtrl', function ($scope, $log ) {

        var report = $scope.report;
        if ( !report.answers ){
            report.answers = [];
        }
        var stepIndex = 0;

        $scope.$on('startLesson', function(event, data){
            $log.info('starting lesson');
            if ( !report.data ) {
                report.data = data;
            }
        });


        $scope.$on('endLesson', function(event ,data){
            $log.info('lesson ended');
            if ( !report.data.finished ){
                report.data.finished = true;
            }
        });

        // data is step
        $scope.$on('nextStepClick', function (event, data) {
            $log.info('nextStepClicked', event, data);
            stepIndex++;
        });



        // in case user answered a question, and then changed the answer, we will need to find the answer again
        function findAnswer( data ){
            for ( var i = 0; i < report.answers.length; i++){
                var item = report.answers[i];
                if ( ( item.quizItemId === data.quizItemId ) && ( stepIndex == stepIndex ) ){
                    return item;
                }
            }
            return null;
        }

        // the idea is we always keep data without changing it.
        // when the report is done, lesson should look like lesson,
        // quizItems should be ids,
        // questions should be the object for the quiz items..
        // just like in DB...
        // the report only adds the answers the user game and whether they are right or not.
        // in order to track down each answer and its correlating step

        $scope.$on('questionAnswered', function( event, data ){
            $log.info('question was answered', data);

            // find answer
            var answer = findAnswer( data );

            if ( !answer ){ // add if not exists
               answer = {};
                report.answers.push(answer);
            }

            // update the answer
            _.merge(answer, {
                'stepIndex' : stepIndex,
                'quizItemId' : data.quizItemId,
                'userAnswer' : data.userAnswer,
                'checkAnswer' : data.checkAnswer
            });
        });


    });
