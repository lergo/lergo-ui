'use strict';

angular.module('lergoApp')
  .controller('AdminHomepageCtrl', function ($scope, AdminClientService ) {

        AdminClientService.lessons.getLessons().then(function(result){
            $scope.lessons = result.data;
        });

        $scope.changing = [];
        var changing = $scope.changing;


        function save(lesson) {
            changing.push(lesson._id);
            AdminClientService.lessons.update(lesson).then(function success(result) {
                var indexOf = $scope.lessons.indexOf(lesson);
                $scope.lessons[indexOf] = result.data;
                changing.splice(changing.indexOf(lesson._id), 1);
            }, function error() {
                changing.splice(changing.indexOf(lesson._id), 1);
            })
        }

        $scope.makePublic = function(lesson){
           lesson.public = new Date().getTime();
            save(lesson);
        };

        $scope.makePrivate = function(lesson){
            delete lesson.public;
            save(lesson);
        };

        $scope.isChanging = function(lesson){
            return changing.indexOf(lesson._id) >= 0;
        }
  });
