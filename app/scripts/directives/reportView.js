'use strict';

angular.module('lergoApp')
  .directive('lessonView', function ( $log ) {
    return {
      templateUrl: '/views/lessons/invitations/report/_display.html',
      restrict: 'A',
      scope:{
         'lesson' : '=',
         'answers' : '=',
          'quizItems' : '='
      },
      link: function( $scope, element, attrs ){

          $log.info('showing lesson report');

          $scope.getStepViewByType = function( step ){
              var result = '/views/lessons/invitations/report/steps/_' + step.type + '.html';
              $log.info('result', result);
              return  result;
          }
      }

    };
  });
