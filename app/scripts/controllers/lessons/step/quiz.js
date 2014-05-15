'use strict';

angular.module('lergoApp')
  .controller('LessonsStepQuizCtrl', function ($scope,LergoClient,$log, $routeParams) {
	  $scope.selectedStep = JSON.parse($routeParams.data);
      $scope.questions = {};

        LergoClient.questions.findQuestionsById($scope.selectedStep.quizItems).then(function(result){

            for ( var i = 0; i < result.data.length; i ++ ){
                $scope.questions[result.data[i]._id] = result.data[i];
            }
        });

        $scope.getQuestion = function(questionId ){
            return $scope.questions[questionId];
        };
	  $scope.getQuizItemTemplate = function(id) {
          return LergoClient.questions.getTypeById( $scope.getQuestion(id).type).viewTemplate;
      };
  });
