/**
 * Created by rahul on 4/9/16.
 */

'use strict';
function playlistPreviewctrl($scope, playlist, lessons, whereAmiI, $uibModalInstance) {
    $scope.playlist = playlist;
    $scope.whereAmiI = whereAmiI;
    $scope.lessons = {};
    _.forEach(lessons,function (q){
        {
            $scope.lessons[q._id]= q;
        }
    });

    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    };
}


angular.module('lergoApp').controller('PlaylistPreviewCtrl', ['$scope', 'playlist', 'lessons', 'whereAmiI', '$uibModalInstance',playlistPreviewctrl]);
 