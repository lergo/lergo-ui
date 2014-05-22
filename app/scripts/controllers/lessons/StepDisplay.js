'use strict';

angular.module('lergoApp')
  .controller('LessonsStepDisplayCtrl', function ($scope, $log, $routeParams, $sce, LergoClient ) {
        $log.info('showing step');

        if ( !!$routeParams.data ) {
            $scope.step = JSON.parse($routeParams.data);
            $log.info($scope.step);
        }

        function reload() {
            if ( !$scope.step ){
                return;
            }
            $scope.currentIndex = 0;
            $scope.answers = {};


            if ($scope.step.hasOwnProperty('quizItems')) {

                LergoClient.questions.findQuestionsById($scope.step.quizItems).then(function (result) {
                    var questions = {};
                    for (var i in result.data) {
                        questions[result.data[i]._id] = result.data[i];
                    }
                    $scope.questions = questions;
                })

            }
        }

        $scope.
            $watch('step', reload );


        $scope.getQuizItemTemplate = function(id) {
            $scope.quizItem = $scope.questions[id];
            return LergoClient.questions.getTypeById($scope.questions[id].type).viewTemplate;
        };

        function checkAnswer(){
            var quizItem = $scope.quizItem;
            LergoClient.questions.checkAnswer( quizItem).then(function( result ){
                $scope.answers[quizItem._id] = result.data;
            }, function(){
                $log.error('there was an error checking answer');
            });
        }


        $scope.updateAnswer = function( event, answer, quizItem ){
            $log.info('updating answer', arguments );
            quizItem.userAnswer = answer;
            checkAnswer();
        };

        $scope.getQuizItem = function(){
            if ( $scope.step.quizItems.length > $scope.currentIndex ) {
                return $scope.step.quizItems[$scope.currentIndex];
            }
            return null;
        };

        $scope.getAnswer = function(){
            var quizItem = $scope.quizItem;
            return $scope.answers.hasOwnProperty( quizItem._id ) ? $scope.answers[quizItem._id] : null;
        };



        $scope.nextQuizItem = function(){
            var quizItem = $scope.quizItem;
            if ( $scope.answers.hasOwnProperty(quizItem._id) ) {
                $scope.currentIndex++;
            }
        };

        $scope.hasNextQuizItem = function(){
            return $scope.currentIndex < $scope.step.quizItems.length -1 ;
        };



        $scope.getStepViewByType = function( step ){
            var type = 'none';
            if (!!step && !!step.type) {
                type = step.type;
            }
            return 'views/lesson/steps/view/_' + type + '.html';
        };

        $scope.getYoutubeEmbedSource = function( step ){
            var src =  '//www.youtube.com/embed/' + $scope.getVideoId(step) +'?rel=0';
            return $sce.trustAsResourceUrl(src);
        };

        $scope.getVideoId = function(step){
            var value = null;
            if ( step.videoUrl.toLocaleLowerCase().indexOf('youtu.be') > 0 ){
                value = step.videoUrl.substring( step.videoUrl.lastIndexOf('/') +1 );
            }else{
                value = step.videoUrl.split('?')[1].split('v=')[1];
            }


            return value;
        };
  });
