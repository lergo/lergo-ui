'use strict';

/**
 * @ngdoc directive
 * @name lergoApp.directive:goToMyLessonsDemo
 * @description
 * # goToMyLessonsDemo
 */
angular.module('lergoApp')
    .directive('goToMyLessonsDemo', function (LergoClient, $uibModal , $location, localStorageService) {
        return {
            templateUrl: 'views/demos/goToMyLessonsDemo.html',
            restrict: 'A',
            link: function postLink( $scope, element, attrs ) {

                var modalInstance;
                var goToUrl;

                var SEEN_DEMO_STORAGE_KEY='seen.goToMyLessonsDemo';

                if ( localStorageService.get(SEEN_DEMO_STORAGE_KEY) ){
                    return;
                }

                var unregister = $scope.$on('$routeChangeStart', function locationChangeStart( event ) {
                    if ( attrs.active !== 'false') {
                        goToUrl = $location.url();
                        event.preventDefault();
                        $scope.openGoToMyLessonsDemoDialog();
                    }
                });

                $scope.openGoToMyLessonsDemoDialog = function () {
                    modalInstance = $uibModal.open({
                        templateUrl: 'goToMyLessonsDemoDialog.html',
                        size: 'lg',
                        windowClass: 'go-to-my-lessons-demo-dialog',
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
