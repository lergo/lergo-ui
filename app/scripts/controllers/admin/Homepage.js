'use strict';

angular.module('lergoApp')
  .controller('AdminHomepageCtrl', function ($scope, AdminClientService ) {

        AdminClientService.lessons.getLessons().then(function(result){
            $scope.lessons = result.data;
        });


        $scope.makePublic = function(lesson){
           lesson.public = new Date().getTime();
            AdminClientService.lessons.update(lesson);
        }
  });
