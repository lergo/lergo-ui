'use strict';

/**
 * @ngdoc directive
 * @name lergoApp.directive:goToMyLessonsDemo
 * @description
 * # goToMyLessonsDemo
 */
angular.module('lergoApp')
    .directive('goToMyLessonsDemo', function (LergoClient, $modal , $location) {
        return {
            templateUrl: 'views/demos/goToMyLessonsDemo.html',
            restrict: 'A',
            link: function postLink( $scope ) {

                var modalInstance;
                var goToUrl;

                var unregister = $scope.$on('$routeChangeStart', function( event ) {
                    goToUrl = $location.url();
                    event.preventDefault();
                    $scope.openGoToMyLessonsDemoDialog();
                });

                $scope.openGoToMyLessonsDemoDialog = function () {
                    modalInstance = $modal.open({
                        templateUrl: 'goToMyLessonsDemoDialog.html',
                        size: 'lg',
                        windowClass: 'go-to-my-lessons-demo-dialog',
                        scope: $scope
                    });
                };

                $scope.close = function(remember){
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
