/**
 * Created by rahul on 4/9/16.
 */

'use strict';
/*
angular.module('lergoApp').controller('LessonsIndexCtrl', function($scope, $log, LergoClient, $location, $rootScope, $window, localStorageService) {
*/

angular.module('lergoApp').controller('PlaylistPreviewCtrl', function ($scope, playlist, lesson, questions, $uibModalInstance) {
/*function playlistPreviewctrl($scope, playlist, lessons, questions, $uibModalInstance) {*/
    $scope.playlist = playlist;
    $scope.lesson = lesson;
    $scope.questions = {};

    _.forEach(lesson,function (q){
        {
            $scope.lesson[q._id]= q;
        }
    });

    _.forEach(questions,function (q){
        {
            $scope.questions[q._id]= q;
        }
    });

    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    };

});


/*angular.module('lergoApp').controller('PlaylistPreviewCtrl', ['$scope', 'playlist', 'lessons', 'questions', '$uibModalInstance',playlistPreviewctrl]);*/
