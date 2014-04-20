'use strict';

angular.module('lergoApp')
  .controller('QuestionsIndexCtrl', function ($scope, QuestionsService, $location ) {
    $scope.createNewQuestion = function(){
        QuestionsService.createQuestion({}).then(function(result){
            $location.path('/user/questions/' + result.data._id + '/update');
        },
        function( result ){
            $scope.error = result.data;
        })
    };

    QuestionsService.getUserQuestions().then(function(result){
        $scope.items = result.data;
    },
        function(result){ $scope.error = result.data;}
    );
  });
