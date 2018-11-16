/**
 * Created by rahul on 4/9/16.
 */

'use strict';
/*
angular.module('lergoApp').controller('LessonsIndexCtrl', function($scope, $log, LergoClient, $location, $rootScope, $window, localStorageService) {
*/

angular.module('lergoApp').controller('PlaylistPreviewCtrl', function ($scope, playlist, lessons, questions, $uibModalInstance) {
/*function playlistPreviewctrl($scope, playlist, lessons, questions, $uibModalInstance) {*/
    $scope.playlist = playlist;
    $scope.lessons = {};
    $scope.questions = {};
    _.forEach(lessons,function (q){
        {
            $scope.lessons[q._id]= q;
        }
    });

    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    };

});


/*angular.module('lergoApp').controller('PlaylistPreviewCtrl', ['$scope', 'playlist', 'lessons', 'questions', '$uibModalInstance',playlistPreviewctrl]);*/
