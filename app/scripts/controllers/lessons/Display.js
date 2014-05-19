'use strict';

angular.module('lergoApp')
  .controller('LessonsDisplayCtrl', function ($scope, $routeParams, LergoClient, $log ) {

        LergoClient.lessons.getById( $routeParams.lessonId).then(function( result ){
                $log.info('got lesson', result.data);
        },
            function( result ){
                $log.info('error while getting lesson', result.data);
            }
        )
  });
