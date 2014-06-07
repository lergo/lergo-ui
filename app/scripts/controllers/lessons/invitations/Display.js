'use strict';

angular.module('lergoApp')
  .controller('LessonsInvitationsDisplayCtrl', function ($scope, LergoClient, $routeParams, $log, $controller, ContinuousSave, $rootScope ) {

        $log.info('loading invitation', $routeParams.invitationId);
        $controller('LessonsDisplayCtrl', {$scope: $scope});


        var updateChange = new ContinuousSave({
            'saveFn': function (value) {
                $log.info('updating report');
                return LergoClient.lessonsInvitations.report($scope.invitation._id, value );
            }
        });





        $scope.$watch(function(){ // broadcast end of lesson if not next step
            return !!$scope.invitation && !$scope.hasNextStep();
        }, function( newValue, oldValue ){
            $rootScope.$broadcast('endLesson');
        });



        LergoClient.lessonsInvitations.build( $routeParams.invitationId, true, false).then(function(result){
            $scope.invitation = result.data;
            $scope.lesson = result.data.lesson;
            $scope.questions = {};
            $scope.report = { '_id' : result.data._id };


            $scope.$watch( 'report', updateChange.onValueChange, true);
            $controller('LessonsReportWriteCtrl', {$scope: $scope});


            // broadcast start of lesson
            $rootScope.$broadcast('startLesson', result.data);

            var items = result.data.quizItems;
            if ( !items ){
                return;
            }
            for ( var i = 0; i < items.length; i ++){
                var item = items[i];
                $scope.questions[ item._id ] = item;


            }
        });

  });
