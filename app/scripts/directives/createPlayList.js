'use strict';

angular.module('lergoApp')
    .directive('createPlayList', function (LergoClient, $location, $log) {
        return {
            templateUrl: 'views/directives/_createPlayList.html',
            restrict: 'A',
            link: function postLink($scope/*, element, attrs*/) {
                $scope.create = function () {
                    $scope.createBtnDisable=true;
                    LergoClient.playLists.create().then(function (result) {
                        var playlist = result.data;
                        $scope.errorMessage = null;
                        $location.path('/user/playlists/' + playlist._id + '/update');
                    }, function (result) {
                        $scope.errorMessage = 'Error in creating Playlist : ' + result.data.message;
                        $log.error($scope.errorMessage);
                        $scope.createBtnDisable=false;
                    });
                };
            }
        };
    });
