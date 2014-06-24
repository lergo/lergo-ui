'use strict';

angular.module('lergoApp')
  .directive('createYourOwnBox', function ( LergoClient , $location , $log ) {
    return {
      templateUrl: 'views/directives/_createYourOwnBox.html',
      restrict: 'A',
      link: function postLink($scope/*, element, attrs*/) {
          $scope.create = function() {
              LergoClient.lessons.create().then(function(result) {
                  var lesson = result.data;
                  $scope.errorMessage = null;
                  $location.path('/user/lesson/' + lesson._id + '/update');
              }, function(result) {
                  $scope.errorMessage = 'Error in creating Lesson : ' + result.data.message;
                  $log.error($scope.errorMessage);
              });
          };
      }
    };
  });
