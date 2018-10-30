'use strict';

/**
 * @ngdoc directive
 * @name lergoApp.directive:goToMyPlaylistsDemo
 * @description
 * # goToMyPlaylistsDemo
 */
angular.module('lergoApp')
    .directive('goToMyPlaylistsDemo', function (LergoClient, $uibModal , $location, localStorageService) {
        return {
            templateUrl: 'views/demos/goToMyPlaylistsDemo.html',
            restrict: 'A',
            link: function postLink( $scope, element, attrs ) {

                var modalInstance;
                var goToUrl;

                var SEEN_DEMO_STORAGE_KEY='seen.goToMyPlaylistsDemo';

                if ( localStorageService.get(SEEN_DEMO_STORAGE_KEY) ){
                    return;
                }

                var unregister = $scope.$on('$routeChangeStart', function locationChangeStart( event ) {
                    if ( attrs.active !== 'false') {
                        goToUrl = $location.url();
                        event.preventDefault();
                        $scope.openGoToMyPlaylistsDemoDialog();
                    }
                });

                $scope.openGoToMyPlaylistsDemoDialog = function () {
                    modalInstance = $uibModal.open({
                        templateUrl: 'goToMyPlaylistsDemoDialog.html',
                        size: 'lg',
                        windowClass: 'go-to-my-playlists-demo-dialog',
                        scope: $scope
                    });
                };

                $scope.close = function(remember){

                    if ( remember ){
                        localStorageService.set(SEEN_DEMO_STORAGE_KEY, true);
                    }

                    unregister();
                    modalInstance.dismiss();
                    $location.url(goToUrl);
                };

                $scope.okGotIt = function () {
                    $scope.close();
                };

                $scope.dontShowAgain = function(){
                    $scope.close(true);
                };
            }
        };
    });
