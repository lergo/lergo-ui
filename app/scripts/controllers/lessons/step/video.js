'use strict';

angular.module('lergoApp')
  .controller('LessonsStepVideoCtrl', function ($scope,LergoClient,$routeParams) {
	  $scope.videoId = $routeParams.videoId;
  });
