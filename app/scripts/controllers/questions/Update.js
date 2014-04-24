'use strict';

angular.module('lergoApp')
  .controller('QuestionsUpdateCtrl', function ($scope, QuestionsService, $routeParams, ContinuousSave, $log  ) {

        var saveQuestion = new ContinuousSave(
            {
                'saveFn' : function( value ){
                    return QuestionsService.updateQuestion(value);
                }
            }
        );

        $scope.saveQuestion = saveQuestion;

        var questionId = $routeParams.questionId;

        $scope.types = QuestionsService.questionsType;

	    QuestionsService.getUserQuestionById(questionId).then(function(result) {
		$scope.quizItem = result.data;
		$scope.errorMessage = null;
	}, function(result) {
		$scope.error = result.data;
		$scope.errorMessage = 'Error in fetching questions by id : ' + result.data.message;
		$log.error($scope.errorMessage);
	});

        $scope.$watch('quizItem', saveQuestion.onValueChange, true);

//        setInterval( function(){ console.log($scope.quizItem)}, 1000);

        $scope.getQuestionUpdateTemplate = function(){
            if ( !!$scope.quizItem && !!$scope.quizItem.type ) {
                var type = QuestionsService.getTypeById($scope.quizItem.type);
                return type.updateTemplate;
            }
            return '';
        };

  });
